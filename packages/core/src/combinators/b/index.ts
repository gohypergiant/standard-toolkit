/**
 * Pass a value to a function and the result to another function
 *
 * Symbol: `B`
 *
 * AKA: `composition`
 *
 * Bird: `Bluebird`
 *
 * Signature: `B :: (a → b) → (c → a) → c → b`
 *
 * Lambda: `λfga.f(ga)`
 *
 * Combinator: `S(KS)K`
 *
 * @example
 * B((x) => x + 8)((x) => x * 3)(4);
 * >> 20
 */
export const B =
  <A, B>(f: (z: A) => B) =>
  <C>(g: (y: C) => A) =>
  (x: C) =>
    f(g(x));
