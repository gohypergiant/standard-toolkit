/**
 * Pass a value through two different functions to another function of 2-arity.
 *
 * Symbol:
 *
 * AKA: `Fork`
 *
 * Bird: `Phoenix`
 *
 * Signature: (Big) Phi :: (b → c → d) → (a → b) → (a → c) → a → d
 *
 * Lambda:
 *
 * Combinator:
 */
export const Phi =
  <B, C, D>(h: (b: B) => (c: C) => D) =>
  <A>(f: (x: A) => B) =>
  (g: (x: A) => C) =>
  (x: A) =>
    h(f(x))(g(x));
