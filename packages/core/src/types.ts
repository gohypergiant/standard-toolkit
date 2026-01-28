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
 * A function that takes a single argument and returns a value.
 *
 * @template T - The type of the input argument.
 * @template R - The type of the return value.
 *
 * @example
 * ```typescript
 * import type { UnaryFunction } from '@accelint/core';
 *
 * const double: UnaryFunction = (x: number) => x * 2;
 * const stringify: UnaryFunction = (x: any) => String(x);
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: proper use of `any`
export type UnaryFunction = (x: any) => any;

/**
 * Extracts the element type from an array type, or returns the type itself if not an array.
 *
 * @template T - The type to extract the element type from.
 *
 * @example
 * ```typescript
 * import type { ArrayElementType } from '@accelint/core';
 *
 * type StringArray = string[];
 * type Element = ArrayElementType<StringArray>; // string
 *
 * type NotArray = number;
 * type Same = ArrayElementType<NotArray>; // number
 * ```
 */
export type ArrayElementType<T> = T extends (infer E)[] ? E : T;

/**
 * A function that compares a value and returns a boolean.
 *
 * @template T - The type of the value to compare.
 *
 * @example
 * ```typescript
 * import type { Comparator } from '@accelint/core';
 *
 * const isPositive: Comparator<number> = (x) => x > 0;
 * const isLongString: Comparator<string> = (x) => x.length > 10;
 * ```
 */
export type Comparator<T> = (x: T) => boolean;

/**
 * A function that tests a value and optionally its index, returning a boolean.
 *
 * @template T - The type of the value to test.
 *
 * @example
 * ```typescript
 * import type { Predicate } from '@accelint/core';
 *
 * const isEven: Predicate<number> = (x) => x % 2 === 0;
 * const isEvenIndex: Predicate<number> = (x, idx) => idx !== undefined && idx % 2 === 0;
 * ```
 */
export type Predicate<T> = (x: T, idx?: number) => boolean;

/**
 * A function that accumulates values, taking an accumulator and a value and returning a new accumulator.
 *
 * @template T - The type of the values to accumulate.
 * @template R - The type of the accumulator.
 *
 * @example
 * ```typescript
 * import type { Accumulator } from '@accelint/core';
 *
 * const sum: Accumulator<number, number> = (acc, x) => acc + x;
 * const concat: Accumulator<string, string> = (acc, x) => acc + x;
 * ```
 */
export type Accumulator<T, R> = (acc: R, x: T) => R;

/**
 * A function that maps a value and optionally its index to a new value.
 *
 * @template T - The type of the input value.
 * @template R - The type of the output value.
 *
 * @example
 * ```typescript
 * import type { MapFn } from '@accelint/core';
 *
 * const double: MapFn<number, number> = (x) => x * 2;
 * const withIndex: MapFn<string, string> = (x, idx) => `${idx}: ${x}`;
 * ```
 */
export type MapFn<T, R> = (x: T, idx?: number) => R;
