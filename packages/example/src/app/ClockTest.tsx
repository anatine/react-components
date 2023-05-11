import { useState } from 'react';

import TimeKeeper, { TimeInput } from '@anatine/keep-time-picker';

export function Testing() {
  const [hour24Mode, setHour24Mode] = useState(false);

  const now = new Date();
  const [time, setTime] = useState<TimeInput>({
    hour: now.getHours(),
    minute: now.getMinutes(),
  });
  console.debug(`Current time: `, time);

  return (
    <div className="flex flex-col w-full h-screen bg-indigo-100 p-2 gap-4">
      <TimeKeeper
        time={time}
        className="max-w-sm"
        hour24Mode={hour24Mode}
        onDoneClick={({ hour, minute }) => {
          setTime({ hour, minute });
        }}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setHour24Mode(!hour24Mode)}
          className="rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          24 Hour Mode: {hour24Mode ? 'On' : 'Off'}
        </button>
      </div>
    </div>
  );
}
export default Testing;
