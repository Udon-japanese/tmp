'use client';
import { sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dispatch, SetStateAction, useCallback, useId, useState } from 'react';
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
import { Icon } from '@iconify/react';
import { getAnswerTypeText } from './QuizEditor/SelectAnswerTypeMenu';
import { Tooltip } from 'react-tooltip';
import { trueOrFalseChoices } from './QuizEditor/ChoiceInput';
import {
  CorrectAnswerId,
  QuestionAnswerType,
  QuestionDraftForm,
  QuestionForms,
  UseQDraftFormArrayReturn,
} from '@/app/types';
import { useFormContext, useWatch } from 'react-hook-form';

function CorrectAnswerIndicator({
  isCurrentQDraft,
}: {
  isCurrentQDraft: boolean;
}) {
  return (
    <span
      className={`absolute block rounded-full bg-green-500 ring-2 -top-1 right-0 h-3 w-3  ${
        isCurrentQDraft ? 'ring-white' : 'ring-gray-200'
      }`}
    />
  );
}

function OverlaySortableSource({
  orderKey,
  qIndex,
  currentQuestionDraftIndex,
  handlerProps,
}: {
  orderKey: number;
  qIndex: number;
  currentQuestionDraftIndex: number;
  handlerProps?: {
    ref: (element: HTMLElement | null) => void;
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
    setCurrentQuestionDraftIndex: Dispatch<SetStateAction<number>>;
    activateQuestion: () => void;
    copyQuestion: () => void;
    deleteQuestion: () => void;
  };
}) {
  const isCurrentQDraft =
    qIndex === currentQuestionDraftIndex && Boolean(handlerProps);
  const { control } = useFormContext<QuestionForms>();
  const answerType = useWatch({
    control,
    name: `questionDrafts.${qIndex}.answerType` as const,
  });
  const choices = useWatch({
    control,
    name: `questionDrafts.${qIndex}.choices` as const,
  });
  const correctAnswer = useWatch({
    control,
    name: `questionDrafts.${qIndex}.correctAnswer` as const,
  });
  const statement = useWatch({
    control,
    name: `questionDrafts.${qIndex}.statement` as const,
  });
  const timer = useWatch({
    control,
    name: `questionDrafts.${qIndex}.timer` as const,
  });
  const explanation = useWatch({
    control,
    name: `questionDrafts.${qIndex}.explanation` as const,
  });
  const correctAnswerId = useWatch({
    control,
    name: `questionDrafts.${qIndex}.correctAnswerId` as const,
  });
  const correctAnswerIds = useWatch({
    control,
    name: `questionDrafts.${qIndex}.correctAnswerIds` as const,
  });
  const trueOrFalseCorrectAnswerId = useWatch({
    control,
    name: `questionDrafts.${qIndex}.trueOrFalseCorrectAnswerId` as const,
  });

  const isEqualCorrectAnswerId = (
    answerType: QuestionAnswerType,
    n: number
  ) => {
    switch (answerType) {
      case 'singleSelect':
        return n === parseInt(correctAnswerId);
      case 'trueOrFalse':
        return n === parseInt(trueOrFalseCorrectAnswerId);
      case 'multiSelect':
        return correctAnswerIds?.includes(n.toString() as CorrectAnswerId);
      default:
        return false;
    }
  };

  return (
    <div
      className={`flex flex-row md:h-40 md:w-52 h-24 w-32 text-black ${
        isCurrentQDraft ? 'bg-blue-100' : 'bg-white'
      }`}
    >
      {handlerProps && (
        <div className="md:flex flex-col px-1 items-center justify-end hidden">
          <button
            onClick={handlerProps.copyQuestion}
            type="button"
            data-tooltip-id="action-button"
            data-tooltip-content="複製する"
            className="cursor-pointer p-1 mb-2 hover:bg-gray-300 rounded-full"
          >
            <Icon icon="tabler:copy" className="text-xl" />
          </button>
          <button
            onClick={handlerProps.deleteQuestion}
            type="button"
            data-tooltip-id="action-button"
            data-tooltip-content="削除する"
            className="cursor-pointer p-1  mb-4 text-red-500 hover:bg-red-200 rounded-full"
          >
            <Icon icon="material-symbols:delete-outline" className="text-xl" />
          </button>
          <Tooltip id="action-button" place="right" className="z-10" />
        </div>
      )}
      <p className="text-sm font-bold block md:hidden p-1">{orderKey}</p>
      <div
        className={`flex flex-col flex-grow mr-3 my-3 select-none ${
          handlerProps ? '' : 'md:ml-8'
        }`}
      >
        <p className="text-xs font-bold mb-1 hidden md:block">
          {orderKey}
          <span className="ml-2">{getAnswerTypeText(answerType)}</span>
        </p>
        <div
          ref={handlerProps?.ref}
          onClick={handlerProps?.activateQuestion}
          className={`flex flex-col items-center w-full h-full rounded-lg outline-[3px] ${
            isCurrentQDraft
              ? 'bg-white outline outline-blue-600'
              : 'bg-gray-200 hover:outline hover:outline-gray-300'
          } ${
            handlerProps
              ? 'cursor-grab'
              : 'cursor-grabbing border-2 border-blue-600 !outline-none'
          }`}
          {...handlerProps?.attributes}
          {...handlerProps?.listeners}
        >
          <div
            className={`md:mx-2 md:my-2 m-1 text-xs font-bold text-gray-600 max-w-[90px] line-clamp-1 ${
              handlerProps ? 'md:max-w-[130px]' : 'md:max-w-[168px]'
            }`}
          >
            {statement || '問題'}
          </div>
          <div className="mb-3 flex flex-row justify-between items-center w-full md:px-2 px-1">
            <div className="relative">
              <div className="absolute whitespace-nowrap top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-semibold">
                {timer}
              </div>
              <div className="p-3 rounded-full border-2 border-gray-300" />
            </div>
            <Icon
              icon={
                explanation
                  ? 'fluent:comment-20-regular'
                  : 'fluent:comment-off-20-regular'
              }
              className="text-3xl text-gray-300"
            />
          </div>
          <div className="md:block hidden w-full md:px-2 px-1">
            <div
              className={`grid items-stretch ${
                answerType === 'text' ? 'grid-cols-1' : 'grid-cols-2 gap-1.5'
              }`}
            >
              {answerType === 'trueOrFalse' ? (
                trueOrFalseChoices.map((choice, i) => {
                  return (
                    <div key={i} className="relative">
                      <div className="text-[9px] border px-1 py-[9px] border-gray-400 rounded-sm">
                        {choice}
                      </div>
                      {isEqualCorrectAnswerId(answerType, i + 1) && (
                        <CorrectAnswerIndicator
                          isCurrentQDraft={isCurrentQDraft}
                        />
                      )}
                    </div>
                  );
                })
              ) : answerType === 'text' ? (
                <div className="relative">
                  <div
                    className={`text-[9px] border px-1 border-gray-400 rounded-sm truncate ${
                      correctAnswer ? 'py-[9px]' : 'py-4'
                    }`}
                  >
                    <span
                      className={`${
                        handlerProps ? 'max-w-[136px]' : 'max-w-[164px]'
                      }`}
                    >
                      {correctAnswer}
                    </span>
                  </div>
                </div>
              ) : (
                choices.map((choice, i) => {
                  return (
                    <div key={i} className="relative">
                      <div
                        className={`text-[9px] border px-1 border-gray-400 rounded-sm truncate ${
                          choice ? '' : 'p-1.5'
                        }`}
                      >
                        <span
                          className={`${
                            handlerProps ? 'max-w-[60px]' : 'max-w-[75px]'
                          }`}
                        >
                          {choice}
                        </span>
                      </div>
                      {isEqualCorrectAnswerId(answerType, i + 1) && (
                        <CorrectAnswerIndicator
                          isCurrentQDraft={isCurrentQDraft}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverlaySortableQDraft({
  orderKey,
  qIndex,
  questionDraft,
  useFieldArrayReturn,
  currentQuestionDraftIndex,
  setCurrentQuestionDraftIndex,
}: {
  orderKey: number;
  qIndex: number;
  questionDraft: QuestionDraftForm;
  useFieldArrayReturn: UseQDraftFormArrayReturn;
  currentQuestionDraftIndex: number;
  setCurrentQuestionDraftIndex: Dispatch<SetStateAction<number>>;
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
  const { control } = useFormContext<QuestionForms>();
  const { fields, remove, insert } = useFieldArrayReturn;
  const qDraftIndex = fields.findIndex(
    (qDraft) => qDraft.id === questionDraft.id
  );
  const watchedQDraft = useWatch({
    control,
    name: `questionDrafts.${qDraftIndex}` as const,
  });

  const deleteQuestion = () => {
    if (typeof setCurrentQuestionDraftIndex === 'undefined') return;
    if (fields.length === 1) return;

    setCurrentQuestionDraftIndex(
      Math.min(Math.max(0, fields.length - 2), Math.max(0, qDraftIndex))
    );
    remove(qDraftIndex);
  };
  const copyQuestion = () => {
    if (!watchedQDraft) return;

    const prevCurrentIndex = currentQuestionDraftIndex;
    const newCurrentIndex = prevCurrentIndex + 1;
    setCurrentQuestionDraftIndex(newCurrentIndex);
    insert(newCurrentIndex, watchedQDraft);
  };
  const activateQuestion = () => {
    setCurrentQuestionDraftIndex(qDraftIndex);
  };

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
        orderKey={orderKey}
        qIndex={qIndex}
        currentQuestionDraftIndex={currentQuestionDraftIndex}
        handlerProps={{
          ref: setActivatorNodeRef,
          attributes,
          listeners,
          setCurrentQuestionDraftIndex,
          activateQuestion,
          copyQuestion,
          deleteQuestion,
        }}
      />
    </div>
  );
}

export default function QuestionDraftList({
  useFieldArrayReturn,
  currentQuestionDraftIndex,
  setCurrentQuestionDraftIndex,
}: {
  useFieldArrayReturn: UseQDraftFormArrayReturn;
  currentQuestionDraftIndex: number;
  setCurrentQuestionDraftIndex: Dispatch<SetStateAction<number>>;
}) {
  const { fields, move, insert } = useFieldArrayReturn;
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeQDraft = fields.find((qDraft) => qDraft.id === activeId);
  const activeQDraftIndex = fields.findIndex(
    (qDraft) => qDraft.id === activeQDraft?.id
  );
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
  const modifiers = isMd
    ? [restrictToVerticalAxis]
    : [restrictToHorizontalAxis];

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (over === null || active.id === over.id) return;

    const oldIndex = fields.findIndex((qDraft) => qDraft.id === active.id);
    const newIndex = fields.findIndex((qDraft) => qDraft.id === over.id);
    console.log(oldIndex, newIndex);
    move(oldIndex, newIndex);
    setCurrentQuestionDraftIndex(newIndex);
  };
  const addQuestion = () => {
    const newActiveIndex = currentQuestionDraftIndex + 1;
    insert(newActiveIndex, {
      answerType: 'singleSelect',
      statement: '',
      timer: 0,
      correctAnswerId: '1',
      choices: ['', '', '', ''],
    });
    setCurrentQuestionDraftIndex(newActiveIndex);
  };

  return (
    <aside
      className="fixed bottom-0 left-0 md:w-52 w-screen h-24 md:h-[calc(100vh_-_4rem)] shadow-[0_0px_6px_rgb(0,0,0,0.12)]"
      aria-label="Sidebar"
    >
      <div className="h-full md:w-full overflow-auto bg-white w-[calc(100vw_-_78px)]">
        <DndContext
          id={useId()}
          collisionDetection={closestCenter}
          modifiers={modifiers}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields}>
            <div className="flex md:flex-col flex-row min-h-0 md:max-h-[calc(100vh-_140px)]">
              {fields.map((qDraft, i) => (
                <OverlaySortableQDraft
                  key={qDraft.id}
                  orderKey={i + 1}
                  qIndex={i}
                  questionDraft={qDraft}
                  useFieldArrayReturn={useFieldArrayReturn}
                  currentQuestionDraftIndex={currentQuestionDraftIndex}
                  setCurrentQuestionDraftIndex={setCurrentQuestionDraftIndex}
                />
              ))}
              <div className="md:flex items-start justify-center py-4 sticky bottom-0 bg-white hidden">
                <button
                  onClick={addQuestion}
                  type="button"
                  className="text-white bg-blue-600 px-5 py-2 rounded-md font-bold"
                >
                  問題を追加
                </button>
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeQDraft && (
              <OverlaySortableSource
                orderKey={activeQDraftIndex + 1}
                qIndex={activeQDraftIndex}
                currentQuestionDraftIndex={currentQuestionDraftIndex}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <div className="flex flex-col justify-self-center items-end fixed bottom-2 right-0 bg-white md:hidden">
        <button
          onClick={addQuestion}
          type="button"
          className="text-white bg-blue-600 p-3 m-3 rounded-md text-3xl"
        >
          <Icon icon="mdi:plus" />
        </button>
      </div>
    </aside>
  );
}
