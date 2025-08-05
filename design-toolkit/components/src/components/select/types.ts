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
  SelectProps as AriaSelectProps,
  VirtualizerProps as AriaVirtualizerProps,
  FieldErrorProps,
} from 'react-aria-components';
import type { ListLayoutOptions as AriaListLayoutOptions } from 'react-aria-components';
import type { ButtonProps } from '../button/types';
import type { LabelProps } from '../label/types';

export type SelectProps = Omit<AriaSelectProps, 'className'> &
  Pick<AriaVirtualizerProps<AriaListLayoutOptions>, 'layoutOptions'> & {
    classNames?: {
      description?: string;
      error?: FieldErrorProps['className'];
      field?: ButtonProps['className'];
      label?: LabelProps['className'];
      select?: string;
      value?: string;
    };
  } & {
    label?: string;
    description?: string;
    errorMessage?: string;
    size?: 'medium' | 'small';
    isReadOnly?: boolean;
  };
