import { A } from '@belsrc/fjp-combinators';
import type { Functor_ } from '../1_functor';

// ^ ***********************************************************************
// ^ APPLY
// ^ ***********************************************************************

// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#apply
// ? https://github.com/fantasyland/fantasy-land#apply
// ?
// ? Module must match the Apply signature for some type T, support Functor algebra for
// ? the same T, and obey following laws:
// ?
// ?     Composition: A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))
// ?
// ? An Apply type allows us to merge contexts where as, a Semigroup type allows us to merge values
// ? Apply differs from `map` in that for `map` you supply a function to be applied to the value
// ?   for `ap` you supply a functor containing a function. (difference bwetween unwrapped and wrapped)
// ?
// ? Signature Explanation:
// ?    A_val.ap(A_func)
// ?    A_val is an Apply Functor containing a "value".
// ?    A_func is an Apply Functor containing an unary function.
// ?    With the `ap` call performing `A_func(A_val)`

// ^----------------------------------
// ^----------- Apply Type -----------
// ^----------------------------------

/**
 * @example
 * 𝐴𝑝𝑝𝑙𝑦 a {
 *   ap: (𝐴 a => b) => 𝐴 b
 *   map: (a => b) => 𝐴 b
 * }
 */
export interface Apply_<T> extends Functor_<T> {
  /**
   * Applies the given module that contains a function `𝑀 𝑓: 𝑎 → 𝑏` to the value `𝑎` in this module.
   * Wrapping the result in a new module.
   */
  ap<A, R>(otherApply: Apply_<A>): Apply_<R>;
  map<R>(f: (x: T) => R): Apply_<R>;
}

// ^--------------------------------------
// ^----------- Concrete Apply -----------
// ^--------------------------------------

/**
 * Module must match the Apply signature for some type T,
 * support Functor algebra for the same T, and obey following laws:
 *   * Composition
 *     * `A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))`
 *
 * An Apply type allows us to merge contexts, where as a Semigroup
 * type allows us to merge values. Apply differs from `map` in that
 * for `map` you supply a function to be applied to the value. For
 * `ap` you supply a functor containing a function. (difference
 * between unwrapped and wrapped)
 *
 * @example
 * 𝐴𝑝𝑝𝑙𝑦 a {
 *   ap: (𝐴𝑝𝑝𝑙𝑦 a => b) => 𝐴 b
 *   map: (a => b) => 𝐴 b
 * }
 */
export const Apply = <T>(v: T): Apply_<T> => ({
  name: 'Apply',
  __value: v,

  map<R>(fn: (x: T) => R) {
    return Apply(A(fn)(this.__value));
  },

  ap<A, R>(otherApply: Apply_<A>) {
    // `otherApply` holds an Unary Function as __value
    // that is applied to this.__value
    return this.map(otherApply.__value as unknown as (x: T) => R) as Apply_<R>;
  },

  inspect() {
    return `Apply(${this.__value})`;
  },
});
