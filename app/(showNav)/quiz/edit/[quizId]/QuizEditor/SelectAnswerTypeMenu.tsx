import Popover from '@/app/components/Popover';
import { Icon } from '@iconify/react';
import { Dispatch, SetStateAction } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionAnswerType, QuestionForms } from '@/app/types';

const answerTypes: {
  type: QuestionAnswerType;
  icon: string;
  text: string;
}[] = [
  { type: 'singleSelect', icon: 'bi:ui-radios-grid', text: '択一形式' },
  { type: 'multiSelect', icon: 'bi:ui-checks-grid', text: '複数回答形式' },
  { type: 'text', icon: 'lucide:text-cursor-input', text: '記述式' },
  {
    type: 'trueOrFalse',
    icon: 'pajamas:false-positive',
    text: '\u3007\u2715クイズ',
  },
];
export const getAnswerTypeText = (answerType: QuestionAnswerType) => {
  const answerTypeObj = answerTypes.find(
    (ansTyp) => answerType === ansTyp.type
  );
  return answerTypeObj?.text || '';
};
export default function SelectAnswerTypeMenu({
  openSelectAnswerTypeMenu,
  setOpenSelectAnswerTypeMenu,
  currentQDraftIndex,
}: {
  openSelectAnswerTypeMenu: boolean;
  setOpenSelectAnswerTypeMenu: Dispatch<SetStateAction<boolean>>;
  currentQDraftIndex: number;
}) {
  const { setValue, control } = useFormContext<QuestionForms>();
  const answerType = useWatch({
    control,
    name: `questionDrafts.${currentQDraftIndex}.answerType` as const,
  });
  const correctAnswerIds = useWatch({
    control,
    name: `questionDrafts.${currentQDraftIndex}.correctAnswerIds` as const,
  });
  const trueOrFalseCorrectAnswerId = useWatch({
    control,
    name: `questionDrafts.${currentQDraftIndex}.trueOrFalseCorrectAnswerId` as const,
  });

  const closePopover = () => setOpenSelectAnswerTypeMenu(false);
  const setAnswerType = (answerType: QuestionAnswerType) => {
    if (answerType === 'multiSelect' && !correctAnswerIds) {
      setValue(
        `questionDrafts.${currentQDraftIndex}.correctAnswerIds` as const,
        ['1']
      );
    } else if (answerType === 'trueOrFalse' && !trueOrFalseCorrectAnswerId) {
      setValue(
        `questionDrafts.${currentQDraftIndex}.trueOrFalseCorrectAnswerId` as const,
        '1'
      );
    }

    setValue(
      `questionDrafts.${currentQDraftIndex}.answerType` as const,
      answerType
    );
  };

  return (
    <Popover
      content={
        <div className="w-full bg-white p-4 md:rounded-md">
          <div className="font-bold text-center mb-4 md:hidden">
            問題形式を選択
          </div>
          <div className="grid grid-cols-2 items-stretch gap-3 md:w-96">
            {answerTypes.map((ansT) => {
              const isCurrentAnswerType = answerType === ansT.type;
              return (
                <button
                  onClick={() => {
                    closePopover();
                    setAnswerType(ansT.type);
                  }}
                  key={ansT.type}
                  type="button"
                  disabled={isCurrentAnswerType}
                  className={`bg-gray-100 py-2 text-sm rounded-md flex flex-col items-center justify-center ${
                    isCurrentAnswerType
                      ? 'border-4 border-blue-500'
                      : 'hover:bg-gray-300'
                  }`}
                >
                  <Icon icon={ansT.icon} className="text-xl mb-3" />
                  <span className="font-bold">{ansT.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      }
      align="center"
      openPopover={openSelectAnswerTypeMenu}
      setOpenPopover={setOpenSelectAnswerTypeMenu}
    >
      <button
        onClick={() =>
          setOpenSelectAnswerTypeMenu((prevOpenPopover) => !prevOpenPopover)
        }
        className="flex flex-row items-center mb-4 justify-between px-3 py-2 rounded-lg bg-gray-500 text-white font-bold max-w-fit"
      >
        <Icon
          icon={
            answerTypes[
              answerTypes.findIndex((ansT) => ansT.type === answerType)
            ].icon
          }
          className="text-xl"
        />
        <span className="mx-3">{getAnswerTypeText(answerType || '')}</span>
        <Icon icon="iconoir:nav-arrow-down" className="text-xl" />
      </button>
    </Popover>
  );
}
