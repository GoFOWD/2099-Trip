/*
  Warnings:

  - You are about to drop the column `countryId` on the `AirTicket` table. All the data in the column will be lost.
  - Added the required column `airportName` to the `flightSegment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrivalCity` to the `flightSegment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureCity` to the `flightSegment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AirTicket" DROP CONSTRAINT "AirTicket_countryId_fkey";

-- AlterTable
ALTER TABLE "AirTicket" DROP COLUMN "countryId";

-- AlterTable
ALTER TABLE "flightSegment" ADD COLUMN     "airportName" TEXT NOT NULL,
ADD COLUMN     "arrivalCity" TEXT NOT NULL,
ADD COLUMN     "departureCity" TEXT NOT NULL;
