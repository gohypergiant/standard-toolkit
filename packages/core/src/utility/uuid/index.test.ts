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

import { expect, it } from 'vitest';
import { isUUID, uuid } from './';

it('should return true for a UUID', () => {
  expect(isUUID(uuid())).toBe(true);
});

it('should return a unique uuid without a path', () => {
  expect(uuid()).not.toBe(uuid());
});

it('should return a unique uuid with different paths', () => {
  expect(uuid({ path: ['foo'] })).not.toBe(uuid({ path: ['bar'] }));
});

it('should return a unique uuid with different namespaces, but same paths', () => {
  const path = ['foo', 'bar'];

  expect(uuid({ namespace: uuid(), path })).not.toBe(
    uuid({ namespace: uuid(), path }),
  );
});

it('should return a stable uuid', () => {
  const namespace = uuid();
  const path = ['foo', 'bar'];

  expect(uuid({ path })).toBe(uuid({ path }));

  expect(uuid({ namespace, path })).toBe(uuid({ namespace, path }));

  expect(uuid({ namespace: uuid({ path: ['app'] }), path })).toBe(
    uuid({ namespace: uuid({ path: ['app'] }), path }),
  );
});

it.each([
  false,
  null,
  10,
  '',
  'Foo',
  {},
])('should return false for other values: %s', (input) => {
  expect(isUUID(input)).toBe(false);
});
