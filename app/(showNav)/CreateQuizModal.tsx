import { fetcher } from '@/lib/utils';
import Modal from '../components/Modal';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { Quiz } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setTitleAndDescFormSchema, SetTitleAndDescFormType } from '../types';

export default function CreateQuizModal({
  showCreateQuizModal,
  setShowCreateQuizModal,
}: {
  showCreateQuizModal: boolean;
  setShowCreateQuizModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [createClicked, setCreateClicked] = useState(false);
  const { push } = useRouter();
  const defaultValues = useMemo(() => ({
    title: '',
    description: '',
  }), []);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SetTitleAndDescFormType>({
    mode: 'onChange',
    resolver: zodResolver(setTitleAndDescFormSchema, { async: true }),
    defaultValues,
  });

  const onSubmit = async (data: SetTitleAndDescFormType) => {
    setCreateClicked(true);
    const quiz = await fetcher<Quiz>('/api/quizzes/new', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    push(`/quiz/edit/${quiz.id}`);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, showCreateQuizModal, defaultValues]);

  return (
    <Modal
      showModal={showCreateQuizModal}
      setShowModal={setShowCreateQuizModal}
    >
      <div className="w-full overflow-hidden shadow-xl sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center space-y-3 border-b border-gray-200 bg-white p-4 text-center">
            <h3 className="text-2xl font-bold text-center">クイズを作る</h3>
            <div className="mt-5 w-full">
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm font-medium text-gray-900 text-start"
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
                  className="block mb-2 text-sm font-medium text-gray-900 text-start"
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
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8">
            <button
              type="submit"
              disabled={createClicked || !isValid}
              className={`${
                createClicked || !isValid
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                  : 'border border-gray-200 bg-white text-black hover:bg-gray-50'
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            >
              {createClicked ? (
                <BeatLoader size={12} color="gray" />
              ) : (
                <p>クイズを作成</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
