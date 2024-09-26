/**
 * Pass a value to a function and then the result to another function.
 *
 * Bird: `Bluebird`
 *
 * Signature: `B :: (a → b) → (c → a) → c → b`
 *
 * Lambda: `λabc.a(bc)`
 *
 * @example
 * B((x) => x + 8)((x) => x * 3)(4);
 * // 20
 */
export const B =
  <A, B>(f: (z: A) => B) =>
  <C>(g: (y: C) => A) =>
  (x: C) =>
    f(g(x));

/**
 * @alias B
 */
export const composition = B;
