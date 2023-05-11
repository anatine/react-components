import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import useConfig from '../hooks/useConfigContext';
import useTimekeeperState from '../hooks/useStateContext';

export default function DoneButton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { onDoneClick, doneButton } = useConfig();
  const { getComposedTime } = useTimekeeperState();

  if (doneButton) {
    return doneButton(getComposedTime());
  }

  if (onDoneClick) {
    return (
      <div
        {...props}
        className={twMerge(
          'flex flex-row justify-center items-center p-2',
          className
        )}
      >
        <button
          // css={style}
          onClick={(e) => onDoneClick(getComposedTime(), e)}
          className={twMerge(
            'btn btn-sm flex-grow-0',
            'react-timekeeper__done-button'
          )}
          data-testid="done-button"
        >
          Done
        </button>
      </div>
    );
  }
  return null;
}
