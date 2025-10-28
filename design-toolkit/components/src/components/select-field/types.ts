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
  ListLayoutOptions as AriaListLayoutOptions,
  SelectProps as AriaSelectProps,
  VirtualizerProps as AriaVirtualizerProps,
  FieldErrorProps,
  PopoverProps,
} from 'react-aria-components';
import type { ButtonProps } from '../button/types';
import type { LabelProps } from '../label/types';

export type SelectFieldProps = Omit<AriaSelectProps, 'className'> &
  Pick<AriaVirtualizerProps<AriaListLayoutOptions>, 'layoutOptions'> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      description?: string;
      error?: FieldErrorProps['className'];
      field?: string;
      label?: LabelProps['className'];
      trigger?: ButtonProps['className'];
      value?: string;
      popover?: PopoverProps['className'];
    };
    label?: string;
    description?: string;
    errorMessage?: string;
    size?: 'medium' | 'small';
  };
