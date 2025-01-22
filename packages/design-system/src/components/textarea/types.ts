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

import type { FormEventHandler } from 'react';
import type {
  InputRenderProps as RACInputRenderProps,
  TextAreaProps as RACTextAreaProps,
} from 'react-aria-components';
import type { AsType } from '../../types';

export type TextAreaClassNames = Partial<{
  container: string;
  textarea: string;
}>;

export type TextAreaSize = 'sm' | 'lg';

export type TextAreaMapping = {
  font: Partial<Record<TextAreaSize, string>>;
};

export type TextAreaRenderProps = AsType<RACInputRenderProps> & {
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

export type TextAreaResize = 'both' | 'horizontal' | 'vertical' | 'none';

export type BaseTextAreaProps = {
  classNames?: TextAreaClassNames;
  mapping?: Partial<TextAreaMapping>;
  resize?: TextAreaResize;
  size?: TextAreaSize;
  onChange?: FormEventHandler<HTMLSpanElement>;
};

export type TextAreaState = TextAreaRenderProps &
  Required<Pick<BaseTextAreaProps, 'resize' | 'size'>>;

export type TextAreaProps = Omit<
  RACTextAreaProps,
  'children' | 'className' | 'cols' | 'rows' | 'style' | 'onChange'
> &
  BaseTextAreaProps;
