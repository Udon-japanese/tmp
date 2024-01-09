/*
  Warnings:

  - Made the column `answerType` on table `questiondrafts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statement` on table `questiondrafts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `correctAnswerId` on table `questiondrafts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `explanation` on table `questiondrafts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "questiondrafts" ALTER COLUMN "answerType" SET NOT NULL,
ALTER COLUMN "statement" SET NOT NULL,
ALTER COLUMN "correctAnswerId" SET NOT NULL,
ALTER COLUMN "explanation" SET NOT NULL;
