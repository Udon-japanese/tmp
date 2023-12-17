'use client';
import { useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import QuizSettingModal from './QuizSettingModal';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { QuizDraftWithQuestionDraftsAndChoiceDrafts, QuizWithQuestionsAndChoices } from '@/app/types';

export default function QuizSettingBtn({ quizDraft }: { quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts | null }) {
  const [showQuizSettingModal, setShowQuizSettingModal] = useState(false);
  const { isMd } = useMediaQuery();
  return (
    <>
      <button
        type="button"
        onClick={() => setShowQuizSettingModal(true)}
        className="flex items-center justify-between border border-gray-200 rounded-md w-full"
      >
        <div className="px-4 line-clamp-1">{quizDraft?.title}</div>
        <div className="m-1 py-1 px-2 bg-gray-100 rounded-md inline-flex items-center whitespace-nowrap min-w-max">
          {isMd ? (
            <p>クイズの設定</p>
          ) : (
            <CiSettings size={20} />
          )}
        </div>
      </button>
      <QuizSettingModal
        quizDraft={quizDraft}
        showQuizSettingModal={showQuizSettingModal}
        setShowQuizSettingModal={setShowQuizSettingModal}
      />
    </>
  );
}
