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

import type { Orientation } from '@react-types/shared';
import type { RefAttributes } from 'react';
import type {
  CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import type { LabelProps } from '../label/types';

export type CheckboxGroupProps = Omit<AriaCheckboxGroupProps, 'className'> &
  RefAttributes<HTMLDivElement> & {
    classNames?: {
      group?: AriaCheckboxGroupProps['className'];
      label?: LabelProps['className'];
    };
    label?: string;
    orientation?: Orientation;
  };

export type CheckboxProps = Omit<AriaCheckboxProps, 'className'> &
  RefAttributes<HTMLLabelElement> & {
    classNames?: {
      checkbox?: AriaCheckboxProps['className'];
      control?: string;
      label?: string;
    };
  };
