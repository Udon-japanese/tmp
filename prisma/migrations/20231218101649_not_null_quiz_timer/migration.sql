/*
  Warnings:

  - Made the column `timer` on table `questiondrafts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timer` on table `questions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "questiondrafts" ALTER COLUMN "timer" SET NOT NULL,
ALTER COLUMN "timer" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "questions" ALTER COLUMN "timer" SET NOT NULL,
ALTER COLUMN "timer" SET DEFAULT 0;
