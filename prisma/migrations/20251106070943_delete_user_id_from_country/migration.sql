-- DropForeignKey
ALTER TABLE "public"."Country" DROP CONSTRAINT "Country_userId_fkey";

-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
