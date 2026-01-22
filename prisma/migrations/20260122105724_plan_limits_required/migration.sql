/*
  Warnings:

  - Made the column `limits` on table `plans` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "plans" ALTER COLUMN "limits" SET NOT NULL;
