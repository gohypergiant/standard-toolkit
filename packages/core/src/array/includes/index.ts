/**
 * Determines whether the given array includes and element.
 * Uses strict equality.
 *
 * @example
 * includes(3)([[1, 2, 3, 4, 5]])
 * // true
 */
export const includes =
  <T>(x: T) =>
  (arr: T[]) => {
    const len = arr.length;

    for (let i = 0; i < len; i++) {
      if (arr[i] === x) {
        return true;
      }
    }

    return false;
  };
