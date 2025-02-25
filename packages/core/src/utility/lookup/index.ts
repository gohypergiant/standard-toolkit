/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { Callable } from '@/types';
import { identity } from '../../combinators/i';

type Table = Record<string | number | symbol, unknown>;

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
// export const lookup =
//   <A extends Table, B extends Callable>(obj: A, def?: B) =>
//   <C extends keyof A>(prop: string | number | symbol): A[C] =>
//     (def ?? identity)(obj[prop]);

export const lookup =
  <A extends Table, B extends Callable>(obj: A, def?: B) =>
  <C extends keyof A>(prop: C) =>
    (def ?? identity)(obj[prop]) as A[C];
