-- CreateTable
CREATE TABLE "plans" (
    "name" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,
    "limits" JSONB,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_priceId_key" ON "plans"("priceId");
