import { A } from '@/combinators';
import type { Monad_, FamiliarAliases } from '@/category';

type Monad__<T> = Omit<Monad_<T>, 'of' | 'ap' | 'map' | 'chain' | 'join'>;
type Familiar__<T> = Omit<FamiliarAliases<T>, 'then' | 'resolve' | 'from'>;

export interface Either_<T> extends Monad__<T> {
  // ^--- START Monad OVERRIDES

  /** Lifts the given value `𝑎` into the module context. */
  of<T>(a: T): Either_<T>;

  /**
   * Applies the given function `𝑓: 𝑎 → 𝑏` to the value `𝑎` in the module.
   * Wrapping the result in a new module.
   */
  map<R>(f: (x: T) => R): Either_<R>;

  /**
   * Applies the given module that contains a function `𝑀 𝑓: 𝑎 → 𝑏` to the value `𝑎` in this module.
   * Wrapping the result in a new module.
   */
  ap<A, R>(otherMonad: Either_<A>): Either_<R>;

  /**
   * Applies the given function `𝑓: 𝑎 → 𝑀 𝑏` to the value `𝑎` in the module.
   * And flattens them so that it is not a nested module.
   */
  chain<R>(
    fn: (x: T) => R
  ): R extends Either_<infer R> ? Either_<R> : Either_<R>;

  /** Flatten the module so that a possible nested module, `𝑀 𝑀 𝑀 𝑎`, becomes a single `𝑀 𝑎`. */
  join(): T extends Either_<infer R> ? Either_<R> : Either_<T>;

  // ^--- END Monad OVERRIDES

  // ^--- START Familiar OVERRIDES

  /** @alias Either.chain */
  then<R>(
    fn: (x: T) => R
  ): R extends Either_<infer R> ? Either_<R> : Either_<R>;

  /** @alias Either.of */
  resolve<T>(a: T): Either_<T>;

  /** @alias Either.of */
  from<T>(a: T): Either_<T>;

  // ^--- END Familiar OVERRIDES

  // cache for checking isLeft without having to run condition each time
  __isLeft: boolean;
  isLeft(): boolean;
  isRight(): boolean;
  lift<T, R>(f: (x: T) => R, a: T): Either_<R>;
  orElse<R>(other: R): T | R;
  cata<R, S>(lf: (a: T) => R, rf: (a: T) => S): R | S;
}

export const Either = <T>(v: T): Either_<T> => ({
  name: 'Either',
  __value: v,
  __isChain: true,
  __isLeft: v == null || v instanceof Error,

  of<T>(a: T) {
    return Either(a);
  },

  from<T>(a: T) {
    return Either(a);
  },

  resolve<T>(a: T) {
    return Either(a);
  },

  map<R>(fn: (x: T) => R) {
    return this.__isLeft
      ? (this as unknown as Either_<R>)
      : Either(A(fn)(this.__value));
  },

  ap<A, R>(otherMonad: Either_<A>) {
    return this.map(otherMonad.__value as unknown as (x: T) => R);
  },

  join() {
    // If the value is wrapped, then keep calling join until we
    // get to the underlying value
    return (this.__value as unknown as Either_<T>)?.__isChain
      ? // TODO
        // @ts-expect-error "Property 'join' does not exist on type 'T'" using as just makes it worse
        this.__value.join()
      : this;
  },

  chain<R>(
    fn: (x: T) => R
  ): R extends Either_<infer R> ? Either_<R> : Either_<R> {
    return this.map(fn).join();
  },

  then<R>(
    fn: (x: T) => R
  ): R extends Either_<infer R> ? Either_<R> : Either_<R> {
    return this.map(fn).join();
  },

  inspect() {
    return `Either.${this.__isLeft ? 'Left' : 'Right'}(${this.__value})`;
  },

  // --- END STANDARD MONAD

  isLeft() {
    return this.__isLeft;
  },

  isRight() {
    return !this.__isLeft;
  },

  // Apply function and lift result into context
  lift(f, a) {
    return Either.of(f(a));
  },

  // filter ? -> Maybe.of(fn(this._val) ? this._val : null);
  // This would be from Filterable

  // try ? -> try(fn) { try { return Either.of(fn()); } catch(e) { return Either.of(e); } }

  cata<R, S>(lf: (a: T) => R, rf: (a: T) => S) {
    return this.__isLeft ? lf(this.__value) : rf(this.__value);
  },

  orElse(other) {
    return this.__isLeft ? other : this.__value;
  },
});

// In TS, you have to implement on the object and a "static" version
// out of the object so that both the type is statisfied and so you can
// use it without having to call the contructor first

/** Lifts the given value `𝑎` into the module context.*/
Either.of = <T>(a: T) => Either(a);

/** Apply function and lift result into context */
Either.lift = <T, R>(f: (x: T) => R, a: T) => Either.of(f(a));
