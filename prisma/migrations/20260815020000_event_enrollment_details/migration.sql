-- AlterTable
ALTER TABLE "Event" ADD COLUMN "outline" TEXT;
ALTER TABLE "Event" ADD COLUMN "audience" TEXT;
ALTER TABLE "Event" ADD COLUMN "includes" TEXT;
ALTER TABLE "Event" ADD COLUMN "scheduleNotes" TEXT;
ALTER TABLE "Event" ADD COLUMN "collectCity" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "collectEmergency" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "collectExperience" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "collectPortfolio" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Event" ADD COLUMN "collectGuardian" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN "details" JSONB;
