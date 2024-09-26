/**
 * Pass two values through the same function and pass the results to another function of 2-arity
 *
 * Symbol:
 *
 * AKA:
 *
 * Bird:
 *
 * Signature: `Psi :: (b → b → c) → (a → b) → a → a → c`
 *
 * Lambda: `λfgab.f(gab)`
 *
 * Combinator:
 */
export const Psi =
  <B, C>(f: (x: B) => (y: B) => C) =>
  <A>(g: (x: A) => B) =>
  (x: A) =>
  (y: A) =>
    f(g(x))(g(y));
