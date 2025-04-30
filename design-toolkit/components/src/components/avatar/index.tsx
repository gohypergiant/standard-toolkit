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

import { Person } from '@/icons/person';
import { cn } from '@/lib/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import 'client-only';
import { type VariantProps, cva } from 'cva';
import type React from 'react';

const avatarStyles = cva(
  'fg-default-dark flex items-center justify-center overflow-hidden rounded-full bg-surface-overlay',
  {
    variants: {
      size: {
        medium: 'size-[32px] **:[svg]:size-xl',
        small: 'size-xl **:[svg]:size-l',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
);

const avatarWrapperStyles = cn([
  'relative inline-block',
  '[--badge-empty-inset:0_0_auto_auto] [--badge-inset:calc(var(--spacing-xxs)*-1)_calc(var(--spacing-xxs)*-1)_auto_auto] [--badge-position:absolute]',
]);

export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Image>,
    VariantProps<typeof avatarStyles> {
  fallback?: React.ReactNode;
  fallbackDelay?: number;
  source?: string | React.ReactNode;
}

export const Avatar = ({
  className,
  children,
  fallback,
  fallbackDelay,
  source,
  size,
  ...props
}: AvatarProps) => (
  <div className={avatarWrapperStyles}>
    <AvatarPrimitive.Root
      className={cn(
        'pointer-events-none inline-block',
        avatarStyles({ size, className }),
      )}
      role='img'
    >
      {typeof source === 'string' && (
        <AvatarPrimitive.Image
          className='size-full object-cover object-center'
          src={typeof source === 'string' ? source : undefined}
          {...props}
        />
      )}
      {source && typeof source !== 'string' ? (
        source
      ) : (
        <AvatarPrimitive.Fallback delayMs={fallbackDelay}>
          {fallback ? fallback : <Person />}
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
    {children}
  </div>
);
Avatar.displayAs = 'Avatar';
Avatar.as = (
  props: VariantProps<typeof avatarStyles>,
  className?: string | string[],
) => cn(avatarStyles({ ...props, className }));
