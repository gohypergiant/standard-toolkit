/**
 * Mathematic identity function. A function that always returns the value
 * that was used as its argument, unchanged.
 *
 * Bird: `Idiot`
 *
 * Signature: `I :: a → a`
 *
 * Lambda: `λa.a`
 *
 * @example
 * I(4);
 * // 4
 */
export const I = <A>(x: A) => x;

/**
 * @alias I
 */
export const identity = I;
