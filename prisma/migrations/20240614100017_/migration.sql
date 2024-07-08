-- AlterTable
ALTER TABLE "Experiment" ADD COLUMN "succesRate" REAL;

-- CreateTable
CREATE TABLE "ErrorLogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "captcha" TEXT NOT NULL,
    "userResponse" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SentenceCaptchaForExperiment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "experimentId" TEXT NOT NULL,
    "captchaId" INTEGER NOT NULL,
    "userResponse" TEXT,
    "isItSucseed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SentenceCaptchaForExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SentenceCaptchaForExperiment_captchaId_fkey" FOREIGN KEY ("captchaId") REFERENCES "SentenceCaptchas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SentenceCaptchaForExperiment" ("captchaId", "experimentId", "id", "userResponse") SELECT "captchaId", "experimentId", "id", "userResponse" FROM "SentenceCaptchaForExperiment";
DROP TABLE "SentenceCaptchaForExperiment";
ALTER TABLE "new_SentenceCaptchaForExperiment" RENAME TO "SentenceCaptchaForExperiment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
