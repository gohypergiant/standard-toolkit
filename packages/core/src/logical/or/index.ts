/**
 * Logical `(a || b)`
 *
 * Logical Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @example
 * or(true)(0);
 * // true
 */
export const or =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(a) || Boolean(b);

/**
 * Logical `(a(x) || b(x))`
 *
 * Logical (Function Result) Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @example
 * orFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // true
 */
export const orFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(a(c)) || Boolean(b(c));

/**
 * Swapped Logical Or: `(b || a)`
 *
 * Swapped Logical Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @example
 * swappedOr(0)(true);
 * // true
 */
export const swappedOr =
  <A>(a: A) =>
  <B>(b: B) =>
    Boolean(b) || Boolean(a);

/**
 * Swapped Logical Or(): `(b(x) || a(x))`
 *
 * Swapped Logical (Function Result) Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
 *
 * @example
 * swappedOrFn(s => s.trimEnd())(s => s.trim())('foo bar ');
 * // true
 */
export const swappedOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(b(c)) || Boolean(a(c));
