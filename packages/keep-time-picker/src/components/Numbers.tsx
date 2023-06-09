import { memo, useMemo } from 'react';
import { SpringValue, animated } from '@react-spring/web';
import { twMerge } from 'tailwind-merge';

import { CLOCK_VALUES, MERIDIEM, MINUTES, MODE } from '../helpers/constants';
import DisabledTimeRange from '../helpers/disable-time';
import { transform } from '../helpers/math';

interface CommonProps {
  disabledTimeRangeValidator: DisabledTimeRange | null;
  anim: {
    opacity: SpringValue<number>;
    translate: SpringValue<number>;
    translateInner: SpringValue<number>;
  };
}

interface MinuteProps extends CommonProps {
  hour: number;
}

interface HourProps extends CommonProps {
  mode: MODE.HOURS_12 | MODE.HOURS_24;
  hour24Mode: boolean;
  meridiem: MERIDIEM;
}

/*
	can memoize components since `anim` object doesn't actually change
*/

function Hours({
  anim,
  mode,
  hour24Mode,
  disabledTimeRangeValidator,
  meridiem,
}: HourProps) {
  const { opacity, translate: translateOuter, translateInner } = anim;
  const { numbersOuter, numbersInner } = useMemo(() => {
    const { numbers: numbersOuter, numbersInner } = CLOCK_VALUES[mode];
    let normalizeOuterIndex: (i: number) => number;
    // for 12h mode, 12 is actually index 0
    if (mode === MODE.HOURS_12 && meridiem === 'am') {
      normalizeOuterIndex = (i) => (i % 11) + 1;
    } else if (mode === MODE.HOURS_12 && meridiem === 'pm') {
      normalizeOuterIndex = (i) => (i % 11) + 13;
    } else {
      // for 24h mode, 12/24 is last index for ring
      normalizeOuterIndex = (i) => (i % 12) + 13;
    }

    const normalizeInnerIndex = (i: number) => (i % 12) + 1;
    return {
      numbersOuter: numbersOuter.map((value, i) => ({
        value,
        enabled:
          disabledTimeRangeValidator?.validateHour(normalizeOuterIndex(i)) ??
          true,
      })),
      numbersInner: numbersInner?.map((value, i) => ({
        value,
        enabled:
          disabledTimeRangeValidator?.validateHour(normalizeInnerIndex(i)) ??
          true,
      })),
    };
  }, [mode, meridiem, disabledTimeRangeValidator]);

  return (
    <animated.div
      style={{ opacity }}
      className={twMerge(
        'absolute left-0 top-0 z-10',
        'react-timekeeper__clock-hours'
      )}
    >
      {numbersOuter.map(({ value, enabled }, i) => {
        return (
          <animated.span
            key={value}
            data-testid="number_hour_outer"
            style={{
              transform: translateOuter.to((v) => transform(i + 1, v)),
            }}
            className={twMerge(
              'inline-block absolute z-20 pointer-events-none rounded-full',
              !hour24Mode ? `text-base` : 'text-sm',
              `text-center leading-8 w-[34px] h-[34px]`,
              enabled ? 'text-primary-content' : 'text-disabled'
            )}
          >
            {value}
          </animated.span>
        );
      })}

      {hour24Mode &&
        numbersInner !== undefined &&
        numbersInner.map(({ value, enabled }, i) => {
          return (
            <animated.span
              // css={numbersStyle({ hour24Mode, inner: true, enabled })}
              key={value}
              data-testid="number_hour_inner"
              style={{
                transform: translateInner.to((v) => transform(i + 1, v)),
              }}
              className={twMerge(
                'inline-block absolute z-20 pointer-events-none rounded-full',
                `text-xs text-center leading-8 w-[34px] h-[34px]`,
                enabled ? 'text-primary-content' : 'text-disabled'
              )}
            >
              {value}
            </animated.span>
          );
        })}
    </animated.div>
  );
}

export const HourNumbers = memo(Hours, (prev, next) => {
  return (
    prev.mode === next.mode &&
    prev.hour24Mode === next.hour24Mode &&
    prev.meridiem === next.meridiem &&
    prev.disabledTimeRangeValidator === next.disabledTimeRangeValidator
  );
});

function Minutes({ anim, hour, disabledTimeRangeValidator }: MinuteProps) {
  const { opacity, translate } = anim;
  const minutes = useMemo(() => {
    return MINUTES.map((value) => ({
      value,
      enabled:
        disabledTimeRangeValidator?.validateMinute(hour, parseInt(value, 10)) ??
        true,
    }));
  }, [disabledTimeRangeValidator, hour]);

  return (
    <animated.div
      style={{ opacity }}
      className={twMerge(
        'absolute left-0 top-0 z-10',
        'react-timekeeper__clock-minutes'
      )}
    >
      {minutes.map(({ value, enabled }, i) => {
        return (
          <animated.span
            key={value}
            data-testid="number_minute"
            style={{
              transform: translate.to((v) => transform(i + 1, v)),
            }}
            className={twMerge(
              'inline-block absolute z-20 pointer-events-none rounded-full',
              `text-base text-center leading-8 w-[34px] h-[34px]`,
              enabled ? 'text-primary-content' : 'text-disabled'
            )}
          >
            {value}
          </animated.span>
        );
      })}
    </animated.div>
  );
}

export const MinuteNumbers = memo(Minutes, (prev, next) => {
  return (
    prev.disabledTimeRangeValidator === next.disabledTimeRangeValidator &&
    prev.hour === next.hour
  );
});
