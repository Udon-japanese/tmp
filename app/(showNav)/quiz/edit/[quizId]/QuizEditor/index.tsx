'use client';
import { UseFieldArrayReturn, useFormContext, useWatch } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import ChoiceInput, { ChoiceInputProps } from './ChoiceInput';
import { ChangeEvent, useState } from 'react';
import QuizSettingBtn from '../QuizSettingBtn';
import {
  QuizDraftWithQuestionDraftsAndChoiceDrafts,
  QuestionForms,
} from '@/app/types';
import SelectTimeLimitMenu from './SelectTimeLimitMenu';
import SelectAnswerTypeMenu from './SelectAnswerTypeMenu';
import { Icon } from '@iconify/react';
import SetExplBtn from './SetExplBtn';
import SetExplModal from './SetExplModal';
const choiceInputColors: Pick<ChoiceInputProps, 'color'>[] = [
  { color: 'red' },
  { color: 'blue' },
  { color: 'green' },
  { color: 'yellow' },
];

export default function QuizEditor({
  quizDraft,
  currentQuestionDraftIndex,
}: {
  quizDraft: QuizDraftWithQuestionDraftsAndChoiceDrafts;
  useFieldArrayReturn: UseFieldArrayReturn<
    QuestionForms,
    'questionDrafts',
    'id'
  >;
  currentQuestionDraftIndex: number;
}) {
  const [openSelectAnswerTypeMenu, setOpenSelectAnswerTypeMenu] =
    useState(false);
  const [openSelectTimeLimitMenu, setOpenSelectTimeLimitMenu] = useState(false);
  const [isStatementFocused, setIsStatementFocused] = useState(false);
  const [showSetExplModal, setShowSetExplModal] = useState(false);

  const { handleSubmit, setValue, control, register } =
    useFormContext<QuestionForms>();
  const answerType = useWatch({
    control,
    name: `questionDrafts.${currentQuestionDraftIndex}.answerType` as const,
  });
  const statement = useWatch({
    name: `questionDrafts.${currentQuestionDraftIndex}.statement` as const,
    control,
  });

  const onSubmit = (data: QuestionForms) => {
    console.log(data);
  };

  const onStatementChange = (e: ChangeEvent<HTMLInputElement>) => {
    let s = e.target.value;

    if (s.length >= 255) {
      s = s.slice(0, 255);
      setValue(
        `questionDrafts.${currentQuestionDraftIndex}.statement` as const,
        s
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-4 mt-3">
        <div className="flex items-center justify-center">
          <QuizSettingBtn quizDraft={quizDraft} />
          <button className="ml-3 text-red-500 rounded-full">
            <Icon icon="zondicons:exclamation-solid" className="text-xl" />
          </button>
          <button className="ml-3 md:hidden p-2 bg-white border border-gray-200 rounded-full">
            <Icon icon="uil:ellipsis-v" className="text-xl" />
          </button>
        </div>
        <div className="flex justify-center items-center mt-5 mb-5 md:mb-10">
          <SelectAnswerTypeMenu
            openSelectAnswerTypeMenu={openSelectAnswerTypeMenu}
            setOpenSelectAnswerTypeMenu={setOpenSelectAnswerTypeMenu}
            currentQDraftIndex={currentQuestionDraftIndex}
          />
        </div>
        <div className="flex items-center justify-between">
          <SelectTimeLimitMenu
            openSelectTimeLimitMenu={openSelectTimeLimitMenu}
            setOpenSelectTimeLimitMenu={setOpenSelectTimeLimitMenu}
            currentQDraftIndex={currentQuestionDraftIndex}
          />
          <SetExplBtn
            setShowSetExplModal={setShowSetExplModal}
            SetExplModal={
              <SetExplModal
                showSetExplModal={showSetExplModal}
                setShowSetExplModal={setShowSetExplModal}
                currentQDraftIndex={currentQuestionDraftIndex}
              />
            }
          />
        </div>
        <div className="flex items-center mb-5 md:mb-14">
          <div className="relative w-full">
            {isStatementFocused && (
              <div className={`absolute top-1 right-1 font-semibold`}>
                {255 - statement.length}
              </div>
            )}
            <TextareaAutosize
              className="w-full resize-none px-8 py-4 rounded-md shadow font-bold shadow-gray-400 outline-none text-black text-center h-[6.0vmin] text-[max(3.0vmin,20px)] placeholder-gray-600 focus:placeholder-transparent"
              placeholder="問題文を入力..."
              maxRows={4}
              {...register(
                `questionDrafts.${currentQuestionDraftIndex}.statement` as const,
                {
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    onStatementChange(e);
                  },
                }
              )}
              onFocus={() => setIsStatementFocused(true)}
              onBlur={() => setIsStatementFocused(false)}
            />
          </div>
        </div>
        <div
          className={`grid-cols-2 gap-3 items-stretch h-[30vmin] ${
            answerType === 'text' ? 'block' : 'grid'
          }`}
        >
          {answerType === 'trueOrFalse' ? (
            Array.from({ length: 2 }).map((_, i) => {
              return (
                <ChoiceInput
                  key={i}
                  index={i}
                  {...choiceInputColors[i]}
                  currentQDraftIndex={currentQuestionDraftIndex}
                />
              );
            })
          ) : answerType === 'text' ? (
            <ChoiceInput
              index={0}
              {...choiceInputColors[0]}
              currentQDraftIndex={currentQuestionDraftIndex}
            />
          ) : (
            Array.from({ length: 4 }).map((_, i) => {
              return (
                <ChoiceInput
                  key={i}
                  index={i}
                  {...choiceInputColors[i]}
                  currentQDraftIndex={currentQuestionDraftIndex}
                />
              );
            })
          )}
        </div>
      </div>
    </form>
  );
}
