import { QuestionForms } from '@/app/types';
import { useFormContext, useWatch } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { ChangeEvent, useState } from 'react';
import { Icon } from '@iconify/react';

export type ChoiceInputProps = {
  color: 'red' | 'blue' | 'green' | 'yellow';
  index: number;
  currentQDraftIndex: number;
};
type RegisterName = 'correctAnswer' | 'correctAnswerId' | 'correctAnswerIds' | 'trueOrFalseCorrectAnswerId';

export const trueOrFalseChoices = ['\u3007', '\u2715'];
const choiceColor = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};
const inputTypes = {
  radio: 'radio',
  checkbox: 'checkbox',
};

export default function ChoiceInput({
  color,
  index,
  currentQDraftIndex,
}: ChoiceInputProps) {
  const [isChoiceFocused, setIsChoiceFocused] = useState(false);
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionForms>();
  const answerType = useWatch({
    control,
    name: `questionDrafts.${currentQDraftIndex}.answerType` as const,
  });
  const isTrueOrFalseQuestion = answerType === 'trueOrFalse';
  const checkName: RegisterName =
    answerType === 'multiSelect' ? 'correctAnswerIds' : answerType === 'singleSelect' ? 'correctAnswerId' : 'trueOrFalseCorrectAnswerId';
  const choice = useWatch({
    name: `questionDrafts.${currentQDraftIndex}.choices.${index}` as const,
    control,
  });

  const getPlaceholder = () => {
    if (answerType === 'text') {
      return '答えを入力';
    }

    const optionalText = index === 0 || isTrueOrFalseQuestion ? '' : '(任意)';
    return `選択肢を追加${optionalText}`;
  };
  const onChoiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    let choice = e.target.value;

    if (choice.length >= 255) {
      choice = choice.slice(0, 255);
      setValue(
        `questionDrafts.${currentQDraftIndex}.choices.${index}` as const,
        choice
      );
    }
  };

  return (
    <div className="relative h-full">
      {isTrueOrFalseQuestion ? (
        <div
          className={`w-full min-h-full p-8 rounded text-white shadow shadow-black font-bold text-[max(1.6vh,15px)] ${choiceColor[color]}`}
        >
          {trueOrFalseChoices[index]}
        </div>
      ) : (
        <>
          {isChoiceFocused && (
            <div className={`absolute top-1 right-1 font-semibold text-white`}>
              {255 - (choice?.length ?? 0)}
            </div>
          )}
          <TextareaAutosize
            className={`w-full min-h-full py-8 pl-8 pr-20 rounded text-white shadow shadow-black font-bold placeholder-gray-50 resize-none focus:outline-none text-[max(1.6vh,15px)] focus:placeholder-transparent ${choiceColor[color]}`}
            placeholder={getPlaceholder()}
            {...register(
              answerType === 'text'
                ? (`questionDrafts.${currentQDraftIndex}.correctAnswer` as const)
                : (`questionDrafts.${currentQDraftIndex}.choices.${index}` as const),
              {
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  onChoiceChange(e);
                },
              }
            )}
            onFocus={() => setIsChoiceFocused(true)}
            onBlur={() => setIsChoiceFocused(false)}
          />
        </>
      )}
      {answerType !== 'text' && (
        <>
          <input
            id={`correct-answer-${index}`}
            className="hidden peer"
            type={
              answerType === 'multiSelect'
                ? inputTypes.checkbox
                : inputTypes.radio
            }
            {...register(
              `questionDrafts.${currentQDraftIndex}.${checkName}` as const
            )}
            value={index + 1}
          />
          <label
            className="flex justify-center items-center group cursor-pointer bg-transparent peer-checked:bg-lime-400 peer-checked:[&>*:first-child]:block absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full border-[7px] border-white text-white"
            htmlFor={`correct-answer-${index}`}
          >
            <Icon
              icon="mdi:check-bold"
              className="text-4xl group-hover:block hidden"
            />
          </label>
        </>
      )}
    </div>
  );
}
