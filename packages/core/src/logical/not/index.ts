/**
 * Logical `(!a)`
 *
 * Logical Not (Negation)
 *
 * @link https://en.wikipedia.org/wiki/Negation
 *
 * @example
 * not(2);
 * // false
 */
export const not = <T>(x: T) => !x;

/**
 * Logical `(!a(b))`
 *
 * Logical (Function Result) Not (Negation)
 *
 * @link https://en.wikipedia.org/wiki/Negation
 *
 * @example
 * notFn(x => x & 1)(4);
 * // true
 */
export const notFn =
  <T>(a: (x: T) => unknown) =>
  (b: T) =>
    !a(b);
