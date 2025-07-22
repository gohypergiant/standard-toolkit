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

import type { HTMLProps, PropsWithChildren, RefAttributes } from 'react';
import type {
  ButtonProps,
  TagGroupProps,
  TagListProps,
  TagProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { ChipStyles } from './styles';

export type BaseChipProps = {
  size?: 'medium' | 'small';
};

export type ChipProps = VariantProps<typeof ChipStyles> &
  Omit<HTMLProps<HTMLDivElement>, 'size'> &
  RefAttributes<HTMLDivElement> &
  BaseChipProps & {
    className?: string;
  };

export type ChipListProps<T> = Omit<TagGroupProps, 'children'> &
  Pick<
    TagListProps<T>,
    'dependencies' | 'items' | 'children' | 'renderEmptyState'
  > &
  RefAttributes<HTMLDivElement> &
  BaseChipProps;

export type SelectableChipProps = Omit<TagProps, 'isDisabled'> &
  RefAttributes<HTMLDivElement> &
  BaseChipProps;

export type DeletableChipProps = Omit<TagProps, 'className' | 'isDisabled'> &
  RefAttributes<HTMLDivElement> &
  BaseChipProps & {
    classNames?: {
      chip?: TagProps['className'];
      remove?: ButtonProps['className'];
    };
  };

export type ChipProviderProps = PropsWithChildren<BaseChipProps>;
