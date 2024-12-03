import type { Callable } from '@/types';

/**
 * Ensures that the given function is only called once.
 */
export const once = <T extends Callable>(fn: T) => {
  let done = false;

  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (!done) {
      done = true;

      return fn(...args);
    }
  };
};
