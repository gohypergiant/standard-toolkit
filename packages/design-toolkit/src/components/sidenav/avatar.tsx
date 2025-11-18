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
import { clsx } from 'clsx';
import { HeadingContext, Provider, TextContext } from 'react-aria-components';
import { AvatarContext } from '../avatar/context';
import { IconContext } from '../icon/context';
import styles from './styles.module.css';
import type { SidenavAvatarProps } from './types';

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
        [IconContext, { size: 'large', className: styles.icon }],
        [HeadingContext, { className: clsx(styles.heading, styles.transient) }],
        [TextContext, { className: clsx(styles.text, styles.transient) }],
        [AvatarContext, { classNames: { avatar: styles.icon } }],
      ]}
    >
      <div {...rest} className={clsx(styles.avatar, className)}>
        {children}
      </div>
    </Provider>
  );
}
