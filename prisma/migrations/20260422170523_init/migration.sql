-- CreateTable
CREATE TABLE "PublishedIsland" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupName" TEXT NOT NULL,
    "valueIds" JSONB NOT NULL,
    "textIds" JSONB NOT NULL,
    "practiceIds" JSONB NOT NULL,
    "reflection" TEXT NOT NULL
);
