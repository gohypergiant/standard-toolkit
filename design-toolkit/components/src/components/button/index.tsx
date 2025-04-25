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
          'rounded-medium ai-pressed:bg-interactive-hover-light bg-interactive-default text-inverse-light hover:bg-interactive-hover-light',
        outline:
          'rounded-medium border ai-pressed:border-interactive-hover border-interactive text-default-light hover:border-interactive-hover',
        flat: 'rounded-medium ai-pressed:bg-interactive-hover-dark bg-transparent text-default-light hover:bg-interactive-hover-dark',
        destructive:
          'rounded-medium ai-pressed:bg-serious-hover bg-serious-bold text-inverse-light hover:bg-serious-hover',
        critical:
          'rounded-medium ai-pressed:bg-critical-hover bg-critical-bold text-default-light hover:bg-critical-hover',
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
      isDisabled: {
        true: 'cursor-not-allowed bg-interactive-disabled text-disabled hover:bg-interactive-disabled hover:text-disabled',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        isDisabled: true,
        className:
          'cursor-not-allowed border-interactive-disabled bg-transparent text-disabled hover:bg-transparent hover:text-disabled',
      },
      {
        variant: 'flat',
        isDisabled: true,
        className:
          'cursor-not-allowed bg-transparent text-disabled hover:bg-transparent hover:text-disabled',
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
