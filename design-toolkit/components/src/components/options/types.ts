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

import type { ReactNode, RefAttributes } from 'react';
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
  TextProps,
} from 'react-aria-components';
import type { IconProps } from '../icon/types';
import type { OptionsStyleVariants } from './styles';

export interface IOptionsItem {
  children?: IOptionsItem[];
  description?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  id: string | number;
  name: string;
}

export interface OptionsItemProps extends AriaListBoxItemProps {
  color?: OptionsStyleVariants['color'];
  size?: OptionsStyleVariants['size'];
}

export interface OptionsProps<T extends IOptionsItem>
  extends AriaListBoxProps<T>,
    RefAttributes<HTMLDivElement> {
  className?: string;
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  size?: OptionsItemProps['size'];
  color?: OptionsItemProps['color'];
}

export interface OptionsSectionProps<T extends IOptionsItem>
  extends AriaListBoxSectionProps<T> {
  header?: string;
}

export interface OptionsItemTextProps extends TextProps {
  className?: string;
}

export interface OptionsItemIconProps extends IconProps {
  className?: string;
}
