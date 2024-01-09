import Modal from '@/app/components/Modal';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Quiz } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { fetcher } from '@/lib/utils';
import {
  QuizDraftWithQuestionDraftsAndChoiceDrafts,
  QuizTitleAndDesc,
  quizTitleAndDescSchema,
} from '@/app/types';
import { useRouter } from 'next/navigation';

export default function QuizSettingModal({
  quizDraft,
  showQuizSettingModal,
  setShowQuizSettingModal,
}: {
  quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts | null;
  showQuizSettingModal: boolean;
  setShowQuizSettingModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [saveClicked, setSaveClicked] = useState(false);
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      title: quizDraft?.title as string,
      description: quizDraft?.description || '',
    }),
    [quizDraft]
  );
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<QuizTitleAndDesc>({
    mode: 'onChange',
    resolver: zodResolver(quizTitleAndDescSchema),
    defaultValues,
  });

  const onSubmit = async (data: QuizTitleAndDesc) => {
    setSaveClicked(true);
    await fetcher<Quiz>('/api/quizzes/update/quiz', {
      method: 'POST',
      body: JSON.stringify({ ...data, id: quizDraft?.quizId }),
    });
    setSaveClicked(false);
    closeQuizSettingModal();
    router.refresh();
  };

  const closeQuizSettingModal = () => {
    setShowQuizSettingModal(false);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues, showQuizSettingModal]);

  return (
    <Modal
      showModal={showQuizSettingModal}
      setShowModal={setShowQuizSettingModal}
    >
      <div className="w-full overflow-hidden md:w-[80vw] md:max-w-lg md:rounded-2xl md:border md:border-gray-300">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b border-gray-200 bg-white p-4 text-center">
            <div className="text-2xl font-bold text-start">クイズの設定</div>
            <div className="flex flex-col">
              <div className="mt-5 w-full">
                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm text-gray-900 text-start font-semibold"
                  >
                    クイズのタイトル
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="例：どうぶつクイズ"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm text-gray-900 text-start font-semibold"
                  >
                    クイズの説明(任意)
                  </label>
                  <input
                    type="text"
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="例：色々な動物に関するクイズです！"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-end bg-gray-50 p-4 gap-3">
            <button
              type="button"
              className={`px-4 py-2 flex items-center justify-center rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none border-gray-200 bg-white text-black hover:bg-gray-50`}
              onClick={closeQuizSettingModal}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saveClicked || !isDirty || !isValid}
              className={`${
                saveClicked || !isDirty || !isValid
                  ? 'text-black cursor-not-allowed border-gray-200 bg-gray-300'
                  : 'border border-gray-200 bg-green-800 text-white hover:bg-green-700'
              } px-4 py-2 flex items-center justify-center rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            >
              {saveClicked ? (
                <BeatLoader size={12} color="gray" />
              ) : (
                <p>保存</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
