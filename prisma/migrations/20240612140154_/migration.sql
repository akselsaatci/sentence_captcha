/*
  Warnings:

  - Added the required column `userResponse` to the `UserExperiment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserExperiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userResponse" TEXT NOT NULL,
    CONSTRAINT "UserExperiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "StandardExperiments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserExperiment" ("accuracy", "createdAt", "experimentId", "id", "timeTaken", "userId") SELECT "accuracy", "createdAt", "experimentId", "id", "timeTaken", "userId" FROM "UserExperiment";
DROP TABLE "UserExperiment";
ALTER TABLE "new_UserExperiment" RENAME TO "UserExperiment";
CREATE INDEX "UserExperiment_userId_idx" ON "UserExperiment"("userId");
CREATE INDEX "UserExperiment_experimentId_idx" ON "UserExperiment"("experimentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
