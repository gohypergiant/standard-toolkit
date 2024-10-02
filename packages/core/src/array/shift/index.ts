/**
 * Returns a tuple containing the first element (head) of the given array and
 * the remaining elements of the array (tail).
 *
 * @example
 * shift([1, 2, 3, 4]);
 * // [1, [2, 3, 4, 5]]
 */
export const shift = <T>(arr: T[]): [T, T[]] => {
  const len = arr.length;
  const tail = new Array<T>(len - 1);

  const head = arr[0] as T;

  for (let i = 1; i < len; i++) {
    tail[i - 1] = arr[i] as T;
  }

  return [head, tail];
};
