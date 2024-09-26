import { A } from '@belsrc/fjp-combinators';
import type { PointedFunctor_ } from '../2a_pointed-functor';
import type { Apply_ } from '../2b_apply';

// ^ ***********************************************************************
// ^ APPLICATIVE
// ^ ***********************************************************************

// ? https://github.com/hemanth/functional-programming-jargon#applicative-functor
// ?
// ? An applicative functor is an object with an `ap` function. `ap` applies
// ? a function in the object to a value in another object of the same type.
// ?
// !!! NOTE !!! Fantasyland calls `Pointed Functor` as `Applicative` so this has `of`
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#applicative
// ? Module must support Apply and Pointed algebras for a same T and obey following laws:
// ?
// ?     Identity: A.of(a).ap(A.of(x => x)) ≡ A.of(a)
// ?     Homomorphism: A.of(a).ap(A.of(f)) ≡ A.of(f(a))
// ?     Interchange: A.of(a).ap(A.of(f)) ≡ A.of(f).ap(A.of(fn => fn(a)))
// ?     Composition: A.of(a).ap(A.of(g).ap(A.of(f).map(f => g => x => f(g(x))))) ≡ A.of(a).ap(A.of(g)).ap(A.of(f))
// ?

// ^----------------------------------------
// ^----------- Applicative Type -----------
// ^----------------------------------------

/**
 * @example
 * 𝐴𝑝𝑝𝑙𝑖𝑐𝑎𝑡𝑖𝑣𝑒 a {
 *   ap: (𝐴 a => b) => 𝐴 b
 *   map: (a => b) => 𝐹 b
 *   of: (a) => 𝐴 a
 * }
 */
export interface Applicative_<T> extends PointedFunctor_<T>, Apply_<T> {
  of<T>(a: T): Applicative_<T>;
  map<R>(f: (x: T) => R): Applicative_<R>;
  ap<A, R>(otherApply: Applicative_<A>): Applicative_<R>;
}

// ^--------------------------------------------
// ^----------- Concrete Applicative -----------
// ^--------------------------------------------

/**
 * Applicative (ap) is a function that can apply the function contents
 * of one functor to the value contents of another.
 *
 * Module must support Apply and Pointed algebras for same type T and
 * obey the following laws:
 *   * Identity
 *     * `A.of(a).ap(A.of(x => x)) ≡ A.of(a)`
 *   * Homomorphism
 *     * `A.of(a).ap(A.of(f)) ≡ A.of(f(a))`
 *   * Interchange
 *     * `A.of(a).ap(A.of(f)) ≡ A.of(f).ap(A.of(fn => fn(a)))`
 *   * Composition
 *     * `A.of(a).ap(A.of(g).ap(A.of(f).map(f => g => x => f(g(x))))) ≡ A.of(a).ap(A.of(g)).ap(A.of(f))`
 *
 * @example
 * 𝐴𝑝𝑝𝑙𝑖𝑐𝑎𝑡𝑖𝑣𝑒 a {
 *   ap: (𝐴 a => b) => 𝐴 b
 *   map: (a => b) => 𝐹 b
 *   of: (a) => 𝐴 a
 * }
 */
export const Applicative = <T>(v: T): Applicative_<T> => ({
  name: 'Applicative',
  __value: v,

  map<R>(fn: (x: T) => R) {
    return Applicative(A(fn)(this.__value));
  },

  of<T>(a: T) {
    return Applicative(a);
  },

  ap<A, R>(otherApplicative: Applicative_<A>) {
    // `otherApply` holds an Unary Function as __value
    // that is applied to this.__value
    return this.map(otherApplicative.__value as unknown as (x: T) => R);
  },

  inspect() {
    return `Applicative(${this.__value})`;
  },
});

// In TS, you have to implement on the object and a "static" version
// out of the object so that both the type is statisfied and so you can
// use it without having to call the contructor first

/** Lifts the given value 𝑎 into the module context. */
Applicative.of = <T>(a: T) => {
  return Applicative(a);
};
