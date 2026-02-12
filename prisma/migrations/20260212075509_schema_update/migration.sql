/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `imageKey` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "featuredImage",
DROP COLUMN "imageKey",
DROP COLUMN "type",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubscriberOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thumbnailUrl" TEXT;
