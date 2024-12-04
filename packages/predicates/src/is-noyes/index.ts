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

import { toBoolean } from '@accelint/converters';

const test = (list: string[], val: unknown) =>
  list.includes(`${val}`.trim().toLowerCase());

/**
 * Check the given value against "false-values" and returns true if found to be
 * false. String values are not case sensitive.
 *
 * @see toBoolean
 *
 * @pure
 *
 * @example
 * isFalse('  falSE');
 * // false
 *
 * isFalse('yes');
 * // false
 *
 * isFalse('off');
 * // true
 *
 * isFalse('no');
 * // false
 */
export const isFalse = (val: unknown) => toBoolean(val) === false;

/**
 * Compare the given value against a custom list of 'No' values. String values
 * are not case sensitive.
 *
 * @pure
 *
 * @example
 * isNo('on');
 * // false
 *
 * isNo('yes');
 * // false
 *
 * isNo('off');
 * // false
 *
 * isNo('no');
 * // true
 *
 * isNo('N');
 * // true
 */
export const isNo = (val: unknown) => !val || test(['n', 'no'], val);

/**
 * Compare the given value against a custom list of 'Off' values. String values
 * are not case sensitive.
 *
 * @pure
 *
 * @example
 * isOff('on');
 * // false
 *
 * isOff('yes');
 * // false
 *
 * isOff('off');
 * // true
 *
 * isOff('no');
 * // false
 */
export const isOff = (val: unknown) => !val || test(['off'], val);

/**
 * Check the given value against "false-values" and returns true if found to
 * be ***NOT*** false. String values are not case sensitive.
 *
 * @see toBoolean
 *
 * @pure
 *
 * @example
 * isTrue(' TrUe');
 * // true
 *
 * isTrue('yes');
 * // true
 *
 * isTrue('any string');
 * // true
 *
 * isTrue({});
 * // true
 *
 * isTrue(false);
 * // false
 *
 * isTrue('');
 * // false
 */
export const isTrue = (val: unknown) => !isFalse(val);

/**
 * Compare the given value against a custom list of 'On' values. String values
 * are not case sensitive.
 *
 * @pure
 *
 * @example
 * isOn('on');
 * // true
 *
 * isOn('yes');
 * // false
 *
 * isOn('off');
 * // false
 *
 * isOn('no');
 * // false
 */
export const isOn = (val: unknown) => val === true || test(['on'], val);

/**
 * Compare the given value against a custom list of 'Yes' values. String values
 * are not case sensitive.
 *
 * @pure
 *
 * @example
 * isYes('on');
 * // false
 *
 * isYes('yes');
 * // true
 *
 * isYes('Y');
 * // true
 *
 * isYes('off');
 * // false
 *
 * isYes('no');
 * // false
 */
export const isYes = (val: unknown) => val === true || test(['y', 'yes'], val);
