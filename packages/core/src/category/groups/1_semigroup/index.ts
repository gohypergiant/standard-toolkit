import type { MathObj_ } from '../../math-obj';
import { concatByType } from '../../utils/concat-by-type';

// ^ ***********************************************************************
// ^ SEMIGROUP
// ^ ***********************************************************************

// ? https://github.com/hemanth/functional-programming-jargon#semigroup
// ?
// ? Any object that has a `concat`/`combine` method. Addition can be thought of
// ? as a combination of two values into one.
// ?
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#semigroup
// ? https://github.com/fantasyland/fantasy-land#semigroup
// ?
// ? Module must match the Semigroup signature for some type T, and obey following laws:
// ?
// ?     Associativity:  S(a).concat(S(b).concat(S(c))) ≡ S(a).concat(S(b)).concat(S(c))
// ?
// ? https://mathworld.wolfram.com/Semigroup.html
// ?
// ? A mathematical object defined for a set and a binary operator in which the multiplication
// ? operation is associative. No other restrictions are placed on a semigroup; thus a
// ? semigroup need not have an identity element and its elements need not have inverses
// ? within the semigroup. A semigroup is an associative groupoid. A semigroup with an identity
// ?  is called a monoid. A semigroup can be empty.
// ?

// ^------------------------------------
// ^---------- Semigroup Type ----------
// ^------------------------------------

/**
 * @example
 * 𝑆𝑒𝑚𝑖𝑔𝑟𝑜𝑢𝑝 a {
 *   concat: (𝑆 a) => 𝑆 a
 * }
 */
export interface Semigroup_<T> extends MathObj_<T> {
  /** Combines two modules together into a new module. */
  concat(x: Semigroup_<T>): Semigroup_<T>;
}

// ^----------------------------------------
// ^---------- Concrete Semigroup ----------
// ^----------------------------------------

/**
 * Any object that has a `concat`/`combine` method. Addition can be thought of
 * as a combination of two values into one.
 *
 * Module must match the Semigroup signature for some type T, and obey following laws:
 *   * Associativity
 *     * `S(a).concat(S(b).concat(S(c))) ≡ S(a).concat(S(b)).concat(S(c))`
 *
 * Native Example: Array is a semigroup
 *   * `[1].concat([2].concat([3])) === ([1].concat([2])).concat([3])`
 *
 * @example
 * 𝑆𝑒𝑚𝑖𝑔𝑟𝑜𝑢𝑝 a {
 *   concat: (𝑆 a) => 𝑆 a
 * }
 */
export const Semigroup = <T>(v: T): Semigroup_<T> => ({
  name: 'Semigroup',
  __value: v,

  concat(x: Semigroup_<T>) {
    return Semigroup(concatByType(this.__value, x.__value)) as Semigroup_<T>;
  },

  inspect() {
    return `Semigroup(${this.__value})`;
  },
});
