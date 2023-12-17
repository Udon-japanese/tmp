-- CreateTable
CREATE TABLE "choices" (
    "id" SERIAL NOT NULL,
    "choice" VARCHAR(255) NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "answerType" TEXT NOT NULL,
    "statement" VARCHAR(255) NOT NULL,
    "correctAnswerId" INTEGER,
    "correctAnswerIds" TEXT[],
    "explanation" VARCHAR(255),
    "quizId" UUID NOT NULL,
    "correctTimes" INTEGER NOT NULL DEFAULT 0,
    "wrongTimes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "length" INTEGER NOT NULL,
    "timer" INTEGER,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "playTimes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "choices_questionId_idx" ON "choices"("questionId");

-- AddForeignKey
ALTER TABLE "choices" ADD CONSTRAINT "choices_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
