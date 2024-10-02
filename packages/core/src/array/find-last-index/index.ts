import type { Predicate } from '@/types';

/**
 * Returns the last index of the given array that satisfies the predicate.
 * Returns `-1` otherwise.
 *
 * @example
 * findLastIndex(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 3
 */
export const findLastIndex =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i] as T, i)) {
        return i;
      }
    }

    return -1;
  };
