/**
 * Nullish Coalescing `(a ?? b)`
 *
 * @example
 * nullishOr(null)(4);
 * // 4
 */
export const nullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    a ?? b;

/**
 * Nullish Coalescing `(a(x) ?? b(x))`
 *
 * @example
 * nullishOrFn(x => x.foo)(x => x.bar)({ bar: 4 });
 * // 4
 */
export const nullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    a(c) ?? b(c);

/**
 * Swapped Nullish Coalescing: `b ?? a`
 *
 * @example
 * swappedNullishOr(4)(null);
 * // 4
 */
export const swappedNullishOr =
  <A>(a: A) =>
  <B>(b: B) =>
    b ?? a;

/**
 * Swapped Nullish Coalescing: `b(x) ?? a(x)`
 *
 * @example
 * swappedNullishOrFn(x => x.bar)(x => x.foo)({ bar: 4 });
 * // 4
 */
export const swappedNullishOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    b(c) ?? a(c);
