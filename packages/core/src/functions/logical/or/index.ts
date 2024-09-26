// Strictly speaking, these should probably use the OR combinator. But given the common use
// I have opted for a looser conditional check.

/**
 * Logical `(a || b)`
 *
 * Logical Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
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
 */
export const orFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(a(c)) || Boolean(b(c));

// const isEven = (x: number) => (x & 1) === 0;
// const multTwo = (x: number) => x * 2;

// const a = orFn(isEven);
// const b = a(multTwo);
// const c = b(54);

/**
 * Swapped Logical Or: `(b || a)`
 *
 * Swapped Logical Disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_disjunction
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
 */
export const swappedOrFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    Boolean(b(c)) || Boolean(a(c));

// Swapped Or is good for logical defaults
// const orZero = swappedOr(0);
// const res1 = orZero(5);
// const res2 = orZero(null);
