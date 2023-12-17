-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "questions_quizId_idx" ON "questions"("quizId");
