'use client';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dispatch, SetStateAction, useEffect, useId, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  DragOverlay,
  DragStartEvent,
  DraggableAttributes,
  DraggableSyntheticListeners,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import { FaRegTrashCan } from 'react-icons/fa6';
import { BsCopy } from 'react-icons/bs';
import {
  QuestionDraftWithChoiceDraftsAndIsActive,
  getNewQuestionDraft,
} from './CrtQuizScreen';

function OverlaySortableSource({
  questionDraft,
  setQuestionDrafts,
  handlerProps,
  isDragging,
}: {
  questionDraft: QuestionDraftWithChoiceDraftsAndIsActive;
  setQuestionDrafts?: Dispatch<
    SetStateAction<QuestionDraftWithChoiceDraftsAndIsActive[]>
  >;
  handlerProps?: {
    ref: (element: HTMLElement | null) => void;
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
  };
  isDragging?: boolean;
}) {
  const deleteQuestion = (qId: number) => {
    if (typeof setQuestionDrafts === 'undefined') return;

    setQuestionDrafts((prevQDrafts) => {
      if (prevQDrafts.length === 1) return prevQDrafts;

      return prevQDrafts
        .filter((qDraft) => qDraft.id !== qId)
        .map((qDraft, i) => ({ ...qDraft, orderKey: i + 1 }));
    });
  };
  const copyQuestion = (qId: number) => {
    if (typeof setQuestionDrafts === 'undefined') return;

    setQuestionDrafts((prevQDrafts) => {
      const copiedQDraft = prevQDrafts.find((qDraft) => qDraft.id === qId);
      if (!copiedQDraft) return prevQDrafts;

      const maxId = prevQDrafts.reduce(
        (max, qDraft) => Math.max(max, qDraft?.id ?? max),
        -1
      );
      const copiedQDraftId = maxId === -1 ? maxId + 2 : maxId + 1;
      const copiedQDraftOrderKey = prevQDrafts.length + 1;

      const copiedQDraftWithNewId = {
        ...copiedQDraft,
        id: copiedQDraftId,
        isActive: true,
        orderKey: copiedQDraftOrderKey,
        choiceDrafts: copiedQDraft.choiceDrafts.map((cDraft, i) => ({
          ...cDraft,
          id: i + 1,
          questionDraftId: copiedQDraftId,
        })),
      };

      return [
        ...prevQDrafts.map((qDraft) => ({ ...qDraft, isActive: false })),
        copiedQDraftWithNewId,
      ];
    });
  };

  const activateQuestion = () => {
    if (typeof setQuestionDrafts === 'undefined') return;

    setQuestionDrafts((prevQDrafts) => {
      return prevQDrafts.map((prevQDraft) => {
        if (prevQDraft.id === questionDraft.id) {
          return { ...prevQDraft, isActive: true };
        } else {
          return { ...prevQDraft, isActive: false };
        }
      });
    });
  };

  return (
    <div
      className={`flex flex-row md:h-40 md:w-52 h-24 w-32 text-black ${
        questionDraft.isActive && !isDragging ? 'bg-blue-100' : 'bg-white'
      }`}
    >
      {setQuestionDrafts && (
        <div className="md:flex flex-col px-[2px] items-center justify-end hidden">
          <button
            onClick={() => copyQuestion(questionDraft.id)}
            type="button"
            className="cursor-pointer p-2 mb-2 hover:bg-gray-200 rounded-full"
          >
            <BsCopy />
          </button>
          <button
            onClick={() => deleteQuestion(questionDraft.id)}
            type="button"
            className="cursor-pointer p-2 mb-4 text-red-500 hover:bg-red-200 rounded-full"
          >
            <FaRegTrashCan />
          </button>
        </div>
      )}
      <p className="text-sm font-bold block md:hidden p-1">
        {questionDraft.orderKey}
      </p>
      <div
        className={`flex flex-col flex-grow mr-3 my-3 select-none ${
          setQuestionDrafts ? '' : 'md:ml-3'
        }`}
      >
        <p className="text-xs font-bold mb-1 hidden md:block">
          {questionDraft.orderKey}
          <span className="ml-2">{questionDraft.answerType}</span>
        </p>
        <div
          ref={handlerProps?.ref}
          onClick={activateQuestion}
          className={`flex flex-col items-center w-full h-full rounded-lg ${
            questionDraft.isActive && !isDragging
              ? 'bg-white border-2 border-blue-600'
              : 'bg-gray-200'
          } ${handlerProps ? 'cursor-grab' : 'cursor-grabbing'} ${
            isDragging || !handlerProps ? 'border-2 border-blue-600' : ''
          }`}
          {...handlerProps?.attributes}
          {...handlerProps?.listeners}
        >
          <div className="md:mx-2 md:my-5 m-1 text-xs font-bold tracking-tight text-gray-600 line-clamp-1">
            {questionDraft.statement || '問題'}
          </div>
          <div className="w-full md:px-2 px-1">
            <div className="grid grid-cols-2 gap-1 items-stretch">
              {questionDraft.choiceDrafts.map((choiceDraft, i) => (
                <div key={i} className="relative">
                  <div className={`text-[8px] border border-gray-400 rounded-sm line-clamp-1 ${choiceDraft.choice ? '' : 'p-1.5'}`}>
                    {choiceDraft.choice}
                  </div>
                  <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 md:right-1 md:top-1/2 md:-translate-y-1/2 h-2 w-2 md:h-3 md:w-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlaySortableQDraft({
  questionDraft,
  setQuestionDrafts,
}: {
  questionDraft: QuestionDraftWithChoiceDraftsAndIsActive;
  setQuestionDrafts: Dispatch<
    SetStateAction<QuestionDraftWithChoiceDraftsAndIsActive[]>
  >;
}) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: questionDraft.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${isDragging ? 'z-[1] opacity-0' : ''}`}
    >
      <OverlaySortableSource
        questionDraft={questionDraft}
        setQuestionDrafts={setQuestionDrafts}
        handlerProps={{
          ref: setActivatorNodeRef,
          attributes,
          listeners,
        }}
        isDragging={isDragging}
      />
    </div>
  );
}

export default function QDraftList({
  quizDraftId,
  questionDrafts,
  setQuestionDrafts,
}: {
  quizDraftId: string;
  questionDrafts: QuestionDraftWithChoiceDraftsAndIsActive[];
  setQuestionDrafts: Dispatch<
    SetStateAction<QuestionDraftWithChoiceDraftsAndIsActive[]>
  >;
}) {
  useEffect(() => {
    console.log(...questionDrafts);
  }, [questionDrafts]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeQDraft = questionDrafts.find((qDraft) => qDraft.id === activeId);
  const { isMd } = useMediaQuery();
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as number);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (over === null || active.id === over.id) {
      return;
    }
    const oldIndex = questionDrafts.findIndex(
      (qDraft) => qDraft.id === active.id
    );
    const newIndex = questionDrafts.findIndex(
      (qDraft) => qDraft.id === over.id
    );
    const newQDrafts = arrayMove(questionDrafts, oldIndex, newIndex);
    newQDrafts.forEach((newQDraft, i) => {
      if (i === newIndex) {
        newQDraft.isActive = true;
      } else {
        newQDraft.isActive = false;
      }

      newQDraft.orderKey = i + 1;
    });
    setQuestionDrafts(newQDrafts);
  };
  const addQuestion = () => {
    setQuestionDrafts((prevQDrafts) => {
      const updatedQDrafts = prevQDrafts.map((qDraft) => ({
        ...qDraft,
        isActive: false,
      }));
      return [
        ...updatedQDrafts,
        getNewQuestionDraft(quizDraftId, updatedQDrafts),
      ];
    });
  };

  return (
    <aside
      className="fixed bottom-0 left-0 md:w-52 w-screen h-24 md:h-[calc(100vh_-_4rem)] shadow-[0_0px_6px_rgb(0,0,0,0.12)]"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto bg-gray-50">
        <DndContext
          id={useId()}
          collisionDetection={closestCenter}
          modifiers={
            isMd ? [restrictToVerticalAxis] : [restrictToHorizontalAxis]
          }
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={questionDrafts}>
            <div className="flex md:flex-col flex-row">
              {questionDrafts.map((qDraft) => (
                <OverlaySortableQDraft
                  key={qDraft.id}
                  questionDraft={qDraft}
                  setQuestionDrafts={setQuestionDrafts}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeQDraft && (
              <OverlaySortableSource questionDraft={activeQDraft} />
            )}
          </DragOverlay>
        </DndContext>
        <button
          onClick={addQuestion}
          type="button"
          className="text-white bg-blue-500 "
        >
          問題を追加
        </button>
      </div>
    </aside>
  );
}
