/*
  Warnings:

  - You are about to drop the `_CountryToSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_CountryToSchedule" DROP CONSTRAINT "_CountryToSchedule_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CountryToSchedule" DROP CONSTRAINT "_CountryToSchedule_B_fkey";

-- DropTable
DROP TABLE "public"."_CountryToSchedule";

-- CreateTable
CREATE TABLE "VisitCountry" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "VisitCountry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitCountry" ADD CONSTRAINT "VisitCountry_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
