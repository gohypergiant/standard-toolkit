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

import { describe, expect, it } from 'vitest';
import { associate, associateDeep } from './';

type Address = {
  city: string;
  street: string;
};

type Person = {
  name: string;
  address?: Address;
};

const address: Address = {
  city: 'New York',
  street: '123 Main St',
};

const person: Person = {
  name: 'Alice',
  address,
};

const mock = structuredClone(person);

describe('associate', () => {
  it('should correctly change the top-level property', () => {
    const expected = structuredClone(mock);
    expected.name = 'Unit';

    const actual = associate(person)('name')('Unit');

    expect(actual).toStrictEqual(expected);
  });

  it('should correctly change the nested property', () => {
    const expected = structuredClone(mock);
    expected.address = { city: 'Unit', street: 'Test' };

    const actual = associate(person)('address')({
      city: 'Unit',
      street: 'Test',
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should not change the given object', () => {
    const _actual = associate(person)('name')('Unit');

    expect(mock).toStrictEqual(person);
  });

  it('should not be a deep clone', () => {
    const actual = associate(person)('name')('Unit');

    expect(address).toBe(actual.address);
  });
});

describe('associateDeep', () => {
  it('should correctly change the top-level property', () => {
    const expected = structuredClone(mock);
    expected.name = 'Unit';

    const actual = associateDeep(person)('name')('Unit');

    expect(actual).toStrictEqual(expected);
  });

  it('should correctly change the nested property', () => {
    const expected = structuredClone(mock);
    expected.address = { city: 'Unit', street: 'Test' };

    const actual = associateDeep(person)('address')({
      city: 'Unit',
      street: 'Test',
    });

    expect(actual).toStrictEqual(expected);
  });

  it('should not change the given object', () => {
    const _actual = associateDeep(person)('name')('Unit');

    expect(mock).toStrictEqual(person);
  });

  it('should be a deep clone', () => {
    const actual = associateDeep(person)('name')('Unit');

    expect(address).not.toBe(actual.address);
  });
});
