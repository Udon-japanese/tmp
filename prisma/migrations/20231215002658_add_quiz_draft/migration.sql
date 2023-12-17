-- CreateTable
CREATE TABLE "choicedrafts" (
    "id" SERIAL NOT NULL,
    "choice" VARCHAR(255) NOT NULL,
    "questionDraftId" INTEGER NOT NULL,

    CONSTRAINT "choicedrafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questiondrafts" (
    "id" SERIAL NOT NULL,
    "answerType" TEXT,
    "statement" VARCHAR(255),
    "correctAnswerId" INTEGER,
    "correctAnswerIds" TEXT[],
    "explanation" VARCHAR(255),
    "timer" INTEGER,
    "quizDraftId" UUID NOT NULL,

    CONSTRAINT "questiondrafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizdrafts" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(255),
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "quizdrafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "choicedrafts_questionDraftId_idx" ON "choicedrafts"("questionDraftId");

-- CreateIndex
CREATE INDEX "questiondrafts_quizDraftId_idx" ON "questiondrafts"("quizDraftId");

-- AddForeignKey
ALTER TABLE "choicedrafts" ADD CONSTRAINT "choicedrafts_questionDraftId_fkey" FOREIGN KEY ("questionDraftId") REFERENCES "questiondrafts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questiondrafts" ADD CONSTRAINT "questiondrafts_quizDraftId_fkey" FOREIGN KEY ("quizDraftId") REFERENCES "quizdrafts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizdrafts" ADD CONSTRAINT "quizdrafts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
