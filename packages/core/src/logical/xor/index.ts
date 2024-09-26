/**
 * Logical `(a ^ b)`
 *
 * Exclusive Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Exclusive_or
 *
 * @example
 * xor(true)(0);
 * // true
 */
export const xor = (a: unknown) => (b: unknown) =>
  Boolean((a ? 1 : 0) ^ (b ? 1 : 0));

/**
 * Logical `(a(x) ^ b(x))`
 *
 * Exclusive (Function Result) Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Exclusive_or
 *
 * @example
 * xorFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // false
 */
export const xorFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T) =>
    Boolean((a(c) ? 1 : 0) ^ (b(c) ? 1 : 0));
