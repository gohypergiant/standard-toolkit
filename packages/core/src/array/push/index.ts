/**
 * Returns a new array with the given value added to the end.
 *
 * @example
 * push([1, 2, 3, 4])(5);
 * // [1, 2, 3, 4, 5]
 */
export const push =
  <T>(arr: T[]) =>
  (x: T) => {
    const len = arr.length;
    const res = new Array<T>(len + 1);

    for (let i = 0; i < len; i++) {
      res[i] = arr[i] as T;
    }

    res[len] = x;

    return res;
  };
