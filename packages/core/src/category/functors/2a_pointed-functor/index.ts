import { A } from '@belsrc/fjp-combinators';
import type { Functor_ } from '../1_functor';

// ^ ***********************************************************************
// ^ POINTED FUNCTOR
// ^ ***********************************************************************

// ? https://github.com/hemanth/functional-programming-jargon#pointed-functor
// ?
// ? Any module that has an `of` function. The `of` function takes a value and
// ? returns a functor with that value in it
// ?
// !!! NOTE !!! Fantasyland calls this `Applicative`
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#applicative
// ? https://github.com/fantasyland/fantasy-land#applicative
// ?
// ? Module must match the PointedFunctor signature for some type T,
// ? support Functor algebra for the same T, and obey the following laws:
// ?
// ?      Identity: F.of(a).map(x => x) ≡ F.of(a)
// ?      Composition: F.of(a).map(x => f(g(x))) ≡ F.of(a).map(g).map(f)
// ?

// ^------------------------------------------
// ^---------- Pointed Functor Type ----------
// ^------------------------------------------

/**
 * @example
 * 𝑃𝑜𝑖𝑛𝑡𝑒𝑑 a {
 *   of: (a) => 𝑃 a
 *   map: (a => b) => 𝑃 b
 * }
 */
export interface PointedFunctor_<T> extends Functor_<T> {
  /** Lifts the given value `𝑎` into the module context. */
  of<T>(a: T): PointedFunctor_<T>;
  map<R>(f: (x: T) => R): PointedFunctor_<R>;
}

// ^----------------------------------------------
// ^---------- Concrete Pointed Functor ----------
// ^----------------------------------------------

/**
 * Any module that has an `of` function. The `of` function takes a
 * value and returns a functor with that value in it.
 *
 * Module must match the PointedFunctor signature for some type T,
 * support Functor algebra for the same T, and obey the following laws:
 *   * Identity
 *     * `P.of(a).map(x => x) ≡ P.of(a)`
 *   * Composition
 *     * `P.of(a).map(x => f(g(x))) ≡ P.of(a).map(g).map(f)`
 *
 * Native Example: Array is a pointed functor
 *   * `arr.of(1) == [1]`
 *
 * @note Called `pure` in some languages
 *
 * @example
 * 𝑃𝑜𝑖𝑛𝑡𝑒𝑑 a {
 *   of: (a) => 𝑃 a
 *   map: (a => b) => 𝑃 b
 * }
 */
export const PointedFunctor = <T>(v: T): PointedFunctor_<T> => ({
  name: 'PointedFunctor',
  __value: v,

  map<R>(fn: (x: T) => R) {
    return PointedFunctor(A(fn)(this.__value));
  },

  of<T>(a: T) {
    return PointedFunctor(a);
  },

  inspect() {
    return `Pointed Functor(${this.__value})`;
  },
});

// In TS, you have to implement on the object and a "static" version
// out of the object so that both the type is statisfied and so you can
// use it without having to call the contructor first

/** Lifts the given value `𝑎` into the module context. */
PointedFunctor.of = <T>(a: T) => {
  return PointedFunctor(a);
};
