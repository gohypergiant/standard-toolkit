import type { Predicate } from '@/types';

/**
 * Returns the first element of the given array that satisfies the predicate.
 * Returns `null` otherwise.
 *
 * @example
 * find(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 2
 */
export const find =
  <T>(predicate: Predicate<T>) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i] as T, i)) {
        return arr[i];
      }
    }

    return null;
  };
