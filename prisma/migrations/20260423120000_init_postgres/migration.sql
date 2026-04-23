-- CreateTable
CREATE TABLE "PublishedIsland" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupName" TEXT NOT NULL,
    "valueIds" JSONB NOT NULL,
    "textIds" JSONB NOT NULL,
    "practiceIds" JSONB NOT NULL,
    "reflection" TEXT NOT NULL,

    CONSTRAINT "PublishedIsland_pkey" PRIMARY KEY ("id")
);
