-- DropForeignKey
ALTER TABLE "public"."AirTicket" DROP CONSTRAINT "AirTicket_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Hotel" DROP CONSTRAINT "Hotel_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."flightSegment" DROP CONSTRAINT "flightSegment_airTicketId_fkey";

-- AddForeignKey
ALTER TABLE "AirTicket" ADD CONSTRAINT "AirTicket_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flightSegment" ADD CONSTRAINT "flightSegment_airTicketId_fkey" FOREIGN KEY ("airTicketId") REFERENCES "AirTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
