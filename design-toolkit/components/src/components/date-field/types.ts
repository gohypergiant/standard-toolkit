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
  DateFieldProps as AriaDateFieldProps,
  DateInputProps,
  DateSegmentProps,
  DateValue,
  FieldErrorProps,
  LabelProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';
import type { DateFieldStyles } from './styles';

export type DateFieldProps<T extends DateValue> = Omit<
  AriaDateFieldProps<T>,
  'children' | 'className' | 'placeholder'
> &
  VariantProps<typeof DateFieldStyles> & {
    classNames?: {
      field?: AriaDateFieldProps<T>['className'];
      label?: LabelProps['className'];
      control?: string;
      input?: DateInputProps['className'];
      segment?: DateSegmentProps['className'];
      description?: string;
      error?: FieldErrorProps['className'];
    };
    label?: string;
    description?: string;
    errorMessage?: string;
    inputProps?: Omit<DateInputProps, 'children' | 'className'>;
    /**
     * When true, will convert month value to 3 letter abbreviation when not editing
     */
    shortMonth?: boolean;
    size?: 'small' | 'medium';
  };
