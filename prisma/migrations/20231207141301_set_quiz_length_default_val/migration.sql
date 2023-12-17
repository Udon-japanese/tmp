/*
  Warnings:

  - Made the column `length` on table `quizzes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "length" SET DEFAULT 1;
