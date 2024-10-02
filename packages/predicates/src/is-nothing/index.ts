/**
 * Determines if the given value is undefined or null.
 *
 * @example
 * if(isNothing(val)) {
 *   // error path...
 * }
 */
export const isNothing = (val: unknown) => val == null;
