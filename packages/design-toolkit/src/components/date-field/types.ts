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

/**
 * Props for the DateField component.
 *
 * Extends AriaDateFieldProps with custom styling, labels, and size variants.
 */
export type DateFieldProps<T extends DateValue> = Omit<
  AriaDateFieldProps<T>,
  'children' | 'className' | 'placeholder'
> & {
  /** Custom class names for sub-elements. */
  classNames?: {
    /** Class name for the field container. */
    field?: AriaDateFieldProps<T>['className'];
    /** Class name for the label. */
    label?: LabelProps['className'];
    /** Class name for the control wrapper. */
    control?: string;
    /** Class name for the date input. */
    input?: DateInputProps['className'];
    /** Class name for individual date segments. */
    segment?: DateSegmentProps['className'];
    /** Class name for the description text. */
    description?: string;
    /** Class name for the error message. */
    error?: FieldErrorProps['className'];
  };
  /** Label text displayed above the field. */
  label?: string;
  /** Helper text displayed below the field. */
  description?: string;
  /** Error message displayed when invalid. */
  errorMessage?: string;
  /** Additional props passed to the date input element. */
  inputProps?: Omit<DateInputProps, 'children' | 'className'>;
  /** When true, will convert month value to 3 letter abbreviation when not editing. */
  shortMonth?: boolean;
  /** Size variant of the field. */
  size?: 'small' | 'medium';
};
