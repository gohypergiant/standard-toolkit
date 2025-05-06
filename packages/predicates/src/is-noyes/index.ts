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

// NOTE: There is some conceptual overlap between these (predicates) functions, and the
// toBoolean (converters) function. The purposes of these two packages differ in intent:
// - the converter is only narrowly concerned with converting to a boolean
// - these functions will allow for a broader range of values to evaluate to boolean

const listFalse = ['', '0', 'false', 'nan', 'null', 'undefined'];
const listTrue = ['1', 'true'];

const listNo = ['n', 'no', ...listFalse];
const listOff = ['off', ...listFalse];
const listOn = ['on', ...listTrue];
const listYes = ['y', 'yes', ...listTrue];

const test = (list: string[], val: unknown) =>
  list.includes(`${val}`.trim().toLowerCase());

/**
 * Returns true if the given value is found in any of:
 * - `isFalse(val)`
 * - `isNo(val)`
 * - `isOff(val)`
 *
 * @param val - The value to check whether or not it is falsey.
 *
 * @remarks
 * pure function
 *
 * @example
 * isAnyFalsy('');        // true
 * isAnyFalsy('no');      // true
 * isAnyFalsy('off');     // true
 * isAnyFalsy(0);         // true
 * isAnyFalsy(1);         // false
 * isAnyFalsy(true);      // false
 * isAnyFalsy('on');      // false
 * isAnyFalsy('yes');     // false
 */
export const isAnyFalsy = (val: unknown) =>
  isFalse(val) || isNo(val) || isOff(val);

/**
 * Returns true if the given value is found in any of:
 * - `isTrue(val)`
 * - `isYes(val)`
 * - `isOn(val)`
 *
 * @param val - The value to check whether or not it is truthy.
 *
 * @remarks
 * pure function
 *
 * @example
 * isAnyTruthy('');        // false
 * isAnyTruthy('no');      // false
 * isAnyTruthy('off');     // false
 * isAnyTruthy(0);         // false
 * isAnyTruthy(1);         // true
 * isAnyTruthy(true);      // true
 * isAnyTruthy('on');      // true
 * isAnyTruthy('yes');     // true
 */
export const isAnyTruthy = (val: unknown) =>
  isTrue(val) || isYes(val) || isOn(val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "false" values.
 *
 * False values: ['', '0', 'false', 'nan', 'null', 'undefined']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is false.
 *
 * @remarks
 * pure function
 *
 * @example
 * isFalse('');        // true
 * isFalse(0);         // true
 * isFalse(1);         // false
 * isFalse(true);      // false
 */
export const isFalse = (val: unknown) => test(listFalse, val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "no" values.
 *
 * False values: ['', '0', 'false', 'nan', 'null', 'undefined']
 * Additional values: ['n', 'no']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is no.
 *
 * @remarks
 * pure function
 *
 * @example
 * isNo('n');       // true
 * isNo('');        // true
 * isNo(0);         // true
 * isNo(1);         // false
 * isNo(true);      // false
 * isNo('yes');     // false
 */
export const isNo = (val: unknown) => test(listNo, val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "off" values.
 *
 * False values: ['', '0', 'false', 'nan', 'null', 'undefined']
 * Additional values: ['off']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is off.
 *
 * @remarks
 * pure function
 *
 * @example
 * isOff('off');     // true
 * isOff('');        // true
 * isOff(0);         // true
 * isOff(1);         // false
 * isOff(true);      // false
 * isOff('on');      // false
 */
export const isOff = (val: unknown) => test(listOff, val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "on" values.
 *
 * True values: ['1', 'true']
 * Additional values: ['on']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is on.
 *
 * @remarks
 * pure function
 *
 * @example
 * isOn('off');     // false
 * isOn('');        // false
 * isOn(0);         // false
 * isOn(1);         // true
 * isOn(true);      // true
 * isOn('on');      // true
 */
export const isOn = (val: unknown) => test(listOn, val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "true" values.
 *
 * True values: ['1', 'true']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is true.
 *
 * @remarks
 * pure function
 *
 * @example
 * isOn('no');      // false
 * isOn('');        // false
 * isOn(0);         // false
 * isOn(1);         // true
 * isOn(true);      // true
 * isOn('yes');     // true
 */
export const isTrue = (val: unknown) => test(listTrue, val);

/**
 * Returns true if the given value is found in a case-insensitive list of
 * "yes" values.
 *
 * True values: ['1', 'true']
 * Additional values: ['y', 'yes']
 *
 * For a more liberal comparison/coercion to true or false see the converters
 * package (\@accelint/converters).
 *
 * @param val - The value to check whether or not it is yes.
 *
 * @remarks
 * pure function
 *
 * @example
 * isTrue('');        // false
 * isTrue(0);         // false
 * isTrue(1);         // true
 * isTrue(true);      // true
 */
export const isYes = (val: unknown) => test(listYes, val);
