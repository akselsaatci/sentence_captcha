-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StandardExperiments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "captcha" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "UserExperiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "accuracy" REAL NOT NULL,
    "timeTaken" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserExperiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "StandardExperiments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserExperiment_userId_idx" ON "UserExperiment"("userId");

-- CreateIndex
CREATE INDEX "UserExperiment_experimentId_idx" ON "UserExperiment"("experimentId");
