import { A } from '@belsrc/fjp-combinators';
import type { Chain_ } from '../3b_chain';
import type { Applicative_ } from '../3a_applicative';

// ^ ***********************************************************************
// ^ MONAD
// ^ ***********************************************************************

// ? https://github.com/hemanth/functional-programming-jargon#monad
// ?
// ? A monad is an object with `of` and `chain` functions. `chain` is like `map`
// ? except it un-nests the resulting nested object. `of` is also known as `return`
// ? in other functional languages. `chain` is also known as `flatmap` and `bind`
// ? in other languages.
// ?
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monad
// ? https://github.com/fantasyland/fantasy-land#monad
// ?
// ? Module must support Applicative and Chain algebras for a same T,
// ? and obey following laws:
// ?
// ?     Left Identity: M.of(a).chain(f) ≡ M.of(f(a))
// ?     Right Identity: M.of(a).chain(M.of) ≡ M.of(a)
// ?

// ^----------------------------------
// ^----------- Monad Type -----------
// ^----------------------------------

// TS doesn't appear to like extending/overwriting multiple
// interfaces that have the same method name and with diff signatures,
// remove the ones that are causing an issue
type Chain__<T> = Omit<Chain_<T>, 'ap' | 'map' | 'chain' | 'join'>;

/**
 * @example
 * 𝑀𝑜𝑛𝑎𝑑 a {
 *   ap: (𝑀 a => b) => 𝑀 b
 *   of: (a) => 𝑀 a
 *   map: (a => b) => 𝑀 b
 *   chain: (a => 𝑀 b) => 𝑀 b
 * }
 */
export interface Monad_<T> extends Chain__<T>, Applicative_<T> {
  of<T>(a: T): Monad_<T>;
  map<R>(f: (x: T) => R): Monad_<R>;
  ap<A, R>(otherMonad: Monad_<A>): Monad_<R>;
  /**
   * Applies the given function `𝑓: 𝑎 → 𝑀 𝑏` to the value `𝑎` in the module.
   * And flattens them so that it is not a nested module.
   */
  chain<R>(fn: (x: T) => R): R extends Monad_<infer R> ? Monad_<R> : Monad_<R>;
  /** Flatten the module so that a possible nested module, `𝑀 𝑀 𝑀 𝑎`, becomes a single `𝑀 𝑎`. */
  join(): T extends Monad_<infer R> ? Monad_<R> : Monad_<T>;
}

// ^------------------------------------
// ^---------- Concrete Monad ----------
// ^------------------------------------

/**
 * Module must support Applicative and Chain algebras
 * for same T, and obey the following laws:
 *   * Left Identity
 *     * `M.of(a).chain(f) ≡ M.of(f(a))`
 *   * Right Identity
 *     * `M.of(a).chain(M.of) ≡ M.of(a))`
 *
 * @example
 * 𝑀𝑜𝑛𝑎𝑑 a {
 *   ap: (𝑀 a => b) => 𝑀 b
 *   of: (a) => 𝑀 a
 *   map: (a => b) => 𝑀 b
 *   chain: (a => 𝑀 b) => 𝑀 b
 * }
 */
export const Monad = <T>(v: T): Monad_<T> => ({
  name: 'Monad',
  __value: v,
  __isChain: true,

  of<T>(a: T) {
    return Monad(a);
  },

  map<R>(fn: (x: T) => R) {
    return Monad(A(fn)(this.__value));
  },

  ap<A, R>(otherMonad: Monad_<A>) {
    return this.map(otherMonad.__value as unknown as (x: T) => R);
  },

  join() {
    // If the value is wrapped, then keep calling join until we
    // get to the underlying value
    return (this.__value as unknown as Monad_<T>)?.__isChain
      ? // TODO
        // @ts-expect-error "Property 'join' does not exist on type 'T'" using as just makes it worse
        this.__value.join()
      : this;
  },

  chain<R>(fn: (x: T) => R): R extends Monad_<infer R> ? Monad_<R> : Monad_<R> {
    return this.map(fn).join();
  },

  inspect() {
    return `Monad(${this.__value})`;
  },
});

// In TS, you have to implement on the object and a "static" version
// out of the object so that both the type is statisfied and so you can
// use it without having to call the contructor first

/** Lifts the given value `𝑎` into the module context. */
Monad.of = <T>(a: T) => {
  return Monad(a);
};
