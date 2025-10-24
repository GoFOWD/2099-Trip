-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('ONE_WAY', 'ROUND_TRIP');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirTicket" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "airline" TEXT NOT NULL,
    "tripType" "TripType" NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "AirTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flightSegment" (
    "id" TEXT NOT NULL,
    "departurePort" TEXT NOT NULL,
    "arrivalPort" TEXT NOT NULL,
    "departureCountry" TEXT NOT NULL,
    "arrivalCountry" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airTicketId" TEXT NOT NULL,

    CONSTRAINT "flightSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "haveReservedAirLine" BOOLEAN NOT NULL DEFAULT false,
    "haveReservedionHotel" BOOLEAN NOT NULL DEFAULT false,
    "haveReservedTour" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "price" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "pic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "location" TEXT NOT NULL,
    "countryId" TEXT,
    "scheduled" TEXT,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "Amenityname" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "airTicketPlan" INTEGER NOT NULL,
    "hotelPlan" INTEGER NOT NULL,
    "actualHotelSpending" INTEGER NOT NULL,
    "totalBudget" INTEGER NOT NULL,
    "actualAirTicketSpending" INTEGER NOT NULL,
    "actualTourSpending" INTEGER NOT NULL,
    "otherSpending" INTEGER NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKo" TEXT,
    "embassyLocation" TEXT,
    "emergencyNumber" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryLanguage" (
    "countryId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "CountryLanguage_pkey" PRIMARY KEY ("countryId","languageId")
);

-- CreateTable
CREATE TABLE "Caution" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Caution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AmenityToHotel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AmenityToHotel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CountryToSchedule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CountryToSchedule_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Country_countryCode_key" ON "Country"("countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE INDEX "CountryLanguage_languageId_idx" ON "CountryLanguage"("languageId");

-- CreateIndex
CREATE INDEX "Caution_countryId_idx" ON "Caution"("countryId");

-- CreateIndex
CREATE INDEX "_AmenityToHotel_B_index" ON "_AmenityToHotel"("B");

-- CreateIndex
CREATE INDEX "_CountryToSchedule_B_index" ON "_CountryToSchedule"("B");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirTicket" ADD CONSTRAINT "AirTicket_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirTicket" ADD CONSTRAINT "AirTicket_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flightSegment" ADD CONSTRAINT "flightSegment_airTicketId_fkey" FOREIGN KEY ("airTicketId") REFERENCES "AirTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLanguage" ADD CONSTRAINT "CountryLanguage_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLanguage" ADD CONSTRAINT "CountryLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caution" ADD CONSTRAINT "Caution_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmenityToHotel" ADD CONSTRAINT "_AmenityToHotel_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmenityToHotel" ADD CONSTRAINT "_AmenityToHotel_B_fkey" FOREIGN KEY ("B") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToSchedule" ADD CONSTRAINT "_CountryToSchedule_A_fkey" FOREIGN KEY ("A") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToSchedule" ADD CONSTRAINT "_CountryToSchedule_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
