/*
  Warnings:

  - You are about to drop the column `timeTaken` on the `Experiment` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Experiment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "mistakeCount" INTEGER NOT NULL,
    "isTraditional" BOOLEAN NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Experiment" ("accuracy", "createdAt", "id", "isCompleted", "isTraditional", "mistakeCount", "userId") SELECT "accuracy", "createdAt", "id", "isCompleted", "isTraditional", "mistakeCount", "userId" FROM "Experiment";
DROP TABLE "Experiment";
ALTER TABLE "new_Experiment" RENAME TO "Experiment";
CREATE INDEX "Experiment_userId_idx" ON "Experiment"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
