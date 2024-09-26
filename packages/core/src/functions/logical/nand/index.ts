import { and, andFn } from '../and';
import { not } from '../not';

/**
 * Logical `!(a && b)`
 *
 * Logical Non-conjunction
 *
 * @link https://en.wikipedia.org/wiki/Sheffer_stroke
 */
export const nand =
  <A>(a: A) =>
  <B>(b: B) =>
    not(and(a)(b));

/**
 * Logical `!(a(x) && b(x))`
 *
 * Logical (Function Result) Non-conjunction
 *
 * @link https://en.wikipedia.org/wiki/Sheffer_stroke
 */
export const nandFn =
  <T, A>(a: (x: T) => A) =>
  <B>(b: (y: T) => B) =>
  (c: T) =>
    not(andFn(a)(b)(c));
