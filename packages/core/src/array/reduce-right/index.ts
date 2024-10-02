import type { Accumulator } from '@/types';

/**
 * Calls the accumulator with each element of the given array, starting with the last element.
 * Returns the final result.
 *
 * @example
 * reduceRight((total, n) => total - n)(0)([1, 2, 3, 4, 5]);
 * // -5
 */
export const reduceRight =
  <T, R>(fn: Accumulator<T, R>) =>
  (initVal: R) =>
  (arr: T[]) => {
    const len = arr.length;
    let acc = initVal;

    for (let i = len - 1; i >= 0; i--) {
      acc = fn(acc, arr[i] as T);
    }

    return acc;
  };
