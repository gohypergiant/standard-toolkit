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

import { assertType, describe, expectTypeOf, it } from 'vitest';
import type { SafeEnum } from './index';

describe('SafeEnum', () => {
  it('should return the values of a string enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    type StringEnum = SafeEnum<typeof StringEnum>;

    expectTypeOf('valueOne' as StringEnum).toEqualTypeOf<
      'valueOne' | 'valueTwo'
    >();
  });

  it('should return the values of a number enum', () => {
    const NumberEnum = {
      valueOne: 1,
      valueTwo: 2,
    } as const;

    type NumberEnum = SafeEnum<typeof NumberEnum>;

    expectTypeOf(1 as NumberEnum).toEqualTypeOf<1 | 2>();
  });

  it('should return the values of a frozen string enum', () => {
    const FrozenStringEnum = Object.freeze({
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const);

    type FrozenStringEnum = SafeEnum<typeof FrozenStringEnum>;

    expectTypeOf('valueOne' as FrozenStringEnum).toEqualTypeOf<
      'valueOne' | 'valueTwo'
    >();
  });

  it('should return error when not a valid enum', () => {
    const NotConstantEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    };

    type NotConstantEnum = SafeEnum<typeof NotConstantEnum>;

    // @ts-expect-error NotConstantEnum should output the error string.
    assertType<NotConstantEnum>(NotConstantEnum.valueOne);
  });

  it('should return an error when the enum has mixed values', () => {
    const MixedValues = {
      valueOne: 1,
      valueTwo: 'valueTwo',
    } as const;

    // @ts-expect-error MixedValue will fail the mixed primitive test
    assertType<SafeEnum<typeof MixedValues>>(MixedValues.valueOne);
  });
});
