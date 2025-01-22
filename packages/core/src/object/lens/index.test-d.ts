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

import { describe, expectTypeOf, test } from 'vitest';
import { lens } from '.';
import { associateDeep } from '../associate';
import { property } from '../property';
import { type Person, personStore } from './__fixtures__/lens-objects';

const nameLens = lens(
  (person: Person) => property(person)('name'),
  (person) => (name) => associateDeep(person)('name')(name),
); // -> string
const addressLens = lens(
  (person: Person) => property(person)('address'),
  (person) => (addr) => associateDeep(person)('address')(addr),
); // -> Address

describe('lens', () => {
  test('it should have the correct parameter types', () => {
    expectTypeOf(lens).toBeFunction();
    expectTypeOf(lens).toBeCallableWith(
      (x) => x,
      // eslint-disable-next-line no-unused-vars
      (x) => (_y) => x,
    );
  });

  test('it should have the correct returned types', () => {
    expectTypeOf(nameLens.get).toBeFunction();
    expectTypeOf(nameLens.set).toBeFunction();

    expectTypeOf(nameLens.get).toBeCallableWith(personStore);
    expectTypeOf(nameLens.set).toBeCallableWith(personStore);
  });

  test('it should have the correct result types', () => {
    expectTypeOf(nameLens.get(personStore)).toBeString();
    expectTypeOf(addressLens.get(personStore)).toBeNullable();
  });
});
