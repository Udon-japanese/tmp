import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const setTitleAndDescFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'タイトルを入力してください' })
    .max(255, { message: 'タイトルは255文字まで設定できます' }),
  description: z
    .string()
    .trim()
    .max(255, { message: '説明は255文字まで入力できます' }),
});

export type SetTitleAndDescFormType = z.infer<typeof setTitleAndDescFormSchema>;

export type QuizWithQuestionsAndChoices = Prisma.QuizGetPayload<{
  include: {
    questions: {
      include: {
        choices: true;
      };
    };
  };
}> | null;

export type QuestionWithChoices = Prisma.QuestionGetPayload<{
  include: {
    choices: true;
  };
}> | null;

export type QuizDraftWithQuestionDraftsAndChoiceDrafts = Prisma.QuizDraftGetPayload<{
  include: {
    questionDrafts: {
      include: {
        choiceDrafts: true;
      };
    };
  };
}> | null;

export type QuestionDraftWithChoiceDrafts = Prisma.QuestionDraftGetPayload<{
  include: {
    choiceDrafts: true;
  };
}> | null;
