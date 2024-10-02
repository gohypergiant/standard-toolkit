/**
 * Returns a new array with the order of the elements reversed.
 *
 * @example
 * reverse([1, 2, 3, 4, 5])
 * // [5, 4, 3, 2, 1]
 */
export const reverse = <T>(arr: T[]) => {
  const len = arr.length;
  const res = new Array<T>(len);

  for (let i = len - 1; i >= 0; i--) {
    res[len - i - 1] = arr[i] as T;
  }

  return res;
};
