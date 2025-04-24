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

import { type VariantProps, cva } from 'cva';
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
  composeRenderProps,
} from 'react-aria-components';
import { cn } from '../../lib/utils';

const toggleIconButtonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center bg-transparent outline-none hover:bg-interactive-hover-dark',
  {
    variants: {
      variant: {
        primary:
          'icon-color-default-light selected:icon-color-highlight selected:hover:bg-highlight-subtle',
        secondary:
          'icon-color-default-dark hover:icon-color-default-light selected:icon-color-highlight selected:hover:bg-highlight-subtle',
      },
      size: {
        medium: 'size-[28px] rounded-medium [--icon-size:var(--spacing-xl)]',
        small: 'size-[20px] rounded-small [--icon-size:var(--spacing-l)]',
      },
      disabled: {
        true: 'cursor-not-allowed bg-interactive-disabled text-disabled icon-color-disabled hover:bg-interactive-disabled hover:text-disabled',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
      size: 'medium',
      variant: 'primary',
    },
  },
);

export interface ToggleIconButtonProps
  extends Omit<AriaToggleButtonProps, 'disabled'>,
    VariantProps<typeof toggleIconButtonStyles> {
  disabled?: boolean;
}

const ToggleIconButton = ({
  className,
  size,
  variant,
  disabled = false,
  ...props
}: ToggleIconButtonProps) => (
  <AriaToggleButton
    className={composeRenderProps(className, (className) =>
      cn(
        toggleIconButtonStyles({
          disabled,
          size,
          variant,
          className,
        }),
      ),
    )}
    {...props}
  />
);
ToggleIconButton.displayName = 'ToggleIconButton';
ToggleIconButton.as = (
  props: VariantProps<typeof toggleIconButtonStyles>,
  className?: string | string[],
) => cn(toggleIconButtonStyles({ ...props, className }));

export { ToggleIconButton };
