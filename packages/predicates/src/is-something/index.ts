import { compose, not } from '@hypergiant/core';
import { isNothing } from '../is-nothing';

/**
 * Determines if the given value is **not** undefined or null.
 *
 * @example
 * if(isSomething(val)) {
 *   // happy path...
 * }
 */
export const isSomething = compose(not, isNothing);
