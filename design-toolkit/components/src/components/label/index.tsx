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
import { cva } from 'cva';
import {
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
} from 'react-aria-components';

const labelStyles = cva(
  'fg-default-light flex items-center gap-xs text-header-s',
  {
    variants: {
      isDisabled: {
        true: 'fg-disabled',
        false: 'fg-default-light',
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  },
);

interface LabelProps extends AriaLabelProps {
  isDisabled?: boolean;
  isOptional?: boolean;
}

export function Label({
  children,
  className,
  isDisabled,
  isOptional,
  ...props
}: LabelProps) {
  return (
    <AriaLabel
      {...props}
      className={cn(labelStyles({ isDisabled, className }))}
    >
      {children} {isOptional && '(optional)'}
    </AriaLabel>
  );
}
Label.displayName = 'Label';
Label.as = (className?: string | string[]) => cn(labelStyles({ className }));
