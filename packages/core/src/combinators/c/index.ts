/**
 * Swap argument order
 *
 * Symbol: `C`
 *
 * AKA: `--`
 *
 * Bird: `Cardinal`
 *
 * Signature: `C :: (a → b → c) → a → (a → b) → c`
 *
 * Lambda: `λfab.fba`
 *
 * Combinator: `S(BBS)(KK)`
 */
export const C =
  <A, B, C>(f: (x: A) => (y: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(a)(b);
