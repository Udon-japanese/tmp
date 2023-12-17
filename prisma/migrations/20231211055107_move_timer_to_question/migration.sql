/*
  Warnings:

  - You are about to drop the column `timer` on the `quizzes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "timer" INTEGER;

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "timer";
