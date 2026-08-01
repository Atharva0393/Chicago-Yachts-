-- AlterTable
ALTER TABLE "BookingHold" ADD COLUMN     "depositAmount" DECIMAL(10,2),
ADD COLUMN     "depositPercentage" DECIMAL(5,2),
ADD COLUMN     "remainingBalance" DECIMAL(10,2);
