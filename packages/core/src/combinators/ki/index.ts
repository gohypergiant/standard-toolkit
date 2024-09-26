/**
 * Corresponds to the encoding of `false` in the lambda calculus.
 * Takes two arguments and always returns the second.
 * Inverse of `constant` (`K`).
 *
 * Bird: `Kite`
 *
 * Signature: `Ki :: a → b → b`
 *
 * Lambda: `λab.b`
 *
 * @example
 * KI(1)(2);
 * // 2
 */
export const KI =
  <A>(_: A) =>
  <B>(b: B): B =>
    b;
