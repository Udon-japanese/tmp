'use client';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import ChoiceInput, { ChoiceInputProps } from './ChoiceInput';
import { QuestionDraftWithChoiceDraftsAndIsActive } from '../CrtQuizScreen';
import { useFloating, autoUpdate, offset } from '@floating-ui/react';
import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';

export default function QuizEditor({
  currentQuestionDraft,
}: {
  currentQuestionDraft: QuestionDraftWithChoiceDraftsAndIsActive;
}) {
  const [isSliding, setIsSliding] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const choiceInputPropsArr: Pick<ChoiceInputProps, 'color'>[] = [
    { color: 'red' },
    { color: 'blue' },
    { color: 'green' },
    { color: 'yellow' },
  ];
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const { refs, x, y, strategy } = useFloating({
    placement: 'top',
    middleware: [offset(4)],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="flex flex-col mx-4 mb-10">
      <div className="flex items-center max-w-full p-3 rounded-md shadow shadow-black my-20">
        <TextareaAutosize
          className="w-[100vw] resize-none outline-none text-center h-[6.0vmin] text-[max(3.0vmin,20px)]"
          placeholder="問題文を入力..."
          maxRows={4}
          defaultValue={
            currentQuestionDraft.statement ? currentQuestionDraft.statement : ''
          }
        />
      </div>
      <Slider.Root
        className="relative flex items-center my-5"
        step={1}
        max={10}
        min={0}
        value={[minutes]}
        onPointerDown={() => setIsSliding(true)}
        onPointerUp={() => setIsSliding(false)}
        onValueChange={(e) => setMinutes(e[0])}
      >
        <Slider.Track className="relative bg-gray-300 flex-grow rounded-full h-3">
          <Slider.Range className="absolute bg-blue-400 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          ref={refs.setReference}
          className="cursor-pointer block w-6 h-6 bg-white rounded-full border border-gray-400 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-[rgb(59,_130,_246,_0.3)]"
        />
        {isSliding && (
          <span
            ref={refs.setFloating}
            style={{ position: strategy, left: x || 0, top: y || 0 }}
            className="text-gray-500"
          >
            {minutes}
          </span>
        )}
      </Slider.Root>
      <div className="grid grid-cols-2 gap-3 items-stretch h-[30vmin]">
        {choiceInputPropsArr.map((props, i) => {
          const currentChoiceDraft = currentQuestionDraft.choiceDrafts[i];
          return (
            <ChoiceInput
              key={i}
              index={i + 1}
              {...props}
              defaultVal={
                currentChoiceDraft.choice ? currentChoiceDraft.choice : ''
              }
            />
          );
        })}
      </div>
    </div>
  );
}
