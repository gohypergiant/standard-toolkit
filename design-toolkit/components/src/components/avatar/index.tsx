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

import 'client-only';
import { spacingXs } from '@/tokens/';
import { Person } from '@accelint/icons';
import { Fallback, Image, Root } from '@radix-ui/react-avatar';
import { createContext } from 'react';
import { type ContextValue, useContextProps } from 'react-aria-components';
import { Badge } from '../badge';
import { Icon } from '../icon';
import { AvatarStyles } from './styles';
import type { AvatarProps, AvatarProviderProps } from './types';

const { avatar, image, fallback, content } = AvatarStyles();

export const AvatarContext =
  createContext<ContextValue<AvatarProps, HTMLSpanElement>>(null);

function AvatarProvider({ children, ...props }: AvatarProviderProps) {
  return (
    <AvatarContext.Provider value={props}>{children}</AvatarContext.Provider>
  );
}
AvatarProvider.displayName = 'Avatar.Provider';

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
    <Icon.Provider size={size === 'medium' ? 'large' : 'medium'}>
      <Root
        {...rest}
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
        <Badge.Provider offset={spacingXs} placement='top right'>
          <span className={content({ className: classNames?.content, size })}>
            {children}
          </span>
        </Badge.Provider>
      </Root>
    </Icon.Provider>
  );
}
Avatar.displayName = 'Avatar';
Avatar.Provider = AvatarProvider;
