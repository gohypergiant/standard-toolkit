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
  InputProps as RACInputProps,
  InputRenderProps as RACInputRenderProps,
} from 'react-aria-components';
import type { AsType } from '../../types';

export type InputClassNames = Partial<{
  container: string;
  sizer: string;
  input: string;
}>;

export type InputRenderProps = AsType<RACInputRenderProps> & {
  /**
   * If value is undefined or empty
   */
  isEmpty: boolean;
  /**
   * If placeholder is provided and value is undefined or empty
   */
  isPlaceholder: boolean;
  /**
   * If read only
   */
  isReadOnly: boolean;
  /**
   * If required
   */
  isRequired: boolean;
};

export type InputSize = 'sm' | 'lg';

export type InputMapping = {
  sizer: Partial<Record<InputSize, string>>;
  input: Partial<Record<InputSize, string>>;
};

// Limit to types that fit the "text" style
export type InputType =
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'text'
  | 'url';

export type BaseInputProps = {
  classNames?: InputClassNames;
  mapping?: Partial<InputMapping>;
  size?: InputSize;
  type?: InputType;
};

export type InputState = InputRenderProps &
  Required<Pick<BaseInputProps, 'size' | 'type'>> & {
    /**
     * The length of the input value or placeholder (whichever is currently rendered)
     */
    length: string;
  };

export type InputProps = Omit<
  RACInputProps,
  'children' | 'className' | 'size' | 'style' | 'type'
> &
  BaseInputProps;
