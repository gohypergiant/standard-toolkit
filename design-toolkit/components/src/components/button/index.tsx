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
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from 'react-aria-components';
import { cn } from '../../lib/utils';

const buttonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center font-bold whitespace-nowrap outline-none [--icon-size:20px]',
  {
    variants: {
      variant: {
        primary:
          'rounded-medium bg-interactive-default text-inverse-light hover:bg-interactive-hover-light pressed:bg-interactive-hover-light',
        outline:
          'rounded-medium border border-interactive text-default-light hover:border-interactive-hover pressed:border-interactive-hover',
        flat: 'rounded-medium bg-transparent text-default-light hover:bg-interactive-hover-dark pressed:bg-interactive-hover-dark',
        destructive:
          'rounded-medium bg-serious-bold text-inverse-light hover:bg-serious-hover pressed:bg-serious-hover',
        critical:
          'rounded-medium bg-critical-bold text-default-light hover:bg-critical-hover pressed:bg-critical-hover',
      },
      size: {
        large:
          'min-h-xxl gap-m rounded-medium px-l py-s text-button-l tracking-[0.5px] [--icon-size:22px]',
        medium:
          'min-h-[32px] gap-xs rounded-medium px-l py-xs text-button-m tracking-[0.25px] [--icon-size:20px]',
        small:
          'min-h-xl gap-xxs p-s text-button-s tracking-[0.4px] [--icon-size:14px]',
        xsmall:
          'min-h-[20px] gap-xxs px-s py-xs text-button-xs tracking-[0.5px] [--icon-size:10px]',
      },
      disabled: {
        true: 'cursor-not-allowed bg-interactive-disabled text-disabled hover:bg-interactive-disabled hover:text-disabled',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        disabled: true,
        className:
          'cursor-not-allowed border-interactive-disabled bg-transparent text-disabled hover:bg-transparent hover:text-disabled',
      },
      {
        variant: 'flat',
        disabled: true,
        className:
          'cursor-not-allowed bg-transparent text-disabled hover:bg-transparent hover:text-disabled',
      },
    ],
    defaultVariants: {
      disabled: false,
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends Omit<AriaButtonProps, 'disabled'>,
    VariantProps<typeof buttonStyles> {
  disabled?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  disabled = false,
  ...props
}: ButtonProps) => (
  <AriaButton
    className={composeRenderProps(className, (className) =>
      cn(
        'w-content',
        buttonStyles({
          disabled,
          variant,
          size,
          className,
        }),
      ),
    )}
    {...props}
  />
);
Button.displayName = 'Button';
Button.as = (
  props: VariantProps<typeof buttonStyles>,
  className?: string | string[],
) => cn(buttonStyles({ ...props, className }));

export { Button };
