/**
 * Logical `(!a)`
 *
 * Logical Not (Negation)
 *
 * @link https://en.wikipedia.org/wiki/Negation
 */
export const not = <T>(x: T) => !x;

/**
 * Logical `(!a(b))`
 *
 * Logical (Function Result) Not (Negation)
 *
 * @link https://en.wikipedia.org/wiki/Negation
 */
export const notFn =
  <T>(a: (x: T) => unknown) =>
  (b: T) =>
    !a(b);
