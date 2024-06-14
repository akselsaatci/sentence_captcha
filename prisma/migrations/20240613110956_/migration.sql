-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "mistakeCount" INTEGER NOT NULL,
    "isTraditional" BOOLEAN NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Experiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Experiment" ("accuracy", "createdAt", "endTime", "id", "isCompleted", "isTraditional", "mistakeCount", "startTime", "userId") SELECT "accuracy", "createdAt", "endTime", "id", "isCompleted", "isTraditional", "mistakeCount", "startTime", "userId" FROM "Experiment";
DROP TABLE "Experiment";
ALTER TABLE "new_Experiment" RENAME TO "Experiment";
CREATE INDEX "Experiment_userId_idx" ON "Experiment"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
