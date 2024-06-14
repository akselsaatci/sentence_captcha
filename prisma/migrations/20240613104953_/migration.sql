/*
  Warnings:

  - You are about to drop the `UserAnswersForSentenceCaptcha` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "SentenceCaptchaForExperiment" ADD COLUMN "userResponse" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserAnswersForSentenceCaptcha";
PRAGMA foreign_keys=on;
