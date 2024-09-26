/**
 * Corresponds to the encoding of `false` in the lambda calculus.
 * Inverse of constant (K)
 *
 * Symbol: `KI`
 *
 * AKA: `--`
 *
 * Bird: `Kite`
 *
 * Signature: `Ki :: a → b → b`
 *
 * Lambda: `λab.b`
 *
 * Combinator: `KI`
 */
export const KI =
  <A>(x: A) =>
  <B>(y: B): B =>
    y;
