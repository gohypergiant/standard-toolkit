/**
 * Returns a new array with the order of the elements reversed.
 *
 * @example
 * reverse([1, 2, 3, 4, 5])
 * // [5, 4, 3, 2, 1]
 */
export const reverse = <T extends unknown[]>(arr: T) => {
  const len = arr.length;
  const res = new Array(len) as T;

  for (let i = len - 1; i >= 0; i--) {
    res[len - i - 1] = arr[i];
  }

  return res;
};
