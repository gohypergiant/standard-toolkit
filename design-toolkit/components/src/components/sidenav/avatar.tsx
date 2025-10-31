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
import { HeadingContext, Provider, TextContext } from 'react-aria-components';
import { AvatarContext } from '../avatar/context';
import { IconContext } from '../icon/context';
import { SidenavStyles } from './styles';
import type { SidenavAvatarProps } from './types';

const { avatar, avatarHeading, avatarIcon, avatarText, transient } =
  SidenavStyles();

/**
 * SidenavAvatar - Avatar component for sidenav
 *
 * Provides an avatar container with proper styling for the sidenav
 */
export function SidenavAvatar({
  children,
  className,
  ...rest
}: SidenavAvatarProps) {
  return (
    <Provider
      values={[
        [IconContext, { size: 'large', className: avatarIcon() }],
        [
          HeadingContext,
          { className: avatarHeading({ className: transient() }) },
        ],
        [TextContext, { className: avatarText({ className: transient() }) }],
        [AvatarContext, { classNames: { avatar: avatarIcon() } }],
      ]}
    >
      <div {...rest} className={avatar({ className })}>
        {children}
      </div>
    </Provider>
  );
}
