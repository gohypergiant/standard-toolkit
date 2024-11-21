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

// const trueRegex = /^(?:y|yes|true|1|on)$/i;
// const falseRegex = /^(?:n|no|false|0|off)$/i;

// const test = (r: RegExp, val: unknown) => r.test(`${val}`.trim());

const falseValues = ['0', 'false', 'n', 'no', 'off'];
const trueValues = ['1', 'true', 'y', 'yes', 'on'];

const test = (list: string[], val: unknown) =>
  list.includes(`${val}`.trim().toLowerCase());

/**
 * Compare the given value against a custom list of `falsey` values.
 *
 * String values are not case sensitive.
 *
 * _0, '0', 'n', 'no', 'off', 'false', false_
 *
 * @pure
 *
 * @example
 * isFalse('on');
 * // false
 *
 * isFalse('yes');
 * // false
 *
 * isFalse('off');
 * // true
 *
 * isFalse('no');
 */
export const isFalse = (val: unknown) => test(falseValues, val);

/**
 * Compare the given value against a custom list of `falsey` values.
 *
 * String values are not case sensitive.
 *
 * _0, '0', 'n', 'no', 'off', 'false', false_
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
 * // true
 *
 * isNo('no');
 */
export const isNo = isFalse;

/**
 * Compare the given value against a custom list of `falsey` values.
 *
 * String values are not case sensitive.
 *
 * _0, '0', 'n', 'no', 'off', 'false', false_
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
 */
export const isOff = isFalse;

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'y', 'yes', 'on', 'true', true_
 *
 * @pure
 *
 * @example
 * isTrue('on');
 * // true
 *
 * isTrue('yes');
 * // true
 *
 * isTrue('off');
 * // false
 *
 * isTrue('no');
 * // false
 */
export const isTrue = (val: unknown) => test(trueValues, val);

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'y', 'yes', 'on', 'true', true_
 *
 * @pure
 *
 * @example
 * isOn('on');
 * // true
 *
 * isOn('yes');
 * // true
 *
 * isOn('off');
 * // false
 *
 * isOn('no');
 * // false
 */
export const isOn = isTrue;

/**
 * Compare the given value against a custom list of `truthy` values.
 *
 * String values are not case sensitive.
 *
 * _1, '1', 'y', 'yes', 'on', 'true', true_
 *
 * @pure
 *
 * @example
 * isYes('on');
 * // true
 *
 * isYes('yes');
 * // true
 *
 * isYes('off');
 * // false
 *
 * isYes('no');
 * // false
 */
export const isYes = isTrue;
