/**
 * Returns a new array with the given value added to the start.
 *
 * @example
 * push([1, 2, 3, 4])(0);
 * // [0, 1, 2, 3, 4]
 */
export const unshift =
  <T>(arr: T[]) =>
  (x: T) => {
    const len = arr.length;
    const res = new Array<T>(len + 1);

    res[0] = x;

    for (let i = 0; i < len; i++) {
      res[i + 1] = arr[i] as T;
    }

    return res;
  };
