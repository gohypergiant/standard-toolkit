import type { Functor_ } from '../../functors/1_functor';
import type { UnaryFunction } from '../types';

/**
 * Calls a mappable's (functor's) `map` function. Giving it the given function.
 *
 * map :: Functor f => (a -> b) -> f a -> f b
 */
export const mapHelper =
  <A, B>(fn: UnaryFunction<A, B>) =>
  <T extends Functor_<A>>(mappable: T) =>
    mappable.map(fn);
