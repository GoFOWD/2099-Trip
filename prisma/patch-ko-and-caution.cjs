// prisma/patch-ko-and-caution.cjs
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ▼ 필요한 나라만 점점 추가해서 쓰면 됨 (예시로 10개만 시작)
const nameKoMap = {
  JP: "일본",
  AR: "아르헨티나",
  AU: "오스트레일리아",
  BD: "방글라데시",
  BE: "벨기에",
  BG: "불가리아",
  BO: "볼리비아",
  BR: "브라질",
  CA: "캐나다",
  CH: "스위스",
  CL: "칠레",
  CN: "중국",
  DE: "독일",
  DK: "덴마크",
  EG: "이집트",
  ES: "스페인",
  FI: "핀란드",
  FR: "프랑스",
  GB: "영국",
  GR: "그리스",
  HK: "홍콩",
  HR: "크로아티아",
  ID: "인도네시아",
  IN: "인도",
  IS: "아이슬란드",
  IT: "이탈리아",
  KE: "케냐",
  KH: "콜롬비아",
  KZ: "카자흐스탄",
  LA: "라오스",
  MA: "모로코",
  ML: "말리",
  MM: "미얀마",
  MN: "몽골",
  MX: "멕시코",
  MY: "말레이시아",
  NG: "나이지리아",
  NL: "네델란드",
  NO: "노르웨이",
  NZ: "뉴질랜드",
  PH: "필리핀",
  PL: "폴란드",
  PT: "포르투갈",
  PY: "파라과이",
  RO: "루마니아",
  RU: "러시아",
  SE: "스웨덴",
  SG: "싱가포르",
  SR: "수리남",
  TH: "태국",
  TR: "튀르키예",
  TW: "대만",
  UA: "우크라이나",
  US: "미국",
  UY: "우루과이",
  UZ: "우즈베키스탄",
  VN: "베트남",
  ZA: "남아프리카공화국"
  // ... 56개 전체 채우면 한 방에 반영됨
};

// 이미 caution 이 없을 때만 기본 주의사항 한 건 넣고 싶다면 true
const ADD_DEFAULT_CAUTION_IF_EMPTY = true;

async function main() {
  const countries = await prisma.country.findMany({
    select: { id: true, countryCode: true, nameKo: true },
  });

  let updatedKo = 0, addedCaution = 0;

  for (const c of countries) {
    // 1) nameKo 채우기
    const ko = nameKoMap[c.countryCode];
    if (ko && c.nameKo !== ko) {
      await prisma.country.update({
        where: { id: c.id },
        data: { nameKo: ko },
      });
      updatedKo++;
    }

    // 2) Caution 기본값(없을 때만)
    if (ADD_DEFAULT_CAUTION_IF_EMPTY) {
      const cnt = await prisma.caution.count({ where: { countryId: c.id } });
      if (cnt === 0) {
        await prisma.caution.create({
          data: {
            countryId: c.id,
            title: "비상연락/안전 기본 안내",
            content:
              "현지 비상번호와 대사관 연락처를 확인하세요. 소지품 분실/도난 주의, 밤 늦은 시간 단독 이동 자제.",
          },
        });
        addedCaution++;
      }
    }
  }

  console.log(`nameKo updated: ${updatedKo}, default cautions added: ${addedCaution}`);
}

main().finally(() => prisma.$disconnect());
