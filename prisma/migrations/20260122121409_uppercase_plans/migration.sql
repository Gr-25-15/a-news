/*
  Warnings:

  - You are about to drop the `plans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "plans";

-- CreateTable
CREATE TABLE "Plans" (
    "name" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "limits" JSONB NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plans_priceId_key" ON "Plans"("priceId");
