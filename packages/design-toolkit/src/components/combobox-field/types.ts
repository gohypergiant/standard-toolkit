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

/**
 * Props for the ComboBoxField component.
 *
 * Extends ComboBox props with virtualization, styling, and field configuration.
 */
export type ComboBoxFieldProps<T extends OptionsDataItem> = Omit<
  ComboBoxProps<T>,
  'children' | 'className'
> &
  Pick<VirtualizerProps<ListLayoutOptions>, 'layoutOptions'> &
  Pick<OptionsProps<T>, 'children'> &
  RefAttributes<HTMLDivElement> & {
    /** Custom class names for sub-elements. */
    classNames?: {
      /** Class name for the field container. */
      field?: ComboBoxProps<T>['className'];
      /** Class name for the label. */
      label?: LabelProps['className'];
      /** Class name for the control wrapper. */
      control?: string;
      /** Class name for the input element. */
      input?: InputProps['className'];
      /** Class name for the clear button. */
      clear?: ButtonProps['className'];
      /** Class name for the trigger button. */
      trigger?: ButtonProps['className'];
      /** Class name for the description text. */
      description?: string;
      /** Class name for the error message. */
      error?: FieldErrorProps['className'];
      /** Class name for the popover dropdown. */
      popover?: PopoverProps['className'];
    };
    /** Label text displayed above the field. */
    label?: string;
    /** Additional props passed to the input element. */
    inputProps?: Omit<InputProps, 'className'>;
    /** Helper text displayed below the field. */
    description?: string;
    /** Error message displayed when invalid. */
    errorMessage?: string;
    /** Size variant of the field. */
    size?: 'small' | 'medium';
    /** Whether the field shows a clear button. Will not show if the field is read-only. */
    isClearable?: boolean;
  };
