/**
 * Pass the value to itself
 *
 * Symbol: `M`
 *
 * AKA: `Self-application`
 *
 * Bird: `Mockingbird`
 *
 * Signature: `M :: (a → a) → a`
 *
 * Lambda: `λf.ff`
 *
 * Combinator: `SII`
 */
export const M = <A extends (x: unknown) => unknown, B>(f: (y: A) => B) =>
  f(f as unknown as A);
