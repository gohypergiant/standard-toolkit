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

import { type VariantProps, tv } from 'tailwind-variants';

export const TabListStylesDefaults = {
  variant: 'default',
} as const;

export const TabStyles = tv({
  slots: {
    list: ['flex orientation-horizontal:flex-row flex-col'],
    tabs: 'group flex w-content flex-row orientation-horizontal:flex-col',
    tab: [
      'fg-default-dark cursor-pointer p-s outline-none',
      'rounded-medium group-orientation-horizontal:rounded-small group-orientation-horizontal:rounded-b-none',
      'group-orientation-horizontal:border-static-light group-orientation-horizontal:border-b',
      'group-orientation-vertical:border group-orientation-vertical:border-transparent',

      'selected:fg-highlight selected:bg-highlight-subtle selected:group-orientation-horizontal:border-highlight',
      'hover:fg-default-light hover:group-orientation-horizontal:border-interactive-hover',
      'focus:fg-default-light focus:group-orientation-horizontal:border-interactive-hover',
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-orientation-horizontal:border-interactive-disabled',

      'selected:hover:fg-highlight selected:hover:group-orientation-horizontal:border-highlight',
      'selected:focus:fg-highlight selected:focus:group-orientation-horizontal:border-interactive-hover selected:focus:group-orientation-vertical:border-interactive-hover',
      'disabled:selected:fg-disabled disabled:bg-interactive-disabled disabled:selected:group-orientation-horizontal:border-interactive-disabled',
    ],
    panel:
      'fg-default-light p-s group-orientation-vertical:pt-0 group-orientation-horizontal:pl-0',
  },
  variants: {
    variant: {
      icons: {
        list: '[&>*]:p-xs orientation-horizontal:[&>*]:pr-s orientation-horizontal:[&>*]:pl-s [&>*]:leading-[0]',
      },
      default: {
        list: '[&>*]:p-s [&>*]:text-header-m',
      },
    },
  },
  defaultVariants: TabListStylesDefaults,
});

export type TabStyleVariants = VariantProps<typeof TabStyles>;
