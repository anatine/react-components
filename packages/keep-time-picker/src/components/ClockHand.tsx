import { useEffect, useRef } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { twMerge } from 'tailwind-merge';

import {
  CLOCK_RADIUS,
  CLOCK_SIZE,
  CLOCK_VALUES,
  MODE,
  NUMBER_OUTER_POSITION,
  getClockHandCirclePosition,
  getClockHandCircleRadius,
  getClockHandLength,
} from '../helpers/constants';
import { calcAnimationAngle } from '../helpers/math';
import { Time } from '../helpers/types';
import { getTimeValue, isSameTime } from '../helpers/utils';

interface Props {
  mode: MODE;
  time: Time;
}

function rotate(r: number) {
  return `rotate(${r} ${CLOCK_RADIUS} ${CLOCK_RADIUS})`;
}

function getAngle(mode: MODE, time: Time) {
  const increments = CLOCK_VALUES[mode].increments;
  const value = getTimeValue(mode, time);
  return value * (360 / increments);
}

export default function ClockHand({ mode, time }: Props) {
  const prevState = useRef({ time, mode });
  const dragCount = useRef(0);

  // clockhand positioning
  const inner = time.hour > 0 && time.hour <= 12;
  const handLength = getClockHandLength(mode, inner);
  const circlePosition = getClockHandCirclePosition(mode, inner);
  const circleRadius = getClockHandCircleRadius(mode, inner);

  const [anim, api] = useSpring(() => {
    return {
      immediate: true,
      rotation: getAngle(mode, time),
      length: handLength,
      position: circlePosition,
    };
  });
  const { rotation, length, position } = anim;

  useEffect(() => {
    const current = rotation.get();
    const next = getAngle(mode, time);

    if (prevState.current.mode !== mode) {
      dragCount.current = 0;
      prevState.current.mode = mode;

      // mode changed, animate clockhand to next mode angle
      const finalAngle = calcAnimationAngle(current, next);
      api.start({
        immediate: false,
        rotation: finalAngle,
        length: handLength,
        position: circlePosition,
      });
    } else if (!isSameTime(prevState.current.time, time)) {
      // time changed, no animation necessary - just update clockhand (without animation)
      prevState.current.time = time;
      dragCount.current++;

      /*
			TODO - consider making this a config option?
			if on hour mode and `switchToMinuteOnHourSelect` is enabled, don't display
			change in time, just wait for mode to change
			*/
      // if (isHourMode(mode) && config.switchToMinuteOnHourSelect && dragCount.current < 2) {
      // 	return
      // }

      api.start({
        immediate: true,
        rotation: next,
        length: handLength,
        position: circlePosition,
      });
    }
  }, [circlePosition, handLength, mode, rotation, api, time]);

  // mini circle on clockhand between increments on minutes
  const value = getTimeValue(mode, time);
  let showIntermediateValueDisplay;
  if (mode === MODE.MINUTES && value % 5) {
    showIntermediateValueDisplay = (
      <circle
        className={twMerge(
          'fill-base-300',
          'react-timekeeper__hand-intermediate-circle'
        )}
        cx={CLOCK_RADIUS}
        cy={NUMBER_OUTER_POSITION}
        r={4}
      />
    );
  }

  return (
    <svg
      width={CLOCK_SIZE}
      height={CLOCK_SIZE}
      viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      className="react-timekeeper__clock-hand"
    >
      <animated.g transform={rotation.to((a) => rotate(a))}>
        <animated.line
          className={twMerge(
            'stroke-neutral-content',
            'react-timekeeper__clock-hand'
          )}
          x1={CLOCK_RADIUS}
          y1={CLOCK_RADIUS}
          x2={CLOCK_RADIUS}
          y2={length}
          strokeWidth="1"
          data-testid="clock-hand"
        />
        <circle
          className={twMerge(
            'fill-neutral-content',
            'react-timekeeper__hand-circle-center'
          )}
          cx={CLOCK_RADIUS}
          cy={CLOCK_RADIUS}
          r={1.5}
        />
        <animated.circle
          className={twMerge(
            'fill-primary',
            'react-timekeeper__hand-circle-outer'
          )}
          cx={CLOCK_RADIUS}
          cy={position}
          r={circleRadius}
        />
        {showIntermediateValueDisplay}
      </animated.g>
    </svg>
  );
}
