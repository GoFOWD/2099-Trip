-- DropForeignKey
ALTER TABLE "public"."Budget" DROP CONSTRAINT "Budget_scheduleId_fkey";

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
