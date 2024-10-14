/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export const nonStringPairs = [
  ['undefined', undefined],
  ['null', null],
  ['false', false],
  ['true', true],
  ['array', []],
  ['object', {}],
  [
    'function',
    () => {
      // noop
    },
  ],
  ['regex literal', /a/g],
  ['date object', new Date()],
  ['number', 1],
  ['number object', Object(1)],
  ['NaN', Number.NaN],
  ['negative infinity', Number.NEGATIVE_INFINITY],
  ['positive infinity', Number.POSITIVE_INFINITY],
] as const;
