/*
  Warnings:

  - You are about to drop the column `experimentId` on the `SentenceCaptchas` table. All the data in the column will be lost.
  - You are about to drop the column `experimentId` on the `TraditionalCaptchas` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "TraditionalCaptchaForExperiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experimentId" TEXT NOT NULL,
    "captchaId" TEXT NOT NULL,
    CONSTRAINT "TraditionalCaptchaForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TraditionalCaptchaForExperiment_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "TraditionalCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SentenceCaptchaForExperiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experimentId" TEXT NOT NULL,
    "captchaId" TEXT NOT NULL,
    CONSTRAINT "SentenceCaptchaForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SentenceCaptchaForExperiment_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "SentenceCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SentenceCaptchas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    CONSTRAINT "SentenceCaptchas_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "Language" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SentenceCaptchas" ("captcha", "id", "languageName", "length") SELECT "captcha", "id", "languageName", "length" FROM "SentenceCaptchas";
DROP TABLE "SentenceCaptchas";
ALTER TABLE "new_SentenceCaptchas" RENAME TO "SentenceCaptchas";
CREATE TABLE "new_TraditionalCaptchas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "length" INTEGER NOT NULL
);
INSERT INTO "new_TraditionalCaptchas" ("captcha", "id", "length") SELECT "captcha", "id", "length" FROM "TraditionalCaptchas";
DROP TABLE "TraditionalCaptchas";
ALTER TABLE "new_TraditionalCaptchas" RENAME TO "TraditionalCaptchas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
