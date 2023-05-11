import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import ClockWrapper from './ClockWrapper';
import DoneButton from './DoneButton';
import TopBar from './TopBar';

export default function TimeKeeper({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      {/* <Global styles={css(globalStyle)} /> */}

      <div
        className={twMerge(
          'relative inline-flex flex-col select-none antialiased bg-base-100 rounded',
          'react-timekeeper',
          className
        )}
      >
        <TopBar />
        <ClockWrapper />
        <DoneButton />
      </div>
    </>
  );
}
