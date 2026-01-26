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
  TimeFieldProps as AriaTimeFieldProps,
  DateInputProps,
  DateSegmentProps,
  FieldErrorProps,
  LabelProps,
  TimeValue,
} from 'react-aria-components';

/**
 * Props for the TimeField component.
 */
export type TimeFieldProps<T extends TimeValue> = Omit<
  AriaTimeFieldProps<T>,
  'children' | 'className' | 'placeholder'
> & {
  /** Custom CSS class names for field elements. */
  classNames?: {
    field?: AriaTimeFieldProps<T>['className'];
    label?: LabelProps['className'];
    control?: string;
    input?: DateInputProps['className'];
    segment?: DateSegmentProps['className'];
    description?: string;
    error?: FieldErrorProps['className'];
  };
  /** Label text for the field. */
  label?: string;
  /** Props passed to the underlying DateInput element. */
  inputProps?: Omit<DateInputProps, 'children' | 'className'>;
  /** Helper text displayed below the input. */
  description?: string;
  /** Error message displayed when validation fails. */
  errorMessage?: string;
  /** Size variant of the field. */
  size?: 'small' | 'medium';
};
