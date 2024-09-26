/**
 * Symbol: `T`
 *
 * AKA: `applyTo`
 *
 * Bird: `Thrush`
 *
 * Signature: `Th :: (a → b) → (c → a) → c → b`
 *
 * Lamda: `λaf.fa`
 *
 * Combinator: `CI`
 */
export const Th =
  <A>(x: A) =>
  <B>(f: (x: A) => B) =>
    f(x);
