/**
 * Corresponds to the encoding of `true` in the lambda calculus.
 * Takes two arguments and always returns the first.
 *
 * Bird: `Kestrel`
 *
 * Signature: `K :: a → b → a`
 *
 * Lambda: `λab.a`
 *
 * @example
 * K(1)(2);
 * // 1
 */
export const K =
  <A>(a: A) =>
  <B>(_: B): A =>
    a;

/**
 * @alias K
 */
export const constant = K;
