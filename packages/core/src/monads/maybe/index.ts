import { A } from '@/combinators';
import type { Monad_, FamiliarAliases } from '@/category';

type Monad__<T> = Omit<Monad_<T>, 'of' | 'ap' | 'map' | 'chain' | 'join'>;
type Familiar__<T> = Omit<FamiliarAliases<T>, 'then' | 'resolve' | 'from'>;

export interface Maybe_<T> extends Monad__<T>, Familiar__<T> {
  // ^--- START Monad OVERRIDES

  /** Lifts the given value `𝑎` into the module context. */
  of<T>(a: T): Maybe_<T>;

  /**
   * Applies the given function `𝑓: 𝑎 → 𝑏` to the value `𝑎` in the module.
   * Wrapping the result in a new module.
   */
  map<R>(f: (x: T) => R): Maybe_<R>;

  /**
   * Applies the given module that contains a function `𝑀 𝑓: 𝑎 → 𝑏` to the value `𝑎` in this module.
   * Wrapping the result in a new module.
   */
  ap<A, R>(otherMonad: Maybe_<A>): Maybe_<R>;

  /**
   * Applies the given function `𝑓: 𝑎 → 𝑀 𝑏` to the value `𝑎` in the module.
   * And flattens them so that it is not a nested module.
   */
  chain<R>(fn: (x: T) => R): R extends Maybe_<infer R> ? Maybe_<R> : Maybe_<R>;

  /** Flatten the module so that a possible nested module, `𝑀 𝑀 𝑀 𝑎`, becomes a single `𝑀 𝑎`. */
  join(): T extends Maybe_<infer R> ? Maybe_<R> : Maybe_<T>;

  // ^--- END Monad OVERRIDES

  // ^--- START Familiar OVERRIDES

  /** @alias Maybe.chain */
  then<R>(fn: (x: T) => R): R extends Maybe_<infer R> ? Maybe_<R> : Maybe_<R>;

  /** @alias Maybe.of */
  resolve<T>(a: T): Maybe_<T>;

  /** @alias Maybe.of */
  from<T>(a: T): Maybe_<T>;

  // ^--- END Familiar OVERRIDES

  // cache for checking isNothing without having to run condition each time
  __isNothing: boolean;
  isNothing(): boolean;
  isJust(): boolean;
  lift<T, R>(f: (x: T) => R, a: T): Maybe_<R>;
  orElse<R>(other: R): T | R;
}

export const Maybe = <T>(v: T): Maybe_<T> => ({
  name: 'Maybe',
  __value: v,
  __isChain: true,
  __isNothing: v == null, // (null || undefined)

  of<T>(a: T) {
    return Maybe(a);
  },

  from<T>(a: T) {
    return Maybe(a);
  },

  resolve<T>(a: T) {
    return Maybe(a);
  },

  map<R>(fn: (x: T) => R) {
    return this.__isNothing
      ? (this as unknown as Maybe_<R>)
      : Maybe(A(fn)(this.__value));
  },

  ap<A, R>(otherMonad: Maybe_<A>) {
    return this.map(otherMonad.__value as unknown as (x: T) => R);
  },

  join() {
    // If the value is wrapped, then keep calling join until we
    // get to the underlying value
    return (this.__value as unknown as Maybe_<T>)?.__isChain
      ? // TODO
        // @ts-expect-error "Property 'join' does not exist on type 'T'" using as just makes it worse
        this.__value.join()
      : this;
  },

  chain<R>(fn: (x: T) => R): R extends Maybe_<infer R> ? Maybe_<R> : Maybe_<R> {
    return this.map(fn).join();
  },

  then<R>(fn: (x: T) => R): R extends Maybe_<infer R> ? Maybe_<R> : Maybe_<R> {
    return this.map(fn).join();
  },

  inspect() {
    return this.__isNothing ? 'Maybe.Nothing()' : `Maybe.Just(${this.__value})`;
  },

  // ^--- END STANDARD MONAD

  isNothing() {
    return this.__isNothing;
  },

  isJust() {
    return !this.__isNothing;
  },

  lift(f, a) {
    return Maybe.of(f(a));
  },

  // filter ? -> Maybe.of(fn(this._val) ? this._val : null);
  // This would be from Filterable

  orElse(other) {
    return this.__isNothing ? other : this.__value;
  },
});

// In TS, you have to implement on the object and a "static" version
// out of the object so that both the type is statisfied and so you can
// use it without having to call the contructor first

/** Lifts the given value `𝑎` into the module context.*/
Maybe.of = <T>(a: T) => Maybe(a);
Maybe.from = Maybe.of;
Maybe.resolve = Maybe.of;

/** Apply function and lift result into context */
Maybe.lift = <T, R>(f: (x: T) => R, a: T) => Maybe.of(f(a));
