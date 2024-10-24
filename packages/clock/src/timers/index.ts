import { callNextSecond } from './utils';

/**
 * Works the same way as setInterval but will wait to fire until next clock second.
 *
 * @example
 * const cleanup = setClockInterval(() => console.log('hi'), 250);
 * // will log hi every 250ms starting on next clock second
 */
export function setClockInterval(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function repeat() {
    cb();
    clearTimeout(timeout);
    timeout = setTimeout(repeat, ms);
  }

  callNextSecond(repeat);

  return () => timeout;
}

/**
 * Works the same way as setTimeout but will wait to fire until next clock second.
 *
 * @example
 * const cleanup = setClockTimeout(() => console.log('hi'), 250);
 * // will log hi after 250ms starting on next clock second
 */
export function setClockTimeout(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function execute() {
    timeout = setTimeout(cb, ms);
  }

  callNextSecond(execute);

  return () => timeout;
}
