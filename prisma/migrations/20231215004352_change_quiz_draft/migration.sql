/*
  Warnings:

  - Made the column `title` on table `quizdrafts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "quizdrafts" ALTER COLUMN "title" SET NOT NULL;
