// prisma/import-v2.cjs
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// 재귀로 모든 .json 찾기
function findJsonFiles(root) {
  const out = [];
  const stack = [root];
  while (stack.length) {
    const cur = stack.pop();
    try {
      const entries = fs.readdirSync(cur, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(cur, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) out.push(p);
      }
    } catch (_) {}
  }
  return out;
}

function buildEmergency(em) {
  if (!em) return null;
  const nums = [em?.police?.number, em?.ambulance?.number, em?.fire?.number].filter(Boolean);
  return nums.length ? nums.join("/") : null;
}

function buildEmbassy(e, calling) {
  if (!e) return null;
  const phones = (e.phones || [])
    .map((p) => `${p.label ? p.label + ":" : ""} ${p.number || ""}`.trim())
    .filter(Boolean)
    .join(", ");
  const parts = [
    e.name,
    e.address,
    phones ? `Phones: ${phones}` : "",
    e.fax ? `Fax: ${e.fax}` : "",
    calling ? `Calling code: ${calling}` : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

async function upsertLanguage(code, name) {
  return prisma.language.upsert({
    where: { code },
    update: { name: name || code },
    create: { code, name: name || code },
  });
}

async function main() {
  // 후보 경로(필요하면 더 추가)
  const candidates = [
    path.join(process.cwd(), "public", "packs"),
    path.join(process.cwd(), "public", "data", "packs"),
    path.join(process.cwd(), "public", "데이터", "팩스"),
  ];

  // 파일 수집
  let files = [];
  for (const c of candidates) {
    const found = findJsonFiles(c);
    console.log(found.length ? `Using dir: ${c} files: ${found.length}` : `No json in: ${c}`);
    files = files.concat(found);
  }
  files = Array.from(new Set(files));
  console.log("Total json files:", files.length);
  if (!files.length) {
    console.error("❌ JSON 파일을 찾지 못했습니다. 실제 경로를 확인하세요.");
    return;
  }

  // 소유자 유저 확보
  const owner = await prisma.user.upsert({
    where: { email: "owner@trip.local" },
    update: {},
    create: { email: "owner@trip.local", password: "temp", name: "Owner" },
  });

  let ok = 0, fail = 0;
  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      const cc = raw.country_code;
      const name = raw.country_name;
      if (!cc || !name) {
        console.warn("Skip (missing country_code/country_name):", file);
        continue;
      }

      const emergency = buildEmergency(raw.emergency);
      const embassy = buildEmbassy(raw.embassy_kr, raw.calling_code);

      const country = await prisma.country.upsert({
        where: { countryCode: cc },
        update: {
          name,
          nameKo: raw.nameKo || null,
          embassyLocation: embassy,
          emergencyNumber: emergency,
          userId: owner.id,
        },
        create: {
          countryCode: cc,
          name,
          nameKo: raw.nameKo || null,
          embassyLocation: embassy,
          emergencyNumber: emergency,
          userId: owner.id,
        },
      });

      const langs = Array.isArray(raw.languages) ? raw.languages : [];
      for (let i = 0; i < langs.length; i++) {
        const code = String(langs[i] || "").trim();
        if (!code) continue;
        const lang = await upsertLanguage(code);
        await prisma.countryLanguage.upsert({
          where: { countryId_languageId: { countryId: country.id, languageId: lang.id } },
          update: { isOfficial: i === 0 },
          create: { countryId: country.id, languageId: lang.id, isOfficial: i === 0 },
        });
      }

      console.log("OK:", cc, name, "from", file);
      ok++;
    } catch (e) {
      console.error("FAIL:", file, "\n", e?.message || e);
      fail++;
    }
  }

  console.log(`Done. success=${ok}, fail=${fail}`);
}

main().finally(() => prisma.$disconnect());
