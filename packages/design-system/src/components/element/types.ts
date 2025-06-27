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

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HTMLElementType, JSX } from 'react';
import type { SlotProps } from 'react-aria-components';
import type { ProviderValues } from '../../types/react-aria';

export type ElementProps<
  A = any,
  B = any,
  C = any,
  D = any,
  E = any,
  F = any,
  G = any,
  H = any,
  I = any,
  J = any,
  K = any,
> = /**
 * Initially tried to make these props generic and constrain props to element
 * passed into generic, but ran into major performance issues with enormous
 * type unions of all possible HTML elements props. It breaks all of TS
 */
JSX.IntrinsicElements[HTMLElementType] &
  SlotProps & {
    /**
     * The HTML element to be rendered
     */
    as?: HTMLElementType;
    /**
     * Values passed to Provider, overrides parent contexts
     */
    values?: ProviderValues<A, B, C, D, E, F, G, H, I, J, K>;
    /**
     * Values passed to MergeProvider, merges with parent contexts
     */
    mergeValues?: ProviderValues<A, B, C, D, E, F, G, H, I, J, K>;
  };
