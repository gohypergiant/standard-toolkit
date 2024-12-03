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

export type Accumulator<T, R> = (acc: R, x: T) => R;

export type ArrayElementType<T> = T extends (infer E)[] ? E : T;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Callable = (...all: any) => any;

export type Comparator<T> = (x: T) => boolean;

export type MapFn<T, R> = (x: T, idx?: number) => R;

export type Predicate<T> = (x: T, idx?: number) => boolean;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type UnaryFunction = (x: any) => any;
