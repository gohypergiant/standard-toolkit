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

import type { ComponentPropsWithRef, RefAttributes } from 'react';
import type { TextProps } from 'react-aria-components';

export type DetailsListProps = Omit<
  ComponentPropsWithRef<'dl'>,
  'className'
> & {
  classNames?: {
    list?: string;
    label?: string;
    value?: string;
  };
  align?: 'center' | 'justify' | 'left';
};

export type DetailsListLabelProps = Omit<TextProps, 'elementType'> &
  RefAttributes<HTMLElement>;

export type DetailsListValueProps = Omit<TextProps, 'elementType'> &
  RefAttributes<HTMLElement>;
