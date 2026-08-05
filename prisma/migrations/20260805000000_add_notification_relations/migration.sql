-- AlterTable
ALTER TABLE "Notification" ADD COLUMN "bookingId" TEXT;
ALTER TABLE "Notification" ADD COLUMN "customerId" TEXT;
ALTER TABLE "Notification" ADD COLUMN "sentAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
