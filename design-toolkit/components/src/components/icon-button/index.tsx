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

import { expectsIconWrapper } from '@/lib/react';
import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'cva';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from 'react-aria-components';

const iconButtonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center ai-pressed:bg-interactive-hover-dark bg-transparent outline-none hover:bg-interactive-hover-dark focus:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        primary: 'icon-default-light',
        secondary:
          'icon-default-dark hover:icon-default-light ai-pressed:icon-default-light focus:icon-default-light',
      },
      size: {
        medium: 'size-[28px] rounded-medium [--icon-size:var(--spacing-xl)]',
        small: 'size-[20px] rounded-small [--icon-size:var(--spacing-l)]',
      },
      isDisabled: {
        true: 'icon-disabled fg-disabled hover:fg-disabled focus:fg-disabled cursor-not-allowed ai-pressed:bg-transparent bg-transparent hover:bg-transparent focus:bg-transparent',
        false: '',
      },
    },
    defaultVariants: {
      isDisabled: false,
      size: 'medium',
      variant: 'primary',
    },
  },
);

export interface IconButtonProps
  extends Omit<AriaButtonProps, 'isDisabled'>,
    VariantProps<typeof iconButtonStyles> {
  isDisabled?: boolean;
}

export const IconButton = ({
  className,
  size = 'medium',
  variant = 'primary',
  isDisabled,
  ...props
}: IconButtonProps) => {
  expectsIconWrapper({
    children: props.children,
    componentName: IconButton.displayName,
  });

  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          iconButtonStyles({
            isDisabled,
            size,
            variant,
            className,
          }),
        ),
      )}
      isDisabled={isDisabled}
      {...props}
    />
  );
};

IconButton.displayName = 'IconButton';
IconButton.as = (
  props: VariantProps<typeof iconButtonStyles>,
  className?: string | string[],
) => cn(iconButtonStyles({ ...props, className }));
