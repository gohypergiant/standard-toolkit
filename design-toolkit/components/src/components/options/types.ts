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
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
  TextProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { OptionsStyles } from './styles';

export interface IOptionsItem {
  children?: IOptionsItem[];
  id: string | number;
  name: string;
}

type OptionsItemSize = 'small' | 'large';

export interface OptionsItemProps
  extends AriaListBoxItemProps,
    OptionsStyleVariants {
  size?: OptionsItemSize;
}

export interface OptionsProps<T extends IOptionsItem>
  extends Omit<AriaListBoxProps<T>, 'orientation' | 'layout'>,
    RefAttributes<HTMLDivElement> {
  description?: string;
  errorMessage?: string;
  label?: string;
  placeholder?: string;
  size?: OptionsItemSize;
  color?: OptionsItemProps['color'];
}

export interface OptionsSectionProps<T extends IOptionsItem>
  extends AriaListBoxSectionProps<T> {
  header?: string;
}

export interface OptionsItemTextProps extends TextProps {
  // className?: string;
}

export type OptionsStyleVariants = VariantProps<typeof OptionsStyles>;
