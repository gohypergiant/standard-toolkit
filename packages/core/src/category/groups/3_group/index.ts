import { concatByType } from '../../utils/concat-by-type';
import { emptyByType } from '../../utils/empty-by-type';
import type { Monoid_ } from '../2_monoid';

// https://settheory.net/algebra/group

// ^ ***********************************************************************
// ^ GROUP
// ^ ***********************************************************************

// ? https://github.com/fantasyland/static-land/blob/master/docs/spec.md#group
// ? https://github.com/fantasyland/fantasy-land#group
// ?
// ? Module must match the Group signature for some type T, support Monoid algebra
// ? for the same T, and obey following laws:
// ?
// ?     Right inverse: G.concat(a, G.invert(a)) ≡ G.empty()
// ?                    G.invert(a).concat(a) ≡ G.empty()
// ?                    G(a).invert().concat(G(a)) ≡ G.empty()
// ?
// ?
// ?     Left inverse: G.concat(G.invert(a), a) ≡ G.empty()
// ?                   G(a).concat(G.invert(a)) ≡ G.empty()
// ?                   G(g).concat(G(g).invert()) ≡ G.empty()
// ?
// ? https://mathworld.wolfram.com/Group.html
//  ?
// ? A group 𝐺 is a finite or infinite set of elements together with a binary
// ? operation (called the group operation) that together satisfy the four
// ? fundamental properties of closure, associativity, the identity property,
// ? and the inverse property. The operation with respect to which a group is
// ? defined is often called the "group operation," and a set is said to be a
// ? group "under" this operation. Elements 𝐴, 𝐵, 𝐶, ... with binary operation
// ? between 𝐴 and 𝐵 denoted 𝐴𝐵 form a group if:
// ?
// ?     1. Closure: If 𝐴 and 𝐵 are two elements in 𝐺,
// ?                 then the product 𝐴𝐵 is also in 𝐺.
// ?
// ?     2. Associativity: The defined multiplication is associative,
// ?                       i.e., for all 𝐴, 𝐵, 𝐶 in 𝐺, (𝐴𝐵)𝐶=𝐴(𝐵𝐶).
// ?
// ?     3. Identity: There is an identity element 𝐼 (a.k.a. 1, 𝐸, or 𝑒)
// ?                  such that 𝐼 𝐴 = 𝐴 𝐼 = 𝐴 for every element 𝐴 in 𝐺.
// ?
// ?     4. Inverse: There must be an inverse (a.k.a. reciprocal) of each
// ?                 element. Therefore, for each element 𝐴 of G, the set contains
// ?                 an element B = 𝐴^(-1) such that 𝐴 𝐴^(-1) = 𝐴^(-1) 𝐴 = 𝐼.

// ^---------------------------------
// ^---------- Group Type ----------
// ^---------------------------------

// !
// https://www.youtube.com/watch?v=KufsL2VgELo
// https://en.wikipedia.org/wiki/List_of_abstract_algebra_topics
// https://en.wikipedia.org/wiki/Group_(mathematics)

// https://mathworld.wolfram.com/Group.html
// !

/**
 * @example
 * 𝐺𝑟𝑜𝑢𝑝 a {
 *   concat: (𝐺 a) => 𝐺 a
 *   empty: () => 𝐺 Ø
 *   invert: (T) => T
 * }
 */
export interface Group_<T> extends Monoid_<T> {
  empty(): Group_<T>;
  concat(x: Group_<T>): Group_<T>;
  invert(a: T): T;
}

// ^-------------------------------------
// ^---------- Group Monoid ----------
// ^-------------------------------------

/**
 * Module must match the Group signature for some type T, support Monoid algebra
 * for the same T, and obey following laws:
 *   * Right inverse
 *   * Left inverse
 *
 * @example
 * 𝐺𝑟𝑜𝑢𝑝 a {
 *   concat: (𝐺 a) => 𝐺 a
 *   empty: () => 𝐺 Ø
 *   invert: (T) => T
 * }
 */
export const Group = <T>(v: T): Group_<T> => ({
  name: 'Group',
  __value: v,

  // @ts-expect-error It doesnt like trying to figure this out even though it should disallow different types of Groups
  concat(x: Group_<T>) {
    return Group(concatByType(this.__value, x.__value));
  },

  empty() {
    return Group(emptyByType(this.__value)) as Group_<T>;
  },

  inspect() {
    return `Group(${this.__value})`;
  },

  // ************************************************************************
  // TODO: NOT THE REAL DEF
  // ************************************************************************
  invert(a: T) {
    return a;
  },
});
