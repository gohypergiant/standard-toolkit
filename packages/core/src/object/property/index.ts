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
 * Gets the value of `prop` in `obj`. Array index support.
 *
 * @example
 * property(personStore)('address');
 * // personStore.address
 *
 * property(userStore.profile)(0);
 * // userStore.profile.at(0)
 */
export const property =
  <T extends object>(obj: T) =>
  <K extends keyof T>(prop: K) =>
    Array.isArray(obj) && Number.isFinite(Number.parseInt(prop as string, 10))
      ? (obj.at(Number.parseInt(prop as string, 10)) as T[K])
      : obj[prop];

/**
 * {@inheritDoc property}
 */
export const prop = property;

/**
 * Gets the optional value of `prop` in `obj`. Array index support.
 *
 * @example
 * optionalProperty(personStore)('address');
 * // personStore?.address
 *
 * optionalProperty(userStore.profile)(0);
 * // userStore?.profile?.at(0)
 */
export const optionalProperty =
  <T extends object>(obj?: T) =>
  <K extends keyof T>(prop: K): T[K] | undefined =>
    Array.isArray(obj) && Number.isFinite(Number.parseInt(prop as string, 10))
      ? (obj?.at(Number.parseInt(prop as string, 10)) as T[K])
      : obj?.[prop];

/**
 * {@inheritDoc optionalProperty}
 */
export const optionalProp = optionalProperty;
