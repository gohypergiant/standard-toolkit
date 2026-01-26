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
import type { InputProps as AriaInputProps } from 'react-aria-components';
import type { ButtonProps } from '../button/types';

/**
 * Props for the Input component.
 */
export type InputProps = Omit<AriaInputProps, 'className' | 'size'> &
  RefAttributes<HTMLInputElement> & {
    /** CSS class names for input subcomponents. */
    classNames?: {
      /** Class name for the outer container. */
      container?: string;
      /** Class name for the sizer wrapper. */
      sizer?: string;
      /** Class name for the input element. */
      input?: AriaInputProps['className'];
      /** Class name for the clear button. */
      clear?: ButtonProps['className'];
      /** Class name for the prefix element. */
      prefix?: string;
      /** Class name for the suffix element. */
      suffix?: string;
    };
    /** Whether the input should auto-size to its content. */
    autoSize?: boolean;
    /** Content to display before the input. */
    prefix?: ReactNode;
    /** Size variant for the input. */
    size?: 'medium' | 'small';
    /** Content to display after the input. */
    suffix?: ReactNode;
    /** Whether the input shows a clear button. */
    isClearable?: boolean;
    /** Whether the input is in an invalid state. */
    isInvalid?: boolean;
  };
