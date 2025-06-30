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
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
} from 'react-aria-components';

const toggleIconButtonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center bg-transparent outline-none',
  {
    variants: {
      variant: {
        primary:
          'icon-default-light ai-selected:icon-highlight ai-selected:hover:bg-highlight-subtle hover:bg-interactive-hover-dark ai-selected:focus:bg-highlight-subtle focus:bg-interactive-hover-dark',
        secondary:
          'icon-default-dark hover:icon-default-light focus:icon-default-light ai-selected:icon-highlight ai-selected:hover:bg-highlight-subtle hover:bg-interactive-hover-dark ai-selected:focus:bg-highlight-subtle focus:bg-interactive-hover-dark',
        minimal: 'icon-default-light ai-selected:icon-highlight',
      },
      size: {
        medium: 'size-xl rounded-medium [--icon-size:var(--spacing-xl)]',
        small: 'size-l rounded-small [--icon-size:var(--spacing-l)]',
      },
      isDisabled: {
        true: 'not-ai-selected:icon-disabled ai-selected:cursor-default not-ai-selected:cursor-not-allowed not-ai-selected:bg-interactive-disabled ai-selected:hover:bg-transparent not-ai-selected:hover:bg-interactive-disabled ai-selected:focus:bg-transparent not-ai-selected:focus:bg-interactive-disabled',
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

export interface ToggleIconButtonProps
  extends Omit<AriaToggleButtonProps, 'isDisabled'>,
    VariantProps<typeof toggleIconButtonStyles> {
  isDisabled?: boolean;
}

export const ToggleIconButton = ({
  className,
  size = 'medium',
  variant = 'secondary',
  isDisabled,
  ...props
}: ToggleIconButtonProps) => {
  expectsIconWrapper({
    children: props.children,
    componentName: ToggleIconButton.displayName,
  });

  return (
    <AriaToggleButton
      className={composeRenderProps(className, (className) =>
        cn(
          toggleIconButtonStyles({
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
ToggleIconButton.displayName = 'ToggleIconButton';
ToggleIconButton.as = (
  props: VariantProps<typeof toggleIconButtonStyles>,
  className?: string | string[],
) => cn(toggleIconButtonStyles({ ...props, className }));
