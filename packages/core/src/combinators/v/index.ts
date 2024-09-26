/**
 * Symbol: `V`
 *
 * AKA:
 *
 * Bird: `Vireo`
 *
 * Signature: `a → b → (a → b → c) → c`
 *
 * Lamda: `λabf.fab`
 *
 * Combinator: `BCT`
 */
export const V =
  <A>(a: A) =>
  <B>(b: B) =>
  <C>(f: (x: A) => (y: B) => C) =>
    f(a)(b);
