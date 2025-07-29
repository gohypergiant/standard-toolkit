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

import { tv } from '@/lib/utils';

export const BadgeStylesDefaults = {
  variant: 'info',
} as const;

export const BadgeStyles = tv({
  base: [
    'group/badge fg-default-light inline-flex items-center justify-center rounded-full px-xs text-body-xs outline empty:size-s empty:px-none',
    '[&[data-placement]]:absolute',
    'placement-top:-translate-y-1/2 placement-top:top-[attr(data-offset-y_px,0px)]',
    'placement-right:right-[attr(data-offset-x_px,0px)] placement-right:translate-x-1/2',
    'placement-bottom:bottom-[attr(data-offset-y_px,0px)] placement-bottom:translate-y-1/2',
    'placement-left:-translate-x-1/2 placement-left:left-[attr(data-offset-x_px,0px)]',
  ],
  variants: {
    variant: {
      info: 'bg-info-subtle outline-info-bold',
      advisory: 'bg-advisory-subtle outline-advisory-bold',
      normal: 'bg-normal-subtle outline-normal',
      serious: 'bg-serious-subtle outline-serious',
      critical: 'bg-critical-subtle outline-critical',
    },
  },
  defaultVariants: BadgeStylesDefaults,
});
