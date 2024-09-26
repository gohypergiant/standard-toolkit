import type { Semigroup_ } from '../1_semigroup';
import { concatByType } from '../../utils/concat-by-type';
import { emptyByType } from '../../utils/empty-by-type';
import { IDENTITY_ELEMENTS } from '../../utils/identity-elements';

// ^ ***********************************************************************
// ^ MONOID
// ^ ***********************************************************************

// ? https://github.com/hemanth/functional-programming-jargon#monoid
// ?
// ? An object with a function that "combines" that object with another of the
// ? same type (semigroup) which has an "identity" (or "neutral") value. Monoids are semigroups with
// ? identity.
// ?
// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#monoid
// ? https://github.com/fantasyland/fantasy-land#monoid
// ?
// ? Module must match the Monoid signature for some type T, support Semigroup algebra
// ? for the same T, and obey following laws:
// ?
// ?     Right identity: M.empty().concat(M(a)) ≡ M(a)
// ?     Left identity: M(a).concat(M.empty()) ≡ M(a)
// ?
// ? https://mathworld.wolfram.com/Monoid.html
// ?
// ? A monoid is a set that is closed under an associative binary operation and has
// ? an identity element 𝐼 in 𝑆 such that for all 𝑎 in 𝑆, 𝐼 𝑎 = 𝑎 𝐼 = 𝑎. Note that
// ? unlike a group, its elements need not have inverses. It can also be thought of
// ? as a semigroup with an identity element. A monoid must contain at least one element.
// ?

// ^---------------------------------
// ^---------- Monoid Type ----------
// ^---------------------------------

/**
 * @example
 * 𝑀𝑜𝑛𝑜𝑖𝑑 a {
 *   concat: (𝑀 a) => 𝑀 a
 *   empty: () => 𝑀 Ø
 * }
 */
export interface Monoid_<T> extends Semigroup_<T> {
  /** The identity element (value) of the type `𝑀 a` */
  empty(): Monoid_<T>;
  concat(x: Monoid_<T>): Monoid_<T>;
}

// ^-------------------------------------
// ^---------- Concrete Monoid ----------
// ^-------------------------------------

/**
 * An object with a function that "combines" that object with
 * another of the same type (semigroup) which has an identity
 * element (value). When any value is combined (concat) with
 * the identity element (value) the result must be the original
 * value. Monoids are semigroups with identity.
 *
 * Module must match the Monoid signature for some type T, support
 * Semigroup algebra or the same T, and obey following laws:
 *   * Right identity
 *     * `M.empty().concat(M(a)) ≡ M(a)`
 *   * Left identity
 *     * `M(a).concat(M.empty()) ≡ M(a)`
 *
 * @example
 * 𝑀𝑜𝑛𝑜𝑖𝑑 a {
 *   concat: (𝑀 a) => 𝑀 a
 *   empty: () => 𝑀 Ø
 * }
 */
export const Monoid = <T>(v: T): Monoid_<T> => ({
  name: 'Monoid',
  __value: v,

  // @ts-expect-error It doesnt like trying to figure this out even though it should disallow different types of Monoids
  concat(x: Monoid_<T>) {
    return Monoid(concatByType(this.__value, x.__value));
  },

  empty() {
    return Monoid(emptyByType(this.__value)) as unknown as Monoid_<T>;
  },

  inspect() {
    return `Monoid(${this.__value})`;
  },
});

export const IDENTITY_MONOIDS = {
  Null: Monoid(IDENTITY_ELEMENTS.Null),
  Undefined: Monoid(IDENTITY_ELEMENTS.Undefined),
  String: Monoid(IDENTITY_ELEMENTS.String),
  Additive: Monoid(IDENTITY_ELEMENTS.Additive),
  Multiplicative: Monoid(IDENTITY_ELEMENTS.Multiplicative),
  Boolean: Monoid(IDENTITY_ELEMENTS.Boolean),
  Array: Monoid(IDENTITY_ELEMENTS.Array),
  Object: Monoid(IDENTITY_ELEMENTS.Object),
  Function: Monoid(IDENTITY_ELEMENTS.Function),
};
