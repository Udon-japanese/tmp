'use client';
import { useState } from 'react';
import CreateQuizModal from './CreateQuizModal';

export default function CreateQuizBtn() {
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);

  return (
    <>
      <CreateQuizModal
        showCreateQuizModal={showCreateQuizModal}
        setShowCreateQuizModal={setShowCreateQuizModal}
      />
      <button type="button" onClick={() => setShowCreateQuizModal(true)}>
        クイズを作る
      </button>
    </>
  );
}
