import type { Predicate } from '../types';
// TODO: Need the Filterable functor

/**
 * Calls a filterable's `filter` function. Giving it the given function.
 */
export const filterHelper =
  <T>(fn: Predicate<T>) =>
  (filterable: any) =>
    filterable.filter(fn);
