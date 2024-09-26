import type { Chain_ } from '../../functors/3b_chain';

/**
 * Calls a joinable's (Chain) `join` function.
 *
 * join :: Chain f => f (f a) -> f a
 */
export const joinHelper = <A, T extends Chain_<A>>(joinable: T) =>
  joinable.join();
