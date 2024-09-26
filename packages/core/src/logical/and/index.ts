/**
 * Logical `(a && b)`
 *
 * Logical Conjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_conjunction
 *
 * @example
 * and(true)(0);
 * // false
 */
export const and =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(a) && Boolean(b);

/**
 * Logical `(a(x) && b(x))`
 *
 * Logical (Function Result) Conjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_conjunction
 *
 * @example
 * andFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // true
 */
export const andFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(a(c)) && Boolean(b(c));
