/**
 * Returns the first index as which a given element can be found in the array.
 * Returns `-1` otherwise.
 *
 * @example
 * indexOf(3)([[1, 2, 3, 4, 5]])
 * // 2
 */
export const indexOf =
  <T>(x: T) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        return i;
      }
    }

    return -1;
  };
