-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('NONE', 'BANK_TRANSFER', 'PAYMENT_LINK');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_REQUIRED', 'UNPAID', 'SUBMITTED', 'PAID');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "requiresPayment" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "priceAmount" INTEGER;
ALTER TABLE "Event" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'NGN';
ALTER TABLE "Event" ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'NONE';
ALTER TABLE "Event" ADD COLUMN "paymentLink" TEXT;
ALTER TABLE "Event" ADD COLUMN "paymentInstructions" TEXT;
ALTER TABLE "Event" ADD COLUMN "requireLogin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Event" ADD COLUMN "collectPhone" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "collectNotes" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "confirmationMessage" TEXT;

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NOT_REQUIRED';
ALTER TABLE "EventRegistration" ADD COLUMN "paymentReference" TEXT;
