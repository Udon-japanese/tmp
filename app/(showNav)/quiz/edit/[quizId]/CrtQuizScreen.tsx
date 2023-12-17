'use client';
import {
  QuestionDraftWithChoiceDrafts,
  QuizDraftWithQuestionDraftsAndChoiceDrafts,
} from '@/app/types';
import QuestionItemList from './QuestionItemList';
import QuestionSettingMenu from './QuestionSettingMenu';
import QuizEditor from './QuizEditor';
import TopBar from './TopBar';
import { useMemo, useState } from 'react';

export type QuestionDraftWithChoiceDraftsAndIsActive =
  QuestionDraftWithChoiceDrafts & {
    isActive: boolean;
    orderKey: number;
  };

export const getNewQuestionDraft = (
  quizDraftId: string,
  questionDrafts: QuestionDraftWithChoiceDrafts[] | undefined
) => {
  const questionDraftsLength = questionDrafts?.length ?? 0;
  const maxId = questionDrafts
  ? questionDrafts.reduce((max, qDraft) => Math.max(max, qDraft?.id ?? max), -1)
  : -1;
  const questionDraftId = maxId === -1 ? maxId + 2 : maxId + 1;

  return {
    answerType: '',
    statement: '',
    correctAnswerId: null,
    correctAnswerIds: [],
    explanation: null,
    timer: null,
    quizDraftId,
    isActive: true,
    orderKey: questionDraftsLength + 1,
    choiceDrafts: [
      { id: 1, choice: '', questionDraftId: questionDraftId },
      { id: 2, choice: '', questionDraftId: questionDraftId },
      { id: 3, choice: '', questionDraftId: questionDraftId },
      { id: 4, choice: '', questionDraftId: questionDraftId },
    ],
    id: questionDraftId,
  };
};

export default function CrtQuizScreen({
  quizDraft,
}: {
  quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts;
}) {
  const selectedQDrafts = useMemo(
    () =>
      quizDraft?.questionDrafts.length
        ? quizDraft.questionDrafts.map((questionDraft, i) => ({
            ...questionDraft,
            isActive: i === 0 ? true : false,
            orderKey: i + 1,
          }))
        : [getNewQuestionDraft(quizDraft!.quizId, quizDraft?.questionDrafts)],
    [quizDraft]
  );
  const [questionDrafts, setQuestionDrafts] =
    useState<QuestionDraftWithChoiceDraftsAndIsActive[]>(selectedQDrafts);
  const currentQuestionDraft = useMemo(
    () => selectedQDrafts.find((questionDraft) => questionDraft.isActive),
    [questionDrafts]
  );

  return (
    <>
      <QuestionItemList
        quizDraftId={quizDraft!.quizId}
        questionDrafts={questionDrafts}
        setQuestionDrafts={setQuestionDrafts}
      />
      <div className="md:pl-52 overflow-y-auto flex flex-col h-[calc(100vh_-_14rem)]">
        <div className="flex flex-row items-center md:flex-none w-full">
          <TopBar quizDraft={quizDraft} />
          <QuestionSettingMenu />
        </div>
        {currentQuestionDraft && (
          <QuizEditor currentQuestionDraft={currentQuestionDraft} />
        )}
      </div>
    </>
  );
}
