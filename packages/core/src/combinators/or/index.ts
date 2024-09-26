/**
 * Symbol:
 *
 * AKA: `alternation`
 *
 * Bird:
 *
 * Signature: `OR :: (a → b) → (a → b) → b`
 *
 * Lambda:
 *
 * Combinator:
 */
export const OR =
  <A, B>(f: (x: A) => B) =>
  (g: (x: A) => B) =>
  (x: A) =>
    Boolean(f(x)) || Boolean(g(x));
