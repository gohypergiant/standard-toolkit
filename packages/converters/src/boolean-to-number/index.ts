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

/**
 * Convert a boolean to an integer
 *
 * @param val - The boolean value to convert to a number.
 *
 * @remarks
 * pure function
 *
 * @playground
 * import { booleanToNumber } from '@accelint/converters';
 *
 * console.log(booleanToNumber(true));
 * // 1
 *
 * console.log(booleanToNumber(false));
 * // 0
 */
export function booleanToNumber(val: boolean) {
  return (val as unknown as number) | 0;
}
