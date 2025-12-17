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
import type { SafeEnum } from '../safe-enum';
import type { ValidEnumStructures } from '../valid-enum-structures';

/**
 * Gets the values from a SafeEnum and properly types them.
 *
 * @param safeEnum The enum to extract the values from.
 */
export function getSafeEnumValues<
  TSafeEnum extends ValidEnumStructures,
  TSafeEnumValues = SafeEnum<TSafeEnum>,
  TSafeEnumReturnValues = IsLiteralEnum<TSafeEnum> extends true
    ? readonly [TSafeEnumValues, ...TSafeEnumValues[]]
    : TSafeEnumValues,
>(safeEnum: TSafeEnum) {
  return Object.freeze(Object.values(safeEnum)) as TSafeEnumReturnValues;
}
