-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'CASH', 'BANK_TRANSFER', 'ZELLE', 'OTHER');

-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'STRIPE',
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "recordedById" TEXT,
ADD COLUMN     "reference" TEXT;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
