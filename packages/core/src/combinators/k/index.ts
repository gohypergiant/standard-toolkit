/**
 * Corresponds to the encoding of `true` in the lambda calculus.
 *
 * Symbol: `K`
 *
 * AKA: `constant`
 *
 * Bird: `Kestrel`
 *
 * Signature: `K :: a → b → a`
 *
 * Lambda: `λab.a`
 *
 * Combinator: `K`
 */
export const K =
  <A>(x: A) =>
  <B>(_: B): A =>
    x;
