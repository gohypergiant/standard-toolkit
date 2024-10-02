import type { Predicate } from '@/types';

/**
 * Returns the last element of the given array that satisfies the predicate.
 * Returns `null` otherwise.
 *
 * @example
 * findLast(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 4
 */
export const findLast =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = len - 1; i >= 0; i--) {
      if (predicate(arr[i] as T, i)) {
        return arr[i];
      }
    }

    return null;
  };
