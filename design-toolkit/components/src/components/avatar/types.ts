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

import type { Avatar, Fallback, Image } from '@radix-ui/react-avatar';
import type { ComponentPropsWithRef } from 'react';
import type { VariantProps } from 'tailwind-variants';
import type { AvatarStyles } from './styles';

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'className'> &
  Omit<ComponentPropsWithRef<typeof Avatar>, 'className'> &
  VariantProps<typeof AvatarStyles> & {
    classNames?: {
      avatar?: string;
      image?: string;
      fallback?: string;
      content?: string;
    };
    fallbackProps?: Omit<ComponentPropsWithRef<typeof Fallback>, 'className'>;
    imageProps?: Omit<ComponentPropsWithRef<typeof Image>, 'className'>;
    size?: 'medium' | 'small';
  };
