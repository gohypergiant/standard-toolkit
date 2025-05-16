import { expectsIconWrapper } from '@/lib/react';
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
  'inline-flex cursor-pointer items-center justify-center whitespace-nowrap [--icon-size:20px]',
  {
    variants: {
      variant: {
        primary:
          'fg-inverse-light rounded-medium ai-pressed:bg-interactive-hover-light bg-interactive-default outline-none hover:bg-interactive-hover-light focus:bg-interactive-hover-light',
        outline:
          'fg-default-light rounded-medium outline ai-pressed:outline-interactive-hover outline-interactive hover:outline-interactive-hover focus:outline-interactive-hover',
        flat: 'fg-default-light rounded-medium ai-pressed:bg-interactive-hover-dark bg-transparent outline-none hover:bg-interactive-hover-dark focus:bg-interactive-hover-dark',
        destructive:
          'fg-inverse-light rounded-medium ai-pressed:bg-serious-hover bg-serious-bold outline-none hover:bg-serious-hover focus:bg-serious-hover',
        critical:
          'fg-default-light rounded-medium ai-pressed:bg-critical-hover bg-critical-bold outline-none hover:bg-critical-hover focus:bg-critical-hover',
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
        true: 'fg-disabled hover:fg-disabled cursor-not-allowed bg-interactive-disabled hover:bg-interactive-disabled focus:bg-interactive-disabled',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        isDisabled: true,
        className:
          'fg-disabled hover:fg-disabled focus:fg-disabled cursor-not-allowed bg-transparent outline outline-interactive-disabled hover:bg-transparent focus:bg-transparent',
      },
      {
        variant: 'flat',
        isDisabled: true,
        className:
          'fg-disabled hover:fg-disabled focus:fg-disabled cursor-not-allowed bg-transparent hover:bg-transparent focus:bg-transparent',
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
  extends Omit<AriaButtonProps, 'children' | 'isDisabled'>,
    VariantProps<typeof buttonStyles> {
  /**
   * Used to add text to the badge, such as the number of unread notifications.
   *
   * Can also receive a function which will be called with the parameters mentioned
   * {@link https://react-spectrum.adobe.com/react-aria/Button.html#styling:~:text=are%20documented%20below.-,Name,-CSS%20Selector here}
   */
  children?: AriaButtonProps['children'];
  isDisabled?: boolean;
}

export const Button = ({
  className,
  isDisabled,
  variant = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) => {
  expectsIconWrapper({
    children: props.children,
    componentName: Button.displayName,
  });

  return (
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
};
Button.displayName = 'Button';
Button.as = (
  props: VariantProps<typeof buttonStyles>,
  className?: string | string[],
) => cn(buttonStyles({ ...props, className }));
