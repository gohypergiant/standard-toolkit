/**
 * One param to a function of 1-arity
 *
 * AKA: `apply`
 *
 * Bird: `--`
 *
 * Signature: `A :: (a → b) → a → b`
 *
 * Lambda: `λfa.fa`
 *
 * @example
 * A((a) => a + 6)(3);
 * >> 9
 */
export const A =
  <A, B>(f: (x: A) => B) =>
  (x: A) =>
    f(x);
