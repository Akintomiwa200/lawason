-- CreateEnum
CREATE TYPE "EventFormat" AS ENUM ('IN_PERSON', 'ONLINE_APP', 'ZOOM', 'GOOGLE_MEET', 'HYBRID');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'PAYSTACK';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "format" "EventFormat" NOT NULL DEFAULT 'IN_PERSON';
ALTER TABLE "Event" ADD COLUMN "meetingUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN "meetingId" TEXT;
ALTER TABLE "Event" ADD COLUMN "meetingPasscode" TEXT;
ALTER TABLE "Event" ADD COLUMN "streamUrl" TEXT;
ALTER TABLE "Event" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Africa/Lagos';

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN "paymentProvider" TEXT;
ALTER TABLE "EventRegistration" ADD COLUMN "paidAt" TIMESTAMP(3);
