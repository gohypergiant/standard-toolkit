// TODO: Need the Foldable functor
import type { UnaryFunction } from '../types';

/**
 * Calls a foldable's `reduce` function. Giving it the given function and starting value.
 */
export const reduceHelper =
  <A, B>(fn: UnaryFunction<A, B>) =>
  (x0: A) =>
  (foldable: any) =>
    foldable.reduce(fn, x0);
