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

import type { RefAttributes } from 'react';
import type {
  Key,
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionProps,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';

/**
 * Data structure for options items supporting hierarchical collections.
 */
export type OptionsDataItem = {
  /** Unique identifier for the item. */
  id: Key;
  /** Display name for the item. */
  name: string;
  /** Nested child items for hierarchical structures. */
  children?: OptionsDataItem[];
};

/**
 * Props for the OptionsItem component.
 */
export type OptionsItemProps<T extends OptionsDataItem> = Omit<
  ListBoxItemProps<T>,
  'className'
> &
  RefAttributes<T> & {
    /** CSS class names for item elements. */
    classNames?: {
      /** Class name for the item container. */
      item?: ListBoxItemProps['className'];
      /** Class name for the item icon. */
      icon?: IconProps['className'];
    };
    /** Color variant for the item. */
    color?: 'info' | 'serious' | 'critical';
  };

/**
 * Props for the Options component.
 */
export type OptionsProps<T extends OptionsDataItem> = Omit<
  ListBoxProps<T>,
  'orientation' | 'layout'
> &
  RefAttributes<HTMLDivElement> & {
    /** Size variant for the options list. */
    size?: 'small' | 'large';
  };

/**
 * Props for the OptionsSection component.
 */
export type OptionsSectionProps<T extends OptionsDataItem> = Omit<
  ListBoxSectionProps<T>,
  'className'
> & {
  /** CSS class names for section elements. */
  classNames?: {
    /** Class name for the section container. */
    section?: ListBoxSectionProps<T>['className'];
    /** Class name for the section header. */
    header?: string;
  };
  /** Header text for the section. */
  header?: string;
};
