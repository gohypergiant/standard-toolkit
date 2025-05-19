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

import type { PropsWithChildren } from 'react';
import type {
  TagGroupProps,
  TagListProps,
  TagProps,
  TagRenderProps,
} from 'react-aria-components';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { ButtonProps } from '../button/types';

export type ChipClassNames = Partial<{
  group: string;
  list: string;
  container: string;
  chip: string;
  label: string;
  remove: string;
}>;

export type ChipColors =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'advisory'
  | 'affirmative'
  | 'serious'
  | 'critical';

export type ChipSizes = 'sm' | 'lg';

export type ChipRenderProps = AsType<TagRenderProps>;

export type ChipMapping = {
  font: Partial<Record<ChipSizes, string>>;
  remove: Partial<Record<ChipSizes, OmitProtectedProps<ButtonProps>>>;
};

export type BaseChipProps = {
  children?: RenderPropsChildren<ChipRenderProps>;
  classNames?: ChipClassNames;
  color?: ChipColors;
  mapping?: Partial<ChipMapping>;
  size?: ChipSizes;
};

export type ChipState = ChipRenderProps &
  Required<Pick<BaseChipProps, 'color' | 'size'>>;

export type ChipProps = PropsWithChildren<Omit<BaseChipProps, 'children'>>;

export type ChipItemProps = Omit<TagProps, 'children' | 'className' | 'style'> &
  BaseChipProps;

export type ChipListProps<T> = Omit<TagListProps<T>, 'className' | 'style'> &
  Pick<BaseChipProps, 'classNames'>;

export type ChipGroupProps = Omit<TagGroupProps, 'className' | 'style'> &
  Omit<BaseChipProps, 'children'>;
