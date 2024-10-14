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

const trueRegex = /^(?:y|yes|true|1|on)$/i;
const falseRegex = /^(?:n|no|false|0|off)$/i;

/**
 * Ensures value is cast as string and trimmed
 */
function normalize(val: unknown) {
  return `${val}`.trim();
}

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
export function isTrue(val: unknown) {
  const normalized = normalize(val);
  return trueRegex.test(normalized);
}

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
export function isYes(val: unknown) {
  return isTrue(val);
}

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
 * // true
 */
export function isFalse(val: unknown) {
  const normalized = normalize(val);
  return falseRegex.test(normalized);
}

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
export function isNo(val: unknown) {
  return isFalse(val);
}
