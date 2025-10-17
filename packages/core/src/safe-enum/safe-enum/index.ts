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

import type { IsLiteralEnum } from '../is-literal-enum';
import type { ValidEnumStructures } from '../valid-enum-structures';

/**
 * An alternative to TypeScript `enums` that is safe and compatible.
 *
 * To use make an object and add `as const` to the end of the object. It is recommended to wrap the object in
 * `Object.freeze` but it is not required. Pass the object to `SafeEnum` and export both the enum and the type, TS will
 * automatically use the enum when using it in code and the type when using it for type reference.
 *
 * @example
 *  import { SafeEnum } from '@accelint-private/core/safe-enum'
 *
 *  export const MyEnum = Object.freeze({
 *    Better: 'better',
 *    Safer: 'safer',
 *    Compatible: 'compatible',
 *  } as const);
 *
 *  export type MyEnum = SafeEnum<typeof MyEnum>;
 *
 *  const defaultValue: MyEnum = MyEnum.Better;
 *
 * @see https://dev.to/ivanzm123/dont-use-enums-in-typescript-they-are-very-dangerous-57bh
 */
export type SafeEnum<TObject extends ValidEnumStructures> =
  IsLiteralEnum<TObject> extends true
    ? TObject[keyof TObject]
    : '[SafeEnum Error] Enum is not `as const` or has mixed values, check that you created the enum properly.';
