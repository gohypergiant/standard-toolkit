import type { Apply_ } from '../../functors/2b_apply';
import type { UnaryFunction } from '../types';

// ^ TODO: Verify these

// liftA2 :: (Apply f) => (a1 -> a2 -> b) -> f a1 -> f a2 -> f b
const liftA2 =
  <A, B>(fn: UnaryFunction<A, B>) =>
  <C extends Apply_<A>>(a1: C) =>
  <D>(a2: Apply_<D>) =>
    a1.map(fn).ap(a2);

// liftA3 :: (Apply f) => (a1 -> a2 -> a3 -> b) -> f a1 -> f a2 -> f a3 -> f b
const liftA3 =
  <A, B>(fn: UnaryFunction<A, B>) =>
  <C extends Apply_<A>>(a1: C) =>
  <D>(a2: Apply_<D>) =>
  <E>(a3: Apply_<E>) =>
    a1.map(fn).ap(a2).ap(a3);
