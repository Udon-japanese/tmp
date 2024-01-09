import { Icon } from '@iconify/react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

export default function SetExplBtn({
  setShowSetExplModal,
  SetExplModal,
}: {
  setShowSetExplModal: Dispatch<SetStateAction<boolean>>;
  SetExplModal: ReactNode;
}) {
  return (
    <>
      <button
        onClick={() => setShowSetExplModal(true)}
        className="flex flex-row items-center mb-4 justify-between px-3 py-2 rounded-lg bg-cyan-400 text-white font-bold max-w-fit"
      >
        <Icon icon="pajamas:comment-dots" className="text-xl mr-2" />
        解説を追加
      </button>
      {SetExplModal}
    </>
  );
}
