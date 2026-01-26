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

import type { ComponentPropsWithRef, RefAttributes } from 'react';
import type {
  ButtonProps,
  TagGroupProps,
  TagListProps,
  TagProps,
} from 'react-aria-components';

type BaseChipProps = {
  color?: 'info' | 'advisory' | 'normal' | 'serious' | 'critical';
  size?: 'medium' | 'small';
};

/**
 * Props for the ChipList component.
 *
 * Extends React Aria TagGroup with chip styling and list rendering options.
 */
export type ChipListProps<T> = Omit<TagGroupProps, 'children'> &
  Pick<
    TagListProps<T>,
    'dependencies' | 'items' | 'children' | 'renderEmptyState'
  > &
  RefAttributes<HTMLDivElement> &
  BaseChipProps;

/**
 * Props for the Chip component.
 *
 * Basic chip with color and size variants, can be used standalone or in a ChipList.
 */
export type ChipProps = Omit<ComponentPropsWithRef<'div'>, 'size' | 'onClick'> &
  BaseChipProps & {
    /** Additional CSS class name for styling. */
    className?: string;
  };

/**
 * Props for the SelectableChip component.
 *
 * Extends Tag props for use in single or multiple selection chip lists.
 */
export type SelectableChipProps = TagProps &
  RefAttributes<HTMLDivElement> &
  BaseChipProps;

/**
 * Props for the DeletableChip component.
 *
 * Extends Tag props with remove button styling options.
 */
export type DeletableChipProps = Omit<TagProps, 'className'> &
  RefAttributes<HTMLDivElement> &
  BaseChipProps & {
    /** Custom class names for chip sub-elements. */
    classNames?: {
      /** Class name for the chip wrapper. */
      chip?: TagProps['className'];
      /** Class name for the remove button. */
      remove?: ButtonProps['className'];
    };
  };

/**
 * Combined context value type for all chip variants.
 */
export type ChipContextValue = ChipProps &
  SelectableChipProps &
  DeletableChipProps;
