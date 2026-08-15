-- AlterTable
ALTER TABLE "User" ADD COLUMN "location" TEXT;
ALTER TABLE "User" ADD COLUMN "bio" TEXT;
ALTER TABLE "User" ADD COLUMN "facebook" TEXT;
ALTER TABLE "User" ADD COLUMN "twitter" TEXT;
ALTER TABLE "User" ADD COLUMN "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN "instagram" TEXT;
ALTER TABLE "User" ADD COLUMN "education" JSONB;
ALTER TABLE "User" ADD COLUMN "jobs" JSONB;
ALTER TABLE "User" ADD COLUMN "skills" JSONB;
ALTER TABLE "User" ADD COLUMN "interestTags" JSONB;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN "category" TEXT;
ALTER TABLE "Event" ADD COLUMN "organizer" TEXT;

-- CreateTable
CREATE TABLE "EventInterest" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventInterest_eventId_userId_key" ON "EventInterest"("eventId", "userId");

-- CreateIndex
CREATE INDEX "EventInterest_userId_idx" ON "EventInterest"("userId");

-- AddForeignKey
ALTER TABLE "EventInterest" ADD CONSTRAINT "EventInterest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInterest" ADD CONSTRAINT "EventInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
