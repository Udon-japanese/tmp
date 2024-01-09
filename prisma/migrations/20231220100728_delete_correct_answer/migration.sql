/*
  Warnings:

  - You are about to drop the column `correctAnswer` on the `questiondrafts` table. All the data in the column will be lost.
  - You are about to drop the column `correctAnswer` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questiondrafts" DROP COLUMN "correctAnswer";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correctAnswer";
