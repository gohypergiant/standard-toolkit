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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Callable = (...a: any[]) => any;
type Fixture = [string, boolean, Callable, Values][];
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Values = any[];

export const truthy: Values = [
  1,
  '1',
  'on',
  'true',
  'yes',
  true,
  'ON',
  'YES',
  'TRUE',
];
export const falsey: Values = [
  '',
  0,
  '0',
  'off',
  'false',
  'no',
  false,
  [],
  {},
  'OFF',
  'NO',
  'FALSE',
];

export const createFixture = (bool: boolean, ...rest: [Values, Callable][]) =>
  rest.map(([values, fn]) => [fn.name, bool, fn, values]) as Fixture;
