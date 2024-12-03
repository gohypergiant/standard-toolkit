import type { Callable } from '@/types';
import { identity } from '../../combinators/i';

type Cache = Record<string | number | symbol, unknown>;

/**
 * Takes an object and an optional fallback function and returns a function that
 * takes a string and returns the lookup value or the result default fallback.
 *
 * @example
 * const colorTable = {
 *  FOO: [0, 0, 255, 155],
 *  BAR: [255, 0, 255, 155],
 *  FIZZ: [230, 0, 0, 155],
 *  BUZZ: [0, 128, 0, 155],
 * };
 *
 * const colorLookup = tableLookup(colorTable, x => x ?? [128, 128, 128, 155]);
 * colorLookup(data.value);
 */
export const lookup =
  <A extends Cache, B extends Callable>(obj: A, def?: B) =>
  <C extends keyof A>(prop: string | number | symbol): A[C] =>
    (def ?? identity)(obj[prop]);
