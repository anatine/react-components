import { ChangeTimeFn, TimeInput } from '../helpers/types';
import { ConfigProps, ConfigProvider } from '../hooks/useConfigContext';
import { StateProvider } from '../hooks/useStateContext';
import TimeKeeper from './TimeKeeper';

export interface Props extends ConfigProps {
  time?: TimeInput;
  onChange?: ChangeTimeFn;
  disabledTimeRange?: null | { from: string; to: string };
  className?: string;
}

export default function TimepickerWithConfig({
  time,
  onChange,
  // config props:
  coarseMinutes,
  forceCoarseMinutes,
  switchToMinuteOnHourSelect,
  switchToMinuteOnHourDropdownSelect,
  closeOnMinuteSelect,
  hour24Mode,
  onDoneClick,
  doneButton,
  disabledTimeRange,
  className,
}: Props) {
  return (
    <ConfigProvider
      coarseMinutes={coarseMinutes}
      forceCoarseMinutes={forceCoarseMinutes}
      switchToMinuteOnHourSelect={switchToMinuteOnHourSelect}
      switchToMinuteOnHourDropdownSelect={switchToMinuteOnHourDropdownSelect}
      closeOnMinuteSelect={closeOnMinuteSelect}
      hour24Mode={hour24Mode}
      onDoneClick={onDoneClick}
      doneButton={doneButton}
    >
      <StateProvider
        onChange={onChange}
        time={time}
        disabledTimeRange={disabledTimeRange}
      >
        <TimeKeeper className={className} />
      </StateProvider>
    </ConfigProvider>
  );
}
