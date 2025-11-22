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

import 'server-only';
import { Avatar } from '@accelint/design-toolkit/components/avatar/index';
import { Badge } from '@accelint/design-toolkit/components/badge/index';
import { Icon } from '@accelint/design-toolkit/components/icon/index';
import PlaceholderIcon from '@accelint/icons/placeholder';
import { BentoItem } from '~/components/bento';
import type { AvatarProps } from '@accelint/design-toolkit/components/avatar/types';

const PROP_COMBOS: AvatarProps[] = [
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
  },
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    children: <Badge variant='critical'>99+</Badge>,
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    children: <Badge variant='critical'>99+</Badge>,
  },
  {
    size: 'small',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    children: <div>DOG</div>,
  },
  {
    size: 'medium',
    imageProps: { alt: 'Dog', src: 'https://placedog.net/100x100?id=144' },
    children: <div>DOG</div>,
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
  },
  {
    size: 'small',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
    fallbackProps: {
      children: (
        <Icon>
          <PlaceholderIcon />
        </Icon>
      ),
    },
  },
  {
    size: 'medium',
    imageProps: { alt: 'User icon', src: 'http://broken-url.com/avatar.jpg' },
    fallbackProps: {
      children: (
        <Icon>
          <PlaceholderIcon />
        </Icon>
      ),
    },
  },
];

function PropCombos() {
  return PROP_COMBOS.map((props, k) => {
    return (
      <BentoItem key={k}>
        <Avatar {...props} />
      </BentoItem>
    );
  });
}

export function AvatarExampleServer() {
  return (
    <>
      <PropCombos />
    </>
  );
}
