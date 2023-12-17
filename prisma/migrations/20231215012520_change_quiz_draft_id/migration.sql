/*
  Warnings:

  - The primary key for the `quizdrafts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `quizdrafts` table. All the data in the column will be lost.
  - Added the required column `quizId` to the `quizdrafts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questiondrafts" DROP CONSTRAINT "questiondrafts_quizDraftId_fkey";

-- AlterTable
ALTER TABLE "quizdrafts" DROP CONSTRAINT "quizdrafts_pkey",
DROP COLUMN "id",
ADD COLUMN     "quizId" UUID NOT NULL,
ADD CONSTRAINT "quizdrafts_pkey" PRIMARY KEY ("quizId");

-- AddForeignKey
ALTER TABLE "questiondrafts" ADD CONSTRAINT "questiondrafts_quizDraftId_fkey" FOREIGN KEY ("quizDraftId") REFERENCES "quizdrafts"("quizId") ON DELETE RESTRICT ON UPDATE CASCADE;
