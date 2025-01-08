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

import type { Orientation } from '@react-types/shared';
import type { Context, ReactElement } from 'react';
import type { ContextValue, SlotProps } from 'react-aria-components';

export type GroupClassNames = Partial<{
  container: string;
  group: string;
}>;

export type BaseGroupProps<T, E extends Element> = {
  children?: (ReactElement | boolean | null)[];
  classNames?: GroupClassNames;
  context?: Context<ContextValue<T, E>>;
  orientation?: Orientation;
  reverse?: boolean;
  values?: ContextValue<T, E>;
};

export type GroupState = {
  /**
   * The number of children rendered
   */
  count: number;
  orientation: Orientation;
  /**
   * Whether to flip the order of the children, visually
   */
  reverse: boolean;
  /**
   * This is based off of the children types
   *
   * Possible values: Empty, Mixed, `{component type}`
   *
   * @example If all children are <Button />, then "type" will be `Button`
   */
  type: string;
};

export type GroupProps<T, E extends Element> = BaseGroupProps<T, E> & SlotProps;
