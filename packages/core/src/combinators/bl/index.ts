/**
 * Composition of composition and composition. Pass two values to
 * a function and the result to another function
 *
 * Symbol: `B1`
 *
 * AKA: `--`
 *
 * Bird: `Blackbird`
 *
 * Signature: `BL :: (c -> d) -> (a -> b -> c) -> a -> b -> d`
 *
 * Lambda: `λfgab.f(gab)`
 *
 * Combinator: `BBB`
 */

// Alternative supposedly:
// const BL = B(B)(B);

export const BL =
  <C, D>(f: (z: C) => D) =>
  <A, B>(g: (x: A) => (y: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(g(a)(b));
