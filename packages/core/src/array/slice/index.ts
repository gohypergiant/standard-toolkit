/**
 * Returns a new array containing elements between `start` and `end` (exclusive)
 * from the original array.
 *
 * @example
 * slice(0)(4)([1, 2, 3, 4, 5, 6]);
 * // [1, 2, 3, 4]
 */
export const slice =
  (start: number) =>
  (end: number) =>
  <T extends unknown[]>(arr: T) => {
    const minY = Math.min(end, arr.length);
    const res = new Array(minY - start) as T;

    for (let i = start; i < minY; i++) {
      res[i - start] = arr[i];
    }

    return res;
  };
