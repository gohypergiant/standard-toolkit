/**
 * Pass two values through the same function and pass the results to another function of 2-arity
 *
 * Signature: `Psi :: (a → a → b) → (c → a) → c → c → b`
 *
 * Lambda: `λabcd.a(bc)(bd)`
 *
 * @example
 * Psi((x) => (y) => x + y)(x => x + 3)(3)(5)
 * // 14
 */
export const Psi =
  <A, B>(a: (x: A) => (y: A) => B) =>
  <C>(b: (x: C) => A) =>
  (c: C) =>
  (d: C) =>
    a(b(c))(b(d));
