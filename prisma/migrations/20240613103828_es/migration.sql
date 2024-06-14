/*
  Warnings:

  - You are about to drop the `StandardExperiments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserExperiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StandardExperiments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserExperiment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "mistakeCount" INTEGER NOT NULL,
    "isTraditional" BOOLEAN NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TraditionalCaptchas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "experimentId" TEXT,
    CONSTRAINT "TraditionalCaptchas_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SentenceCaptchas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "experimentId" TEXT,
    "languageName" TEXT NOT NULL,
    CONSTRAINT "SentenceCaptchas_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "Language" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SentenceCaptchas_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserAnswersForSentenceCaptcha" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sentenceCaptchaId" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "userResponse" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAnswersForSentenceCaptcha_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswersForSentenceCaptcha_sentenceCaptchaId_fkey" FOREIGN KEY ("sentenceCaptchaId") REFERENCES "SentenceCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswersForSentenceCaptcha_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Language" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE INDEX "Experiment_userId_idx" ON "Experiment"("userId");

-- CreateIndex
CREATE INDEX "UserAnswersForSentenceCaptcha_userId_idx" ON "UserAnswersForSentenceCaptcha"("userId");

-- CreateIndex
CREATE INDEX "UserAnswersForSentenceCaptcha_sentenceCaptchaId_idx" ON "UserAnswersForSentenceCaptcha"("sentenceCaptchaId");

-- CreateIndex
CREATE INDEX "UserAnswersForSentenceCaptcha_experimentId_idx" ON "UserAnswersForSentenceCaptcha"("experimentId");
