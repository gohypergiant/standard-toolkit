/**
 * Takes an argument and an unary function and then applies the function to the argument.
 * Inverse of `apply` (`A`)
 *
 * Bird: `Thrush`
 *
 * Signature: `Th :: a → (a → b) → b`
 *
 * Lamda: `λab.ba`
 *
 * @example
 * Th(6)(x => x * 2);
 * // 12
 */
export const Th =
  <A>(a: A) =>
  <B>(b: (x: A) => B) =>
    b(a);

/**
 * @alias Th
 */
export const applyTo = Th;
