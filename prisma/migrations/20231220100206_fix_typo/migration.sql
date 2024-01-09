/*
  Warnings:

  - The `correctAnswerIds` column on the `questiondrafts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `correctAnswerIds` column on the `questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "questiondrafts" DROP COLUMN "correctAnswerIds",
ADD COLUMN     "correctAnswerIds" INTEGER[];

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correctAnswerIds",
ADD COLUMN     "correctAnswerIds" INTEGER[];
