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

/**
 * Sets the `val` of `prop` in `obj`. Returning a new, shallow copy of the object.
 *
 * @param obj The object to set the value on.
 * @param prop The property to set the value to.
 * @param val The new value.
 *
 * @example
 * associate(personStore)('address')({
 *   city: 'Austin',
 *   street: '987 Sample St',
 * });
 * // {
 * //   // ...,
 * //   city: 'Austin',
 * //   street: '987 Sample St',
 * // }
 */
export const associate =
  <T extends object>(obj: T) =>
  <K extends keyof T = keyof T>(prop: K) =>
  (val: T[K]): T => ({ ...obj, [prop]: val });

/**
 * {@inheritDoc associate}
 */
export const assoc = associate;

/**
 * Sets the `val` of `prop` in `obj`. Returning a new, deep copy of the object.
 *
 * @param obj The object to set the value on.
 * @param prop The property to set the value to.
 * @param val The new value.
 *
 * @remarks
 * pure function
 *
 * @example
 * associateDeep(personStore)('address')({
 *   city: 'Austin',
 *   street: '987 Sample St',
 * });
 * // {
 * //   // ...,
 * //   city: 'Austin',
 * //   street: '987 Sample St',
 * // }
 */
export const associateDeep =
  <T extends object>(obj: T) =>
  <K extends keyof T>(prop: K) =>
  (val: T[K]): T => {
    const x = structuredClone(obj);

    x[prop] = val;

    return x;
  };

/**
 * {@inheritDoc associateDeep}
 */
export const assocDeep = associateDeep;
