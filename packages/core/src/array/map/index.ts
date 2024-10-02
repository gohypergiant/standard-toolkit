import type { MapFn } from '@/types';

/**
 * Maps over the given array, calling the mapping function for each element.
 * Returns a new array of the results.
 *
 * @example
 * map(x => x * 2)([1, 2, 3, 4, 5]);
 * // [2, 4, 6, 8, 10]
 */
export const map =
  <T, R>(map: MapFn<T, R>) =>
  (arr: T[]) => {
    const len = arr.length;
    const res = new Array<R>(len);

    for (let i = 0; i < len; i++) {
      res[i] = map(arr[i] as T, i);
    }

    return res;
  };
