import { callNextSecond } from './utils';

/**
 *
 */
export function setClockInterval(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function repeat() {
    cb();
    clearTimeout(timeout);
    timeout = setTimeout(repeat, ms);
  }

  callNextSecond(repeat);

  return timeout;
}

/**
 *
 */
export function setClockTimeout(cb: () => void, ms: number) {
  let timeout: number | undefined;

  function execute() {
    timeout = setTimeout(cb, ms);
  }

  callNextSecond(execute);

  return timeout;
}
