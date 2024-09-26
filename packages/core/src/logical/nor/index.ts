import { or, orFn } from "../or";
import { not } from "../not";

/**
 * Logical `!(a || b)`
 *
 * Logical Non-disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_NOR
 *
 * @example
 * nor(true)(0);
 * // false
 */
export const nor =
  <A>(a: A) =>
  <B>(b: B) =>
    not(or(a)(b));

/**
 * Logical `!(a(x) || b(x))`
 *
 * Logical (Function Result) Non-disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_NOR
 *
 * @example
 * norFn(s => s.trim())(s => s.trimEnd())('foo bar ');
 * // false
 */
export const norFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    not(orFn(a)(b)(c));
