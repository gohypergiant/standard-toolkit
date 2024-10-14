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

import { isTrue } from '@hypergiant/predicates';

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'on', 'true', 'yes', true_
 *
 * @pure
 *
 * @example
 * toBoolean('on');
 * // true
 *
 * toBoolean('yes');
 * // true
 *
 * toBoolean('off');
 * // false
 *
 * toBoolean('no');
 * // false
 */
export function toBoolean(val: unknown) {
  return isTrue(val);
}
