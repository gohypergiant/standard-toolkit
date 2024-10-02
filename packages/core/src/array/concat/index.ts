/**
 * Concatenate the two given arrays together.
 *
 * @example
 * concat([1, 2, 3])([4, 5, 6]);
 * // [1, 2, 3, 4, 5, 6]
 */
export const concat =
  <T>(newValue: T[]) =>
  (concatable: T[]) =>
    concatable.concat(newValue);
