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
import type { IsLiteralEnum } from '.';

describe('IsLiteralEnum', () => {
  it('should pass when string enum', () => {
    const StringEnum = {
      valueOne: 'valueOne',
      valueTwo: 'valueTwo',
    } as const;

    const test: IsLiteralEnum<typeof StringEnum> = true;

    expectTypeOf(test).toMatchTypeOf(true);
  });

  it('should pass when number enum', () => {
    const NumEnum = {
      valueOne: 1,
      valueTwo: 2,
    } as const;

    const test: IsLiteralEnum<typeof NumEnum> = true;

    expectTypeOf(test).toMatchTypeOf(true);
  });

  it('should fail when mixed enum', () => {
    const MixedEnum = {
      valueOne: 1,
      valueTwo: 'two',
    } as const;

    const test: IsLiteralEnum<typeof MixedEnum> = false;

    expectTypeOf(test).toMatchTypeOf(false);
  });

  it('should fail when not a const enum', () => {
    const NonConstantEnum = {
      valueOne: 1,
      valueTwo: 2,
    };

    const test: IsLiteralEnum<typeof NonConstantEnum> = false;

    expectTypeOf(test).toMatchTypeOf(false);
  });
});
