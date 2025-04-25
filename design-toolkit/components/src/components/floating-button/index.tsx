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

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from 'react-aria-components';

const floatingButtonStyles = cva([
  'absolute right-[20px] bottom-[20px] inline-flex size-[32px] cursor-pointer items-center justify-center rounded-full border border-interactive-default bg-transparent shadow-elevation-overlay outline-none',
  'icon-color-interactive-default [--icon-size:var(--spacing-xl)]',
  'hover:icon-color-interactive-hover hover:border-interactive-hover hover:bg-interactive-hover-dark',
  'disabled:icon-color-disabled disabled:cursor-not-allowed disabled:border-interactive-disabled disabled:bg-interactive-disabled',
]);

export interface FloatingButtonProps extends AriaButtonProps {}

export const FloatingButton = ({
  className,
  ...props
}: FloatingButtonProps) => (
  <AriaButton
    className={composeRenderProps(className, (className) =>
      cn(
        floatingButtonStyles({
          className,
        }),
      ),
    )}
    {...props}
  />
);
FloatingButton.displayName = 'FloatingButton';
FloatingButton.as = (
  props: VariantProps<typeof floatingButtonStyles>,
  className?: string | string[],
) => cn(floatingButtonStyles({ ...props, className }));
