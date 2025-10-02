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
  ComboBoxProps,
  FieldErrorProps,
  InputProps,
  LabelProps,
  ListLayoutOptions,
  PopoverProps,
  VirtualizerProps,
} from 'react-aria-components';
import type { ButtonProps } from '../button/types';
import type { OptionsDataItem, OptionsProps } from '../options/types';

export type ComboBoxFieldProps<T extends OptionsDataItem> = Omit<
  ComboBoxProps<T>,
  'children' | 'className'
> &
  Pick<VirtualizerProps<ListLayoutOptions>, 'layoutOptions'> &
  Pick<OptionsProps<T>, 'children'> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      field?: ComboBoxProps<T>['className'];
      label?: LabelProps['className'];
      control?: string;
      input?: InputProps['className'];
      trigger?: ButtonProps['className'];
      description?: string;
      error?: FieldErrorProps['className'];
      popover?: PopoverProps['className'];
    };
    label?: string;
    inputProps?: Omit<InputProps, 'className'>;
    description?: string;
    errorMessage?: string;
    size?: 'small' | 'medium';
  };
