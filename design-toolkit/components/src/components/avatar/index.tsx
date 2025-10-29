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

import { Person } from '@accelint/icons';
import { Fallback, Image, Root } from '@radix-ui/react-avatar';
import { designTokens } from '@/tokens/tokens';
import 'client-only';
import { useContextProps } from 'react-aria-components';
import { BadgeProvider } from '../badge/context';
import { Icon } from '../icon';
import { IconProvider } from '../icon/context';
import { AvatarContext } from './context';
import { AvatarStyles } from './styles';
import type { AvatarProps } from './types';

const { avatar, image, fallback, content } = AvatarStyles();

/**
 * Avatar - A user profile image component with fallback support
 *
 * Displays a user's profile image with automatic fallback to a default person icon
 * when the image fails to load. Supports multiple sizes and can include status badges.
 * Built on Radix UI Avatar for accessibility and reliability.
 *
 * @example
 * // Basic avatar with image
 * <Avatar imageProps={{ src: "/user.jpg", alt: "User Name" }} />
 *
 * @example
 * // Avatar with fallback and custom size
 * <Avatar
 *   size="large"
 *   imageProps={{ src: "/user.jpg", alt: "User Name" }}
 *   fallbackProps={{ children: "UN" }}
 * />
 *
 * @example
 * // Avatar with status badge
 * <Avatar imageProps={{ src: "/user.jpg", alt: "User Name" }}>
 *   <Badge variant="success" />
 * </Avatar>
 *
 * @example
 * // Avatar with only initials fallback
 * <Avatar fallbackProps={{ children: "JD" }} />
 */
export function Avatar({ ref, ...props }: AvatarProps) {
  [props, ref] = useContextProps(props, ref ?? null, AvatarContext);

  const {
    children,
    classNames,
    fallbackProps,
    imageProps,
    size = 'medium',
    ...rest
  } = props;

  return (
    <IconProvider size={size === 'medium' ? 'large' : 'medium'}>
      <Root
        {...rest}
        ref={ref}
        className={avatar({ size, className: classNames?.avatar })}
        role='img'
        data-size={size}
      >
        <Image
          {...imageProps}
          className={image({ className: classNames?.image, size })}
        />
        <Fallback
          {...fallbackProps}
          className={fallback({ className: classNames?.fallback, size })}
        >
          {fallbackProps?.children || (
            <Icon>
              <Person />
            </Icon>
          )}
        </Fallback>
        <BadgeProvider offset={designTokens.spacing.xs} placement='top right'>
          <span className={content({ className: classNames?.content, size })}>
            {children}
          </span>
        </BadgeProvider>
      </Root>
    </IconProvider>
  );
}
