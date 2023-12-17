import QuizSettingBtn from './QuizSettingBtn';
import { QuizDraftWithQuestionDraftsAndChoiceDrafts, QuizWithQuestionsAndChoices } from '@/app/types';

export default function TopBar({ quizDraft }: { quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts | null }) {
  return (
    <>
      <div className="md:mx-4 ml-4 w-full">
        <QuizSettingBtn quizDraft={quizDraft} />
      </div>
    </>
  );
}
