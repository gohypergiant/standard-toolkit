import type { Predicate } from "@/types";

/**
 * Returns a copy of the given array of elements that satisfy the predicate.
 *
 * @example
 * filter(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // [2, 4]
 */
export const filter =
  <T>(predicate: Predicate<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;
    const res: T[] = [];

    for (let i = 0; i < len; i++) {
      if (predicate(arr[i], i)) {
        res.push(arr[i]);
      }
    }

    return res;
  };
