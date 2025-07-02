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
import type { VariantProps } from 'tailwind-variants';

export const DrawerStylesDefaults = {
  position: 'left',
  isDismissable: true,
  isKeyboardDismissDisabled: false,
} as const;

export const DrawerStyles = tv({
  slots: {
    overlay:
      'absolute top-0 left-0 z-50 flex h-full w-full items-stretch justify-start duration-300 ease-in-out',
    modal:
      'relative flex h-full flex-col bg-surface-default duration-300 ease-in-out text-body-m',
    dialog: 'flex flex-1 flex-col p-l text-body-m text-default-light',
    attachedTrigger:
      'absolute z-60 transition-transform duration-300 ease-in-out',
    header: 'mb-s flex flex-row items-center justify-between',
    footer: 'mt-s flex flex-row items-center justify-end',
    content: 'flex-1',
  },
  variants: {
    position: {
      left: {
        overlay: 'justify-start',
        modal: 'w-[400px]',
        attachedTrigger: '-translate-y-1/2 top-1/2',
      },
      right: {
        overlay: 'justify-end',
        modal: 'w-[400px]',
        attachedTrigger: '-translate-y-1/2 top-1/2',
      },
      top: {
        overlay: 'items-start justify-stretch',
        modal: 'h-[320px] w-full flex-row',
        attachedTrigger: '-translate-y-1/2 top-1/2',
      },
      bottom: {
        overlay: 'items-end justify-stretch',
        modal: 'h-[320px] w-full flex-row',
        attachedTrigger: '-translate-y-1/2 top-1/2',
      },
    },
    isDismissable: {
      true: {},
      false: {},
    },
    isKeyboardDismissDisabled: {
      true: {},
      false: {},
    },
    isOpen: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      position: 'left',
      isOpen: false,
      className: {
        attachedTrigger: 'left-0',
      },
    },
    {
      position: 'left',
      isOpen: true,
      className: {
        attachedTrigger: 'left-[400px]',
      },
    },
    {
      position: 'right',
      isOpen: false,
      className: {
        attachedTrigger: 'right-0',
      },
    },
    {
      position: 'right',
      isOpen: true,
      className: {
        attachedTrigger: 'right-[400px]',
      },
    },
  ],
  defaultVariants: DrawerStylesDefaults,
});

export type DrawerStyleVariants = VariantProps<typeof DrawerStyles>;
