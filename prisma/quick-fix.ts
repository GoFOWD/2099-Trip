import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1) 유저 1명 (없으면 생성)
  const user = await prisma.user.upsert({
    where: { email: "test@trip.com" },
    update: {},
    create: { email: "test@trip.com", password: "1234", name: "Test" },
  });

  // 2) Country: Japan (없으면 생성, 있으면 소유자 연결)
  const jp = await prisma.country.upsert({
    where: { countryCode: "JP" },
    update: { name: "Japan", userId: user.id },
    create: { countryCode: "JP", name: "Japan", userId: user.id },
  });

  // 3) Language 두 개(영어명 수정 포함)
  const ja = await prisma.language.upsert({
    where: { code: "ja" },
    update: { name: "Japanese" },
    create: { code: "ja", name: "Japanese" },
  });
  const en = await prisma.language.upsert({
    where: { code: "en" },
    update: { name: "English" }, // ← England로 돼 있으면 English로 교정
    create: { code: "en", name: "English" },
  });

  // 4) CountryLanguage 연결(중복이면 업데이트)
  await prisma.countryLanguage.upsert({
    where: { countryId_languageId: { countryId: jp.id, languageId: ja.id } },
    update: { isOfficial: true },
    create: { countryId: jp.id, languageId: ja.id, isOfficial: true },
  });
  await prisma.countryLanguage.upsert({
    where: { countryId_languageId: { countryId: jp.id, languageId: en.id } },
    update: { isOfficial: false },
    create: { countryId: jp.id, languageId: en.id, isOfficial: false },
  });

  // 5) 주의사항 하나 예시
  await prisma.caution.upsert({
    where: { id: 1 }, // 없으면 실패하니 create로 가자
    update: {},
    create: { countryId: jp.id, title: "지진 대피", content: "탁자 아래 대피 후 대피소 이동" },
  });

  console.log("Quick fix done.");
}

main().finally(() => prisma.$disconnect());
