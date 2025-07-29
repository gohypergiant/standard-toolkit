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

import type { createVar } from '@vanilla-extract/css';

/**
 * Re-export due to not being exported by library
 */

export type CssVarFunction = ReturnType<typeof createVar>;

export type Contract = {
  [key: string]: CssVarFunction | null | Contract;
};

export type Primitive = string | boolean | number | null | undefined;

export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, unknown>
      ? MapLeafNodes<Obj[Prop], LeafType>
      : never;
};

export type PartialMapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]?: Obj[Prop] extends Primitive
    ? LeafType
    : Obj[Prop] extends Record<string | number, unknown>
      ? PartialMapLeafNodes<Obj[Prop], LeafType>
      : never;
};
