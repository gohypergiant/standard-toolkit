import type { Chain_ } from '../../functors/3b_chain';
import type { UnaryFunction } from '../types';

/**
 * Calls a chainable's `chain` function. Giving it the given function.
 *
 * chain :: Chain f => (a -> f b) -> f a -> f b
 */
export const chainHelper =
  <A, B>(fn: UnaryFunction<A, B>) =>
  <T extends Chain_<A>>(chainable: T) =>
    chainable.chain(fn);
