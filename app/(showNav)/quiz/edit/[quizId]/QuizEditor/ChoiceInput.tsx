import TextareaAutosize from 'react-textarea-autosize';

export type ChoiceInputProps = {
  color: 'red' | 'blue' | 'green' | 'yellow';
  index: number;
  defaultVal: string;
};

export default function ChoiceInput({
  color,
  index,
  defaultVal,
}: ChoiceInputProps) {
  const choiceColor = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };
  return (
      <TextareaAutosize
        className={`w-full min-h-full p-8 rounded text-white placeholder-gray-50 resize-none text-[max(1.6vh,15px)] ${choiceColor[color]}`}
        placeholder={`${index}つ目の選択肢を追加`}
        defaultValue={defaultVal}
      />
  );
}
