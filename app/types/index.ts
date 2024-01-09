import { Prisma } from '@prisma/client';
import { FieldArrayWithId, UseFieldArrayReturn } from 'react-hook-form';
import { z } from 'zod';

export type QuestionAnswerType =
  | 'singleSelect'
  | 'multiSelect'
  | 'text'
  | 'trueOrFalse';

export type QuestionDraftForm = FieldArrayWithId<
  QuestionForms,
  'questionDrafts',
  'id'
>;
export type UseQDraftFormArrayReturn = UseFieldArrayReturn<
  QuestionForms,
  'questionDrafts',
  'id'
>;
export type CorrectAnswerId = '1' | '2' | '3' | '4';

export const quizTitleAndDescSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'タイトルを入力してください' })
    .max(255, { message: 'タイトルは255文字まで設定できます' }),
  description: z
    .string()
    .trim()
    .max(255, { message: '説明は255文字まで入力できます' })
    .optional(),
});
export type QuizTitleAndDesc = z.infer<typeof quizTitleAndDescSchema>;

const statement = z
  .string()
  .trim()
  .min(1, { message: '問題文を入力してください' })
  .max(255, { message: '問題文は255文字まで入力できます' });
const choice = z
  .string()
  .trim()
  .max(255, { message: '選択肢は255文字まで入力できます' })
  .optional();
const timer = z.number().int().min(0).max(600);
const correctAnswerId = z.enum(['1', '2', '3', '4']);
const trueOrFalseCorrectAnswerId = z.enum(['1', '2']);
const explanation = z
  .string()
  .trim()
  .max(255, { message: '解説は255文字まで入力できます' })
  .optional();
const choices = z.array(choice).min(1).max(4).refine((choices) => {
    const c = choices[0];
    if (choices.length === 1) {
      return typeof c === 'string' && c?.length > 0;
    } else {
      return true;
    }
}, '1つ目の選択肢は必須です').refine((choices) => {
  const c = choices[0];
  if (choices.length > 1 && choices.length <= 4) {
    return typeof c === 'string' && c?.length > 0;
  } else {
    return true;
  }
}, '1つ目の選択肢は必須です');
const questionFormProps = z.object({
  statement,
  timer,
  explanation,
});
export const questionFormsSchema = z
  .discriminatedUnion('answerType', [
    questionFormProps.extend({
      answerType: z.literal('singleSelect'),
      choices,
      correctAnswerId,
    }),
    questionFormProps.extend({
      answerType: z.literal('multiSelect'),
      choices,
      correctAnswerIds: z.array(correctAnswerId).min(1),
    }),
    questionFormProps.extend({
      answerType: z.literal('text'),
      correctAnswer: z
        .string()
        .trim()
        .min(1, { message: '答えを入力してください' })
        .max(255, { message: '答えは255文字まで入力できます' }),
    }),
    questionFormProps.extend({
      answerType: z.literal('trueOrFalse'),
      trueOrFalseCorrectAnswerId,
    }),
  ])
  .array().min(1).max(10);
type QForms = z.infer<typeof questionFormsSchema>;
export type QuestionForms = {
  questionDrafts: QForms;
};

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

export type QuizDraftWithQuestionDraftsAndChoiceDrafts =
  Prisma.QuizDraftGetPayload<{
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
