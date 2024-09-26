/**
 * Pass a value through two different functions and the results to a function that takes two arguments.
 *
 * Bird: `Phoenix`
 *
 * Signature: (Big) Phi :: (a → b → c) → (d → a) → (d → b) → d → c
 *
 * Lambda: λabcd.a(bd)(cd)
 *
 * @example
 * Phi((x) => (y) => x + y)(x => x + 3)(x => x - 2)(9)
 * // 19
 */
export const Phi =
  <A, B, C>(a: (x: A) => (y: B) => C) =>
  <D>(b: (x: D) => A) =>
  (c: (x: D) => B) =>
  (d: D) =>
    a(b(d))(c(d));

/**
 * @alias Phi
 */
export const fork = Phi;
