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

'use client';

import 'client-only';
import {
  type FocusableProviderProps,
  Pressable,
} from '@react-aria/interactions';
import {
  Children,
  type DOMAttributes,
  type ReactElement,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { DialogTrigger } from 'react-aria-components';
import type { FocusableElement } from '@react-types/shared';
import type { PopoverTriggerProps } from './types';

function PopoverPressable({
  children,
  ref,
}: FocusableProviderProps & RefAttributes<FocusableElement>) {
  const [trigger, popover] = Children.toArray(children) as [
    ReactElement<DOMAttributes<FocusableElement>, string>,
    ReactNode,
  ];

  return (
    <>
      <Pressable ref={ref}>{trigger}</Pressable>
      {popover}
    </>
  );
}

export function PopoverTrigger({
  ref,
  children,
  ...rest
}: PopoverTriggerProps) {
  return (
    <DialogTrigger {...rest}>
      <PopoverPressable ref={ref}>{children}</PopoverPressable>
    </DialogTrigger>
  );
}
