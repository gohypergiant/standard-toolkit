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

const buttonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap outline-none [--icon-size:20px]',
  {
    variants: {
      variant: {
        primary:
          'fg-inverse-light rounded-medium ai-pressed:bg-interactive-hover-light bg-interactive-default hover:bg-interactive-hover-light',
        outline:
          'fg-default-light rounded-medium border ai-pressed:border-interactive-hover border-interactive hover:border-interactive-hover',
        flat: 'fg-default-light rounded-medium ai-pressed:bg-interactive-hover-dark bg-transparent hover:bg-interactive-hover-dark',
        destructive:
          'fg-inverse-light rounded-medium ai-pressed:bg-serious-hover bg-serious-bold hover:bg-serious-hover',
        critical:
          'fg-default-light rounded-medium ai-pressed:bg-critical-hover bg-critical-bold hover:bg-critical-hover',
      },
      size: {
        large:
          'min-h-xxl gap-xs rounded-medium px-l py-s text-button-l [--icon-size:24px]',
        medium:
          'min-h-[32px] gap-xs rounded-medium px-l py-xs text-button-m [--icon-size:20px]',
        small: 'min-h-xl gap-xxs p-s text-button-s [--icon-size:16px]',
        xsmall:
          'min-h-[20px] gap-xxs px-s py-xs text-button-xs [--icon-size:12px]',
      },
      isDisabled: {
        true: 'fg-disabled hover:fg-disabled cursor-not-allowed bg-interactive-disabled hover:bg-interactive-disabled',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        isDisabled: true,
        className:
          'fg-disabled hover:fg-disabled cursor-not-allowed border-interactive-disabled bg-transparent hover:bg-transparent',
      },
      {
        variant: 'flat',
        isDisabled: true,
        className:
          'fg-disabled hover:fg-disabled cursor-not-allowed bg-transparent hover:bg-transparent',
      },
    ],
    defaultVariants: {
      isDisabled: false,
      variant: 'primary',
      size: 'medium',
    },
  },
);

export interface ButtonProps
  extends Omit<AriaButtonProps, 'isDisabled'>,
    VariantProps<typeof buttonStyles> {
  isDisabled?: boolean;
}

export const Button = ({
  className,
  isDisabled,
  variant,
  size,
  ...props
}: ButtonProps) => (
  <AriaButton
    className={composeRenderProps(className, (className) =>
      cn(
        'w-content',
        buttonStyles({
          isDisabled,
          variant,
          size,
          className,
        }),
      ),
    )}
    isDisabled={isDisabled}
    {...props}
  />
);
Button.displayName = 'Button';
Button.as = (
  props: VariantProps<typeof buttonStyles>,
  className?: string | string[],
) => cn(buttonStyles({ ...props, className }));
