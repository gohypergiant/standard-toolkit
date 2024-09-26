import type { Map } from "@/types";

/**
 * Maps over the given array, calling the mapping function for each element.
 * Returns a new array of the results.
 *
 * @example
 * map(x => x * 2)([1, 2, 3, 4, 5]);
 * // [2, 4, 6, 8, 10]
 */
export const map =
  <T, R>(map: Map<T, R>) =>
  <C extends T[]>(arr: C) => {
    const len = arr.length;
    const res: R[] = new Array(len);

    for (let i = 0; i < len; i++) {
      res[i] = map(arr[i], i);
    }

    return res;
  };
