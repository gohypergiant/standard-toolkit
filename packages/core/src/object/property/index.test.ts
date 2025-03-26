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
import { optionalProperty, property } from './';

type Address = {
  city: string;
  street: string;
};

type Person = {
  name: string;
  address?: Address;
  projects: string[];
};

const address: Address = {
  city: 'New York',
  street: '123 Main St',
};

const person: Person = {
  name: 'Alice',
  address,
  projects: ['unit', 'tests'],
};

const personTwo: Person = {
  name: 'Tess',
  projects: ['more', 'tests'],
};

describe('property', () => {
  it('should correctly return the request value', () => {
    const actual = property(person)('name');

    expect(actual).toEqual(person.name);
  });

  it('should return value at the correct index', () => {
    const actual = property(person.projects)(1);

    expect(actual).toEqual(person.projects[1]);
  });

  it('should return same reference values for reference props', () => {
    const actual = property(person)('address');

    expect(actual).toBe(address);
  });
});

describe('optionalProperty', () => {
  it('should correctly return the request value', () => {
    const actual = optionalProperty(person)('name');

    expect(actual).toEqual(person.name);
  });

  it('should return value at the correct index', () => {
    const actual = property(person.projects)(1);

    expect(actual).toEqual(person.projects[1]);
  });

  it('should correctly return undefined when given a bad object', () => {
    const actual = optionalProperty(personTwo.address)('street');

    expect(actual).toBeUndefined();
  });

  it('should return same reference values for reference props', () => {
    const actual = optionalProperty(person)('address');

    expect(actual).toBe(address);
  });
});
