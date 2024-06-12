/*
  Warnings:

  - Added the required column `href` to the `StandardExperiments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTraditional` to the `StandardExperiments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StandardExperiments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL,
    "href" TEXT NOT NULL,
    "isTraditional" BOOLEAN NOT NULL
);
INSERT INTO "new_StandardExperiments" ("captcha", "id", "isActivated") SELECT "captcha", "id", "isActivated" FROM "StandardExperiments";
DROP TABLE "StandardExperiments";
ALTER TABLE "new_StandardExperiments" RENAME TO "StandardExperiments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
