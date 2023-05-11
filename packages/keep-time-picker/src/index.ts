/// <reference types="@emotion/react/types/css-prop" />
import './tailwind/theme.css';
import TimePickerWithConfig from './components/TimeKeeperContainer';

export type { TimeInput, TimeOutput } from './helpers/types';

export const TimeKeeper = TimePickerWithConfig;
export default TimeKeeper;
