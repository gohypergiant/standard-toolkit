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

import type {
  ListBoxItemProps,
  ListBoxItemRenderProps,
  ListBoxProps,
  ListBoxRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';

export type PickerClassNames = PartialDeep<{
  list: {
    container: string;
    list: string;
  };
  item: {
    container: string;
    item: string;
  };
}>;

type BaseProps = {
  classNames?: PickerClassNames;
};

type BasePickerProps = BaseProps & {
  /**
   * Only applicable if layout='grid'
   */
  columns?: number;
};

export type PickerState = Omit<ListBoxRenderProps, 'state' | 'isDropTarget'> &
  Required<Pick<PickerProps<unknown>, 'columns' | 'layout' | 'orientation'>>;

export type PickerProps<T> = Omit<
  ListBoxProps<T>,
  'className' | 'dragAndDropHooks' | 'style'
> &
  BasePickerProps;

export type BasePickerItemProps = BaseProps;

export type PickerItemRenderProps = Omit<
  ListBoxItemRenderProps,
  'allowsDragging' | 'isDragging' | 'isDropTarget'
>;

export type PickerItemState = PickerItemRenderProps;

export type PickerItemProps<T> = Omit<
  ListBoxItemProps<T>,
  'className' | 'style'
> &
  BasePickerItemProps;
