-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "cityName" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "City_scheduleId_key" ON "City"("scheduleId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
