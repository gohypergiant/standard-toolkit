import { A } from '@belsrc/fjp-combinators';
import type { Apply_ } from '../2b_apply';

// ^ ***********************************************************************
// ^ CHAIN
// ^ ***********************************************************************

// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#chain
// ? https://github.com/fantasyland/fantasy-land#chain
// ?
// ? Module must match the Chain signature for some type T,
// ? support Apply algebra for the same T, and obey following laws:
// ?
// ?     Associativity: M(a).chain(f).chain(g) ≡ M(a).chain(x => M(f(x)).chain(g))
// ?

// ^----------------------------------
// ^----------- Chain Type -----------
// ^----------------------------------

/**
 * @example
 * 𝐶ℎ𝑎𝑖𝑛 a {
 *   chain: (a => 𝐶 b) => 𝐶 b
 *   ap: (𝐶 a => b) => 𝐶 b
 *   map: (a => b) => 𝐶 b
 * }
 */
export interface Chain_<T> extends Apply_<T> {
  ap<A, R>(otherApply: Chain_<A>): Chain_<R>;
  map<R>(f: (x: T) => R): Chain_<R>;

  /**
   * Applies the given function `𝑓: 𝑎 → 𝑀 𝑏` to the value `𝑎` in the module.
   * And flattens them so that it is not a nested module.
   */
  chain<R>(fn: (x: T) => R): R extends Chain_<infer R> ? Chain_<R> : Chain_<R>;

  // not strictly spec but it makes `chain` cleaner to implement
  // join(): T extends Chain<infer R> ? R : T;

  /** Flatten the module so that a possible nested module, `𝑀 𝑀 𝑀 𝑎`, becomes a single `𝑀 𝑎`. */
  join(): T extends Chain_<infer R> ? Chain_<R> : Chain_<T>;
  __isChain: boolean;
}

// * NOTE: From a strict standpoint, I guess, `chain()` would actually be
// *   chain<U>(f: (value: T) => Chain_<U>): Chain_<U>;
// * But the current implementation allows you to do both
// *   chain(x => x) & chain(x => 𝐶 x)
// * and the result for both would still be just 𝐶 x
// * So maybe not 100% correct in its current form but makes for
// * better DX overall

// ^------------------------------------
// ^---------- Concrete Chain ----------
// ^------------------------------------

/**
 * Module must match the Chain signature for some type T,
 * support Apply algebra for the same T, and obey the following laws:
 *   * Associativity
 *     * `C(a).chain(f).chain(g) ≡ C(a).chain(x => C(f(x)).chain(g))`
 *
 * @example
 * 𝐶ℎ𝑎𝑖𝑛 a {
 *   chain: (a => 𝐶 b) => 𝐶 b
 *   ap: (𝐶 a => b) => 𝐶 b
 *   map: (a => b) => 𝐶 b
 * }
 */
export const Chain = <T>(v: T): Chain_<T> => ({
  name: 'Chain',
  __value: v,
  __isChain: true,

  map<R>(fn: (x: T) => R) {
    return Chain(A(fn)(this.__value));
  },

  ap<A, R>(otherApplicative: Chain_<A>) {
    return this.map(otherApplicative.__value as unknown as (x: T) => R);
  },

  join(): T extends Chain_<infer R> ? Chain_<R> : Chain_<T> {
    // If the value is wrapped, then keep calling join until we
    // get to the underlying value
    return (this.__value as unknown as Chain_<T>)?.__isChain
      ? // TODO
        // @ts-expect-error "Property 'join' does not exist on type 'T'" using as just makes it worse
        this.__value.join()
      : this;
  },

  chain<R>(fn: (x: T) => R): R extends Chain_<infer R> ? Chain_<R> : Chain_<R> {
    return this.map(fn).join();
  },

  inspect() {
    return `Chain(${this.__value})`;
  },
});
