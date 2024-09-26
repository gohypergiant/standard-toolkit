import type { Semigroup_ } from '../../groups/1_semigroup';

/**
 * Calls a concatable's (Semigroup) `concat` function.
 *
 * concat :: (Semigroup g) => g a -> g a -> g a
 */
export const concatHelper =
  <A, T extends Semigroup_<A>>(concatable: T) =>
  (b: T) =>
    concatable.concat(b);
