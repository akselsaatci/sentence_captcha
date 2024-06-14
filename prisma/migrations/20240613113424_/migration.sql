/*
  Warnings:

  - The primary key for the `SentenceCaptchaForExperiment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `captchaId` on the `SentenceCaptchaForExperiment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `SentenceCaptchaForExperiment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `SentenceCaptchas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `SentenceCaptchas` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `TraditionalCaptchaForExperiment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `captchaId` on the `TraditionalCaptchaForExperiment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `TraditionalCaptchaForExperiment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `TraditionalCaptchas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `TraditionalCaptchas` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SentenceCaptchaForExperiment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "experimentId" TEXT NOT NULL,
    "captchaId" INTEGER NOT NULL,
    "userResponse" TEXT,
    CONSTRAINT "SentenceCaptchaForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SentenceCaptchaForExperiment_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "SentenceCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SentenceCaptchaForExperiment" ("captchaId", "experimentId", "id", "userResponse") SELECT "captchaId", "experimentId", "id", "userResponse" FROM "SentenceCaptchaForExperiment";
DROP TABLE "SentenceCaptchaForExperiment";
ALTER TABLE "new_SentenceCaptchaForExperiment" RENAME TO "SentenceCaptchaForExperiment";
CREATE TABLE "new_SentenceCaptchas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "captcha" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    CONSTRAINT "SentenceCaptchas_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "Language" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SentenceCaptchas" ("captcha", "id", "languageName", "length") SELECT "captcha", "id", "languageName", "length" FROM "SentenceCaptchas";
DROP TABLE "SentenceCaptchas";
ALTER TABLE "new_SentenceCaptchas" RENAME TO "SentenceCaptchas";
CREATE TABLE "new_TraditionalCaptchaForExperiment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "experimentId" TEXT NOT NULL,
    "captchaId" INTEGER NOT NULL,
    CONSTRAINT "TraditionalCaptchaForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TraditionalCaptchaForExperiment_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "TraditionalCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TraditionalCaptchaForExperiment" ("captchaId", "experimentId", "id") SELECT "captchaId", "experimentId", "id" FROM "TraditionalCaptchaForExperiment";
DROP TABLE "TraditionalCaptchaForExperiment";
ALTER TABLE "new_TraditionalCaptchaForExperiment" RENAME TO "TraditionalCaptchaForExperiment";
CREATE TABLE "new_TraditionalCaptchas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "captcha" TEXT NOT NULL,
    "length" INTEGER NOT NULL
);
INSERT INTO "new_TraditionalCaptchas" ("captcha", "id", "length") SELECT "captcha", "id", "length" FROM "TraditionalCaptchas";
DROP TABLE "TraditionalCaptchas";
ALTER TABLE "new_TraditionalCaptchas" RENAME TO "TraditionalCaptchas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
