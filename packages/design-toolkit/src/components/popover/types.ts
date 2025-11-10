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

import type { ComponentProps, ReactNode } from 'react';
import type {
  HeadingProps as AriaHeadingProps,
  PopoverProps as AriaPopoverProps,
  PopoverRenderProps,
  Pressable,
} from 'react-aria-components';

export interface PopoverProps {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  children?: ReactNode;
}

export interface PopoverTriggerProps extends ComponentProps<typeof Pressable> {}

export interface PopoverContentProps
  extends Omit<AriaPopoverProps, 'children'> {
  children?:
    | ReactNode
    | ((props: PopoverRenderProps & { close: () => void }) => ReactNode);
  className?: string;
}

export interface PopoverTitleProps extends Omit<AriaHeadingProps, 'children'> {
  children?: ReactNode;
}

export interface PopoverBodyProps {
  children?: ReactNode;
  className?: string;
}
