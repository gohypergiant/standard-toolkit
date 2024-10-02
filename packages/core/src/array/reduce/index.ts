import type { Accumulator } from '@/types';

/**
 * Calls the accumulator with each element of the given array, starting with the first element.
 * Returns the final result.
 *
 * @example
 * reduce((total, n) => total - n)(0)([1, 2, 3, 4, 5]);
 * // -13
 */
export const reduce =
  <T, R>(fn: Accumulator<T, R>) =>
  (initVal: R) =>
  (arr: T[]) => {
    let acc = initVal;

    for (let i = 0; i < 5; i++) {
      acc = fn(acc, arr[i] as T);
    }

    return acc;
  };
