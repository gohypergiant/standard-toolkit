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
import { cn } from '@/lib/utils';
import 'client-only';
import { type VariantProps, cva } from 'cva';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from 'react-aria-components';

const floatingButtonStyles = cva(
  [
    'absolute right-[20px] bottom-[20px] inline-flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-transparent shadow-elevation-overlay outline outline-interactive-default',
    'icon-default-dark [--icon-size:var(--spacing-xl)]',
    'hover:icon-default-light hover:bg-interactive-hover-dark hover:outline-interactive-hover',
    'focus:icon-default-light focus:bg-interactive-hover-dark focus:outline-interactive-hover',
  ],
  {
    variants: {
      isDisabled: {
        true: 'icon-disabled hover:icon-disabled cursor-not-allowed bg-interactive-disabled outline-interactive-disabled hover:bg-interactive-disabled hover:outline-interactive-disabled focus:bg-interactive-disabled focus:outline-interactive-disabled',
        false: '',
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  },
);

export interface FloatingButtonProps
  extends Omit<AriaButtonProps, 'isDisabled'> {
  isDisabled?: boolean;
}

export const FloatingButton = ({
  className,
  isDisabled,
  ...props
}: FloatingButtonProps) => (
  <AriaButton
    className={composeRenderProps(className, (className) =>
      cn(
        floatingButtonStyles({
          className,
          isDisabled,
        }),
      ),
    )}
    isDisabled={isDisabled}
    {...props}
  />
);
FloatingButton.displayName = 'FloatingButton';
FloatingButton.as = (
  props: VariantProps<typeof floatingButtonStyles>,
  className?: string | string[],
) => cn(floatingButtonStyles({ ...props, className }));
