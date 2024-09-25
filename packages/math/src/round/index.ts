/**
 * Rounds a number to a specified precision.
 *
 * @throws {Error} Throws an error if precision is not integer.
 *
 * @example
 * ```javascript
 * const value = round(1.2345); // 1
 * const value = round(1.2345, 2); // 1.23
 * const value = round(1.2345, 3); // 1.235
 * const value = round(1.2345, 3.1); // Error
 * ```
 */
export function round(value: number, precision = 0): number {
  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be an integer.');
  }

  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}
