-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING', 'QUALIFIED', 'DISQUALIFIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionStatus" TEXT DEFAULT 'inactive',
    "calendarLink" TEXT,
    "slackWebhookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "budget" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "problemDescription" TEXT NOT NULL,
    "aiScore" INTEGER,
    "aiReasoning" TEXT,
    "aiSummary" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT DEFAULT 'form',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringRules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "budgetWeight" INTEGER NOT NULL DEFAULT 30,
    "timelineWeight" INTEGER NOT NULL DEFAULT 25,
    "urgencyWeight" INTEGER NOT NULL DEFAULT 25,
    "qualityWeight" INTEGER NOT NULL DEFAULT 20,
    "minScore" INTEGER NOT NULL DEFAULT 6,

    CONSTRAINT "ScoringRules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ScoringRules_userId_key" ON "ScoringRules"("userId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoringRules" ADD CONSTRAINT "ScoringRules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
