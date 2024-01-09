import Modal from '@/app/components/Modal';
import { QuestionForms } from '@/app/types';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';

export default function SetExplModal({
  currentQDraftIndex,
  showSetExplModal,
  setShowSetExplModal,
}: {
  currentQDraftIndex: number;
  showSetExplModal: boolean;
  setShowSetExplModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    control,
    setValue,
  } = useFormContext<QuestionForms>();
  const explanation = useWatch({ name: `questionDrafts.${currentQDraftIndex}.explanation` as const, control });
  const onExplChange = (e: ChangeEvent<HTMLInputElement>) => {
    let expl = e.target.value;

    if (expl.length >= 255) {
      expl = expl.slice(0, 255);
      setValue(`questionDrafts.${currentQDraftIndex}.explanation` as const, expl);
    }
  };
  return (
    <Modal isModalBelowMd={true} showModal={showSetExplModal} setShowModal={setShowSetExplModal}>
      <div className="px-11 flex flex-col justify-center items-center w-[90vw] overflow-hidden md:w-[80vw] md:max-w-lg md:rounded-2xl">
        <div className="mr-auto text-xl font-bold">解説を入力(任意)</div>
        <div className="relative w-full m-5 flex items-center justify-center">
          <div className="absolute top-1 right-1 font-semibold">
            {255 - (explanation?.length ?? 0)}
          </div>
          <TextareaAutosize
            className="w-full resize-none px-8 py-4 rounded-md shadow font-bold shadow-gray-400 outline-none text-black text-center h-auto"
            maxRows={4}
            {...register(`questionDrafts.${currentQDraftIndex}.explanation` as const, {
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                onExplChange(e);
              }
            })}
          />
        </div>
      </div>
    </Modal>
  );
}
