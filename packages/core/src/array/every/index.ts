import type { Comparator } from "@/types";

/**
 * Tests whether all elements in the array pass the given comparator.
 *
 * @example
 * every(x => !(x & 1))([1, 2, 3, 4, 5]);
 * // false
 */
export const every =
  <T>(comparator: Comparator<T>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (!comparator(arr[i])) {
        return false;
      }
    }

    return true;
  };
