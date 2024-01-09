-- AlterTable
ALTER TABLE "questiondrafts" ADD COLUMN     "correctAnswer" TEXT,
ALTER COLUMN "correctAnswerId" DROP NOT NULL,
ALTER COLUMN "explanation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "correctAnswer" TEXT;
