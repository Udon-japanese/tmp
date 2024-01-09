import { Dispatch, SetStateAction } from 'react';
import useMediaQuery from '@/app/hooks/useMediaQuery';
import Popover from '@/app/components/Popover';
import { Icon } from '@iconify/react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionForms } from '@/app/types';

export default function SelectTimeLimitMenu({
  openSelectTimeLimitMenu,
  setOpenSelectTimeLimitMenu,
  currentQDraftIndex,
}: {
  openSelectTimeLimitMenu: boolean;
  setOpenSelectTimeLimitMenu: Dispatch<SetStateAction<boolean>>;
  currentQDraftIndex: number;
}) {
  const { setValue, control } = useFormContext<QuestionForms>();
  const timer = useWatch({control, name: `questionDrafts.${currentQDraftIndex}.timer` as const});
  const { isMd } = useMediaQuery();
  const timeLimits = [0, 5, 10, 20, 30, 60, 90, 120, 180, 240, 300, 600];

  const closePopover = () => setOpenSelectTimeLimitMenu(false);
  const formatSeconds = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const minStr = min ? `${min}分` : '';
    const secStr = sec ? `${sec}秒` : '';
    const formattedSec = seconds ? `${minStr}${secStr}` : 'なし';

    return formattedSec;
  };

  return (
    <Popover
      content={
        <div className="w-full bg-white p-4 md:rounded-md">
          <div className="font-bold text-center mb-4 md:hidden">制限時間</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 items-stretch gap-3 md:block md:w-56">
            {timeLimits.map((timeLimit) => {
              const formattedTimeLimit = formatSeconds(timeLimit);
              const isCurrentTimeLimit = timer === timeLimit;
              const setTimer = () => {
                setValue(
                  `questionDrafts.${currentQDraftIndex}.timer` as const,
                  timeLimit
                );
              };

              if (isMd) {
                return (
                  <button
                    key={timeLimit}
                    onClick={() => {
                      setTimer();
                      closePopover();
                    }}
                    disabled={isCurrentTimeLimit}
                    className={`relative flex w-full items-center justify-between space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75  ${
                      isCurrentTimeLimit ? '' : 'hover:bg-gray-100'
                    }`}
                  >
                    <p className="text-sm">{formattedTimeLimit}</p>
                    {isCurrentTimeLimit && (
                      <Icon icon="ic:baseline-check" className="text-xl" />
                    )}
                  </button>
                );
              }
              return (
                <button
                  key={timeLimit}
                  onClick={setTimer}
                  className={`relative flex w-full items-center justify-center px-5 py-2 text-left text-sm transition-all duration-75 rounded-lg font-bold ${
                    isCurrentTimeLimit
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  <p className="text-sm">{formattedTimeLimit}</p>
                </button>
              );
            })}
          </div>
          <div className="md:hidden flex items-center justify-center mt-7">
            <button
              onClick={closePopover}
              type="button"
              className="bg-blue-600 text-white px-8 py-2 text-sm transition-all duration-75 rounded-lg font-bold"
            >
              完了
            </button>
          </div>
        </div>
      }
      align="start"
      openPopover={openSelectTimeLimitMenu}
      setOpenPopover={setOpenSelectTimeLimitMenu}
    >
      <button
        onClick={() =>
          setOpenSelectTimeLimitMenu((prevOpenPopover) => !prevOpenPopover)
        }
        className="flex flex-row items-center mb-4 justify-between px-3 py-2 rounded-lg bg-purple-600 text-white font-bold max-w-fit"
      >
        <Icon icon="material-symbols:timer-outline" className="text-xl" />
        <span className="ml-1">
          制限時間: {formatSeconds(timer)}
        </span>
      </button>
    </Popover>
  );
}
