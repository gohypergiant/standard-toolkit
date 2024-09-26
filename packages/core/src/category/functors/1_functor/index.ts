import { A } from '@belsrc/fjp-combinators';
import type { MathObj_ } from '../../math-obj';

// ^ ***********************************************************************
// ^ FUNCTOR
// ^ ***********************************************************************

// ? A functor is a map between categories.
// ?
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#functor
// ? https://github.com/fantasyland/fantasy-land#functor
// ?
// ? Module must match the Functor signature for some type T,
// ? and obey the following laws:
// ?
// ? Identity: If `F` is a functor, then calling `F.map(x => x)` must be
// ?     equivalent to `F`.
// ?
// ? Composition: If `F` is a functor, and f and g are functions, then calling
// ?    `F.map(x => f(g(x)))` is equivalent to calling `F.map(g).map(f)`.
// ?
// ?     Identity: F(a).map(x => x) ≡ F(a)
// ?     Composition: F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)
// ?

// ^----------------------------------
// ^---------- Functor Type ----------
// ^----------------------------------

/**
 * @example
 * 𝐹𝑢𝑛𝑐𝑡𝑜𝑟 a {
 *   map: (a => b) => 𝐹 b
 * }
 */
export interface Functor_<T> extends MathObj_<T> {
  /**
   * Applies the given function `𝑓: 𝑎 → 𝑏` to the value `𝑎` in the module.
   * Wrapping the result in a new module.
   */
  map<R>(f: (x: T) => R): Functor_<R>;
}

// ^--------------------------------------
// ^---------- Concrete Functor ----------
// ^--------------------------------------

/**
 * A functor is a map between categories.
 *
 * Module must match the Functor signature for some type T,
 * and obey the following laws:
 *   * Identity
 *     * `F(a).map(x => x) ≡ F(a)`
 *   * Composition
 *     * `F(a).map(x => f(g(x))) ≡ F(a).map(g).map(f)`
 *
 * Native Example: Array is a functor
 *   * `arr.map(x => x) == arr`
 *   * `arr.map(x => f(g(x))) == arr.map(g).map(f)`
 *
 * @example
 * 𝐹𝑢𝑛𝑐𝑡𝑜𝑟 a {
 *   map: (a => b) => 𝐹 b
 * }
 */
export const Functor = <T>(v: T): Functor_<T> => ({
  name: 'Functor',
  __value: v,

  map<R>(fn: (x: T) => R) {
    return Functor(A(fn)(this.__value));
  },

  inspect() {
    return `Functor(${this.__value})`;
  },
});
