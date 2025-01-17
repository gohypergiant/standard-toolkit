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
  PopoverProps,
  PopoverRenderProps,
} from 'react-aria-components';
import type { PartialDeep } from 'type-fest';
import type { AsType } from '../../types';
import type { IconClassNames } from '../icon/types';

export type OptionsClassNames = PartialDeep<{
  options: {
    container: string;
    options: string;
  };
  list: {
    container: string;
    list: string;
    section: string;
    header: string;
    separator: string;
  };
  item: {
    container: string;
    item: string;
    icon: IconClassNames;
    label: string;
    description: string;
    shortcut: string;
  };
}>;

export type OptionsSizes = 'sm' | 'lg';

export type OptionsMapping = {
  description: Partial<Record<OptionsSizes, string>>;
  header: Partial<Record<OptionsSizes, string>>;
  label: Partial<Record<OptionsSizes, string>>;
  shortcut: Partial<Record<OptionsSizes, string>>;
};

type BaseOptionsProps = {
  classNames?: OptionsClassNames;
  mapping?: Partial<OptionsMapping>;
  size?: OptionsSizes;
};

export type OptionsProps = Omit<PopoverProps, 'className' | 'style'> &
  BaseOptionsProps;

export type OptionsListProps<T extends object> = Omit<
  ListBoxProps<T>,
  'className' | 'dragAndDropHooks' | 'orientation' | 'style'
> &
  BaseOptionsProps;

export type OptionsItemProps<T extends object> = Omit<
  ListBoxItemProps<T>,
  'className' | 'style'
> &
  BaseOptionsProps;

export type OptionsRenderProps = AsType<PopoverRenderProps> &
  Required<Pick<BaseOptionsProps, 'size'>>;
export type OptionsListRenderProps = AsType<ListBoxRenderProps> &
  Required<Pick<BaseOptionsProps, 'size'>>;
export type OptionsItemRenderProps = AsType<ListBoxItemRenderProps> &
  Required<Pick<BaseOptionsProps, 'size'>>;

export type OptionsState = Omit<OptionsRenderProps, 'trigger'>;

export type OptionsListState = Omit<
  OptionsListRenderProps,
  'layout' | 'state' | 'isDropTarget'
>;

export type OptionsItemState = Omit<
  OptionsItemRenderProps,
  'allowsDragging' | 'isDragging' | 'isDropTarget'
> & {
  hasDescription: boolean;
};
