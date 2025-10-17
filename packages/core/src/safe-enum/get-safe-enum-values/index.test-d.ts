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

import { describe, expectTypeOf, it } from 'vitest';
import { getSafeEnumValues } from './index';
import type { SafeEnum } from '../safe-enum';

describe('getSafeEnumValues', () => {
  it('should return the values of a safe enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    type StringEnum = SafeEnum<typeof StringEnum>;

    const stringEnumValues = getSafeEnumValues(StringEnum);

    type StringEnumValues = readonly [StringEnum, ...StringEnum[]];

    expectTypeOf(stringEnumValues).toEqualTypeOf<StringEnumValues>();
  });

  it('should fail if enum is not a safe enum', () => {
    const NotConstantEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    };

    type NotConstantEnumManual = 'valueOne' | 'valueTwo';

    const notConstantEnumValues = getSafeEnumValues(NotConstantEnum);

    type NotConstantEnumValues = readonly [
      NotConstantEnumManual,
      ...NotConstantEnumManual[],
    ];

    expectTypeOf(
      notConstantEnumValues,
    ).not.toEqualTypeOf<NotConstantEnumValues>();
  });
});
