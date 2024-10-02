/**
 * Takes an unary function and applies it to the given argument.
 *
 * Signature: `A :: (a → b) → a → b`
 *
 * Lambda: `λab.ab`
 *
 * @example
 * A((a) => a + 6)(3);
 * // 9
 */
export const A =
  // Types renamed to avoid confusion with the combinator
    <T, R>(f: (x: T) => R) =>
    (x: T) =>
      f(x);

/**
 * @alias A
 */
export const apply = A;
