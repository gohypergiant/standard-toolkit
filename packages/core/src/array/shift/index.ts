/**
 * Returns a tuple containing the first element (head) of the given array and
 * the remaining elements of the array (tail).
 *
 * @example
 * shift([1, 2, 3, 4]);
 * // [1, [2, 3, 4, 5]]
 */
export const shift = <T extends unknown[]>(arr: T): [T[number], T] => {
  const len = arr.length;
  const tail = new Array(len - 1) as T;

  const head = arr[0];

  for (let i = 1; i < len; i++) {
    tail[i - 1] = arr[i];
  }

  return [head, tail];
};
