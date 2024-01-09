'use client';
import {
  CorrectAnswerId,
  QuestionAnswerType,
  QuestionForms,
  QuizDraftWithQuestionDraftsAndChoiceDrafts,
  questionFormsSchema,
} from '@/app/types';
import QuizEditor from './QuizEditor';
import { useEffect, useMemo, useState } from 'react';
import QuestionDraftList from './QuestionDraftList';
import {
  DefaultValues,
  useFieldArray,
  useForm,
  FormProvider,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CrtQuizScreen({
  quizDraft,
}: {
  quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts;
}) {
  const defaultValues: DefaultValues<QuestionForms> = useMemo(() => {
    const questionDrafts = quizDraft?.questionDrafts ?? [];

    if (!questionDrafts.length) {
      return {
        questionDrafts: [
          {
            answerType: 'singleSelect',
            statement: '',
            timer: 0,
            correctAnswerId: '1',
            choices: ['', '', '', ''],
          },
        ],
      };
    }

    return {
      questionDrafts: questionDrafts.map((qDraft) => {
        const answerType = qDraft.answerType as QuestionAnswerType;

        switch (answerType) {
          case 'singleSelect': {
            return {
              statement: qDraft.statement || '',
              answerType,
              timer: qDraft.timer || 0,
              choices: [
                qDraft?.choiceDrafts[0]?.choice || '',
                qDraft?.choiceDrafts[1]?.choice || '',
                qDraft?.choiceDrafts[2]?.choice || '',
                qDraft?.choiceDrafts[3]?.choice || '',
              ],
              correctAnswerId:
                (qDraft.correctAnswerId?.toString() as CorrectAnswerId) || '1',
              explanation: qDraft?.explanation || '',
            };
          }
          case 'multiSelect': {
            return {
              statement: qDraft.statement || '',
              answerType,
              timer: qDraft.timer || 0,
              choices: [
                qDraft?.choiceDrafts[0]?.choice || '',
                qDraft?.choiceDrafts[1]?.choice || '',
                qDraft?.choiceDrafts[2]?.choice || '',
                qDraft?.choiceDrafts[3]?.choice || '',
              ],
              correctAnswerIds: (qDraft.correctAnswerIds.map((id) =>
                id.toString()
              ) as CorrectAnswerId[]) || ['1'],
              explanation: qDraft?.explanation || '',
            };
          }
          case 'text': {
            return {
              statement: qDraft.statement || '',
              answerType,
              timer: qDraft.timer || 0,
              correctAnswer: qDraft?.choiceDrafts[0]?.choice || '',
              explanation: qDraft?.explanation || '',
            };
          }
          case 'trueOrFalse': {
            return {
              statement: qDraft.statement || '',
              answerType,
              timer: qDraft.timer || 0,
              explanation: qDraft?.explanation || '',
              trueOrFalseCorrectAnswerId:
                (qDraft.correctAnswerId?.toString() as Exclude<
                  CorrectAnswerId,
                  '3' | '4'
                >) || '1',
            };
          }
        }
      }),
    };
  }, [quizDraft]);
  const [currentQuestionDraftIndex, setCurrentQuestionDraftIndex] = useState(0);
  const useFormReturn = useForm<QuestionForms>({
    resolver: zodResolver(questionFormsSchema),
    mode: 'onChange',
    shouldFocusError: false,
    defaultValues,
  });
  const { control, register } = useFormReturn;
  const useFieldArrayReturn = useFieldArray<QuestionForms>({
    control,
    name: 'questionDrafts',
  });

  useEffect(() => {
    register(`questionDrafts.${currentQuestionDraftIndex}.answerType` as const);
    register(`questionDrafts.${currentQuestionDraftIndex}.timer` as const);
  }, []);

  useEffect(() => {
    console.log(`currentQDIndex: ${currentQuestionDraftIndex}`);
  }, [currentQuestionDraftIndex]);

  return (
    <>
      <FormProvider {...useFormReturn}>
        <QuestionDraftList
          useFieldArrayReturn={useFieldArrayReturn}
          currentQuestionDraftIndex={currentQuestionDraftIndex}
          setCurrentQuestionDraftIndex={setCurrentQuestionDraftIndex}
        />
        <div className="md:pl-52 bg-gray-50 overflow-y-auto flex flex-col h-[calc(100vh_-_10rem)] md:h-[calc(100vh_-_4rem)]">
          <QuizEditor
            quizDraft={quizDraft}
            useFieldArrayReturn={useFieldArrayReturn}
            currentQuestionDraftIndex={currentQuestionDraftIndex}
          />
        </div>
      </FormProvider>
    </>
  );
}
