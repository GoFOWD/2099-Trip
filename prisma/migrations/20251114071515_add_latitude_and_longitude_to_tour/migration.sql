/*
  Warnings:

  - Added the required column `latitude` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Tour" DROP CONSTRAINT "Tour_countryId_fkey";

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "latitude" INTEGER NOT NULL,
ADD COLUMN     "longitude" INTEGER NOT NULL,
ALTER COLUMN "countryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
