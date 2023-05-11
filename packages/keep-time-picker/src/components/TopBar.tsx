import { useCallback, useMemo } from 'react';
import { Listbox } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

import { CLOCK_VALUES, MERIDIEM, MODE } from '../helpers/constants';
import { getNormalizedTimeValue, isHourMode } from '../helpers/utils';
import useConfig from '../hooks/useConfigContext';
import useTimekeeperState from '../hooks/useStateContext';

export default function TopBar() {
  const { hour24Mode } = useConfig();
  const {
    mode,
    time,
    updateMeridiem,
    setMode,
    updateTimeValue,
    disabledTimeRangeValidator,
  } = useTimekeeperState();

  const timeClick = useCallback(
    (type: 'minute' | 'hour') => {
      const current = mode === MODE.MINUTES ? 'minute' : 'hour';
      if (type !== current) {
        const m = mode === MODE.MINUTES ? MODE.HOURS_24 : MODE.MINUTES;
        setMode(m);
      }
    },
    [mode, setMode]
  );

  // double ternary nastiness
  const hour = hour24Mode
    ? time.hour
    : time.hour % 12 === 0
    ? 12
    : time.hour % 12;

  const meridiem = time.hour >= 12 ? MERIDIEM.pm : MERIDIEM.am;
  const isHour = isHourMode(mode);
  const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
  const formattedMinute = ('0' + time.minute).slice(-2);

  const dropdownOptions = useMemo(() => {
    const o = CLOCK_VALUES[mode].dropdown;

    let validator: (value: string, i: number) => boolean = () => true;
    if (disabledTimeRangeValidator) {
      if (mode === MODE.HOURS_12) {
        if (meridiem === 'am') {
          validator = (_, i) =>
            disabledTimeRangeValidator.validateHour((i + 1) % 12);
        } else {
          validator = (_, i) => {
            // account for last number (12) which should be first (noon, 1pm, ...) in 24h format
            const num = i === 11 ? 12 : i + 13;
            return disabledTimeRangeValidator.validateHour(num);
          };
        }
      } else if (mode === MODE.HOURS_24) {
        validator = (_, i) =>
          disabledTimeRangeValidator.validateHour((i + 1) % 24);
      } else if (mode === MODE.MINUTES) {
        validator = (v) =>
          disabledTimeRangeValidator.validateMinute(time.hour, parseInt(v, 10));
      }
    }
    return o.map((value, i) => ({
      value,
      enabled: validator(value, i),
    }));
  }, [mode, disabledTimeRangeValidator, meridiem, time.hour]);
  const selected = getNormalizedTimeValue(mode, time).toString();

  // select a value
  function handleDropdownSelect(val: string) {
    let parsed = parseInt(val, 10);
    if (mode === MODE.HOURS_12 && parsed === 12) {
      parsed = 0;
    }
    updateTimeValue(parsed, { type: 'dropdown' });
  }

  const HourButton = useMemo(
    () => (
      <div
        // css={styles.hourWrapper(hour24Mode)}
        onClick={() => timeClick('hour')}
        className={twMerge(
          `relative btn btn-square btn-lg`,
          isHour ? `bg-primary hover:bg-primary` : `bg-base-200`,
          `cursor-pointer`,
          'keep-time-picker__tb-minute-wrapper'
        )}
      >
        <span
          // css={[styles.time(isHour)]}
          data-testid="topbar_hour"
          className={twMerge(
            'text-5xl font-medium select-none text-primary-content',
            'keep-time-picker__tb-hour',
            isHour && 'keep-time-picker__tb-hour--active'
          )}
        >
          {formattedHour}
        </span>
      </div>
    ),
    [formattedHour, isHour, timeClick]
  );

  const MinuteButton = useMemo(
    () => (
      <div
        // css={styles.minuteWrapper(hour24Mode)}
        onClick={() => timeClick('minute')}
        className={twMerge(
          `relative btn btn-square btn-lg`,
          !isHour ? `bg-primary hover:bg-primary` : `bg-base-200`,
          'keep-time-picker__tb-minute-wrapper'
        )}
      >
        <span
          // css={styles.time(!isHour)}
          data-testid="topbar_minute"
          className={twMerge(
            'text-5xl font-medium select-none text-primary-content',
            'keep-time-picker__tb-hour',
            !isHour && 'keep-time-picker__tb-hour--active'
          )}
        >
          {formattedMinute}
        </span>
      </div>
    ),
    [formattedMinute, isHour, timeClick]
  );

  return (
    <div
      // css={styles.wrapper(hour24Mode)}
      className={twMerge(
        `relative flex flex-row gap-0.5 justify-center items-center p-2`,
        'keep-time-picker__top-bar'
      )}
      data-testid="topbar"
    >
      {/* hour */}
      {isHour ? (
        <Listbox value={selected} onChange={handleDropdownSelect}>
          <div className="relative">
            <Listbox.Button>{HourButton}</Listbox.Button>
            <Listbox.Options
              as="ul"
              className={twMerge(
                'absolute z-30 mt-1 max-h-64 w-full overflow-y-scroll',
                'scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-base-100 scrollbar-thumb-rounded-xl scrollbar-track-rounded',
                'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                'bg-base-300 rounded-lg'
              )}
            >
              {dropdownOptions.map(({ value, enabled }) => (
                <Listbox.Option
                  as="li"
                  className={({ active }) =>
                    twMerge(
                      `relative cursor-default select-none text-2xl p-1 text-center`,
                      value === selected
                        ? `bg-primary/50 text-primary-content`
                        : `text-primary-content`,
                      active
                        ? 'bg-primary text-primary-content'
                        : 'text-primary-content'
                    )
                  }
                  key={value}
                  value={value}
                >
                  <div>{value}</div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      ) : (
        HourButton
      )}

      <span
        className={twMerge(
          `text-5xl`,
          `text-primary`,
          'keep-time-picker__tb-colon'
        )}
      >
        :
      </span>

      {/* minute */}
      {!isHour ? (
        <Listbox value={selected} onChange={handleDropdownSelect}>
          <div className="relative">
            <Listbox.Button>{MinuteButton}</Listbox.Button>
            <Listbox.Options
              className={twMerge(
                'absolute z-30 mt-1 max-h-64 w-full overflow-y-scroll',
                'scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-base-100 scrollbar-thumb-rounded-xl scrollbar-track-rounded',
                'shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                'bg-base-300 rounded-lg'
              )}
            >
              {dropdownOptions.map(({ value, enabled }) => (
                <Listbox.Option
                  className={({ active }) =>
                    twMerge(
                      `relative cursor-default select-none text-2xl p-1 text-center`,
                      value === selected
                        ? `bg-primary/50 text-primary-content`
                        : `text-primary-content`,
                      active
                        ? 'bg-primary text-primary-content'
                        : 'text-primary-content'
                    )
                  }
                  key={value}
                  value={value}
                >
                  {value}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      ) : (
        MinuteButton
      )}

      {/* meridiem */}
      {!hour24Mode && (
        <div className="btn-group btn-group-vertical ml-2">
          <button
            className={twMerge(
              'btn btn-sm',
              meridiem === MERIDIEM.am ? 'btn-primary' : 'btn-base-200'
            )}
            onClick={() => updateMeridiem(MERIDIEM.am)}
          >
            AM
          </button>
          <button
            className={twMerge(
              'btn btn-sm',
              meridiem === MERIDIEM.pm ? 'btn-primary' : 'btn-base-200'
            )}
            onClick={() => updateMeridiem(MERIDIEM.pm)}
          >
            PM
          </button>
        </div>
      )}
    </div>
  );
}
