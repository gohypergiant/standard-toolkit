import type { Predicate } from "@/types";

/**
 * Returns the first index of the given array that satisfies the predicate.
 * Returns `-1` otherwise.
 *
 * @example
 * findIndex(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // 1
 */
export const findIndex =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i], i)) {
        return i;
      }
    }

    return -1;
  };
