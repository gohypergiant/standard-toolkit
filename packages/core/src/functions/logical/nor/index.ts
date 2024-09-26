import { or, orFn } from '../or';
import { not } from '../not';

/**
 * Logical `!(a || b)`
 *
 * Logical Non-disjunction
 *
 * @link https://en.wikipedia.org/wiki/Logical_NOR
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
 */
export const norFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    not(orFn(a)(b)(c));
