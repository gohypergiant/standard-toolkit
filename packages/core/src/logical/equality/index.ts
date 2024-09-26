/**
 * Logical `(a === b)`
 *
 * XNOR
 *
 * @link https://en.wikipedia.org/wiki/Logical_equality
 * @link https://en.wikipedia.org/wiki/Logical_biconditional
 */
export const equality = (a: unknown) => (b: unknown) => a === b;

/**
 * Logical `(a(x) === b(x))`
 *
 * @link https://en.wikipedia.org/wiki/Logical_equality
 * @link https://en.wikipedia.org/wiki/Logical_biconditional
 */
export const equalityFn =
  <T>(a: (x: T) => unknown) =>
  (b: (x: T) => unknown) =>
  (c: T) =>
    a(c) === b(c);
