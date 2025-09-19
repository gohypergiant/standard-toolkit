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

export const DrawerStyles = tv({
  slots: {
    layout: [
      //properties
      '[--drawer-main-row-start:1]', //top overlay
      'data-[push~=top]:[--drawer-main-row-start:2]',
      '[--drawer-main-row-end:4]', //bottom overlay
      'data-[push~=bottom]:[--drawer-main-row-end:3]',
      '[--drawer-main-col-start:1]', //left overlay
      // biome-ignore lint/style/noUnusedTemplateLiteral: This is necessary to properly evaulate \/
      `data-[push~=left]:[--drawer-main-col-start:2] has-[.group\\/sidenav]:[--drawer-main-col-start:2]`,
      '[--drawer-main-col-end:4]', //right overlay
      'data-[push~=right]:[--drawer-main-col-end:3]',

      '[--drawer-menu-size:40px]',
      '[--drawer-size-small:100px]',
      '[--drawer-size-medium:200px]',
      '[--drawer-size-large:400px]',

      //Grid template definitions
      '[--route-layout-grid-cols:auto_1fr_auto]',
      '[--route-layout-grid-rows:auto_1fr_auto]',
      '[--drawer-main-cols:var(--drawer-main-col-start)/var(--drawer-main-col-end)]',
      '[--drawer-main-rows:var(--drawer-main-row-start)/var(--drawer-main-row-end)]',

      //container
      'group/layout relative top-[var(--classification-banner-height)]',
      'grid grid-cols-[var(--route-layout-grid-cols)] grid-rows-[var(--route-layout-grid-rows)]',
      'transition-[grid-template-columns,grid-template-rows]',
      'h-full max-h-full w-full',
    ],
    main: 'relative col-[var(--drawer-main-cols)] row-[var(--drawer-main-rows)]',
    drawer: [
      'group/drawer',
      'bg-surface-default text-body-m',
      'relative flex h-full min-h-0 flex-col',
      'pointer-events-none [&>*]:pointer-events-auto',

      //Base positioning
      'placement-top:col-start-2 placement-top:col-end-3 placement-top:row-start-1 placement-top:row-end-2',
      'placement-bottom:col-start-2 placement-bottom:col-end-3 placement-bottom:row-start-3 placement-bottom:row-end-4',
      'placement-left:col-start-1 placement-left:col-end-2 placement-left:row-start-2 placement-left:row-end-3',
      'placement-right:col-start-3 placement-right:col-end-4 placement-right:row-start-2 placement-right:row-end-3',

      //Extend positioning
      'group-data-[extend~=top]/layout:placement-top:col-span-full',
      'group-data-[extend~=bottom]/layout:placement-bottom:col-span-full',
      'group-data-[extend~=left]/layout:placement-left:row-span-full',
      'group-data-[extend~=right]/layout:placement-right:row-span-full',

      //Extend fitment
      'group-data-[extend=top]/layout:placement-left:row-end-4 group-data-[extend=top]/layout:placement-right:row-end-4',
      'group-data-[extend=bottom]/layout:placement-left:row-start-1 group-data-[extend=bottom]/layout:placement-right:row-start-1',
      'group-data-[extend=left]/layout:placement-bottom:col-end-4 group-data-[extend=left]/layout:placement-top:col-end-4',
      'group-data-[extend=right]/layout:placement-bottom:col-start-1 group-data-[extend=right]/layout:placement-top:col-start-1',
    ],
    panel: [
      'hidden h-full min-h-0 flex-col gap-s p-l',
      'group-open/drawer:flex',
      'group-placement-left/drawer:group-size-large/drawer:w-[var(--drawer-size-large)] group-placement-left/drawer:group-size-medium/drawer:w-[var(--drawer-size-medium)] group-placement-left/drawer:group-size-small/drawer:w-[var(--drawer-size-small)]',
      'group-placement-right/drawer:group-size-large/drawer:w-[var(--drawer-size-large)] group-placement-right/drawer:group-size-medium/drawer:w-[var(--drawer-size-medium)] group-placement-right/drawer:group-size-small/drawer:w-[var(--drawer-size-small)]',
      'group-placement-top/drawer:group-size-large/drawer:h-[var(--drawer-size-large)] group-placement-top/drawer:group-size-medium/drawer:h-[var(--drawer-size-medium)] group-placement-top/drawer:group-size-small/drawer:h-[var(--drawer-size-small)]',
      'group-placement-bottom/drawer:group-size-large/drawer:h-[var(--drawer-size-large)] group-placement-bottom/drawer:group-size-medium/drawer:h-[var(--drawer-size-medium)] group-placement-bottom/drawer:group-size-small/drawer:h-[var(--drawer-size-small)]',
    ],
    view: 'flex h-full flex-col',
    content: [
      'fg-primary-bold flex max-h-full flex-1 flex-col overflow-y-auto',
    ],
    header: ['mb-s flex flex-row items-center justify-between pt-px pr-px'],
    footer: 'fg-primary-bold mt-s flex flex-row items-center justify-end',
  },
});

export const DrawerTitleStylesDefaults = {
  level: 2,
} as const;

export const DrawerTitleStyles = tv({
  base: 'fg-primary-bold w-full',
  variants: {
    level: {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
    },
  },
  compoundVariants: [
    {
      level: [1, 2, 3],
      className: 'text-header-l',
    },
    {
      level: [4, 5, 6],
      className: 'text-header-m',
    },
  ],
  defaultVariants: DrawerTitleStylesDefaults,
});

export const DrawerMenuStylesDefaults = {
  position: 'center',
} as const;

export const DrawerMenuStyles = tv({
  slots: {
    menu: [
      'absolute flex rounded-large bg-surface-default p-s',

      //horizontal
      'group-placement-top/drawer:transform-[translateX(-50%)] group-placement-top/drawer:left-[50%] group-placement-top/drawer:h-[var(--drawer-menu-size)] group-placement-top/drawer:flex-row',
      'group-placement-bottom/drawer:transform-[translateX(-50%)] group-placement-bottom/drawer:left-[50%] group-placement-bottom/drawer:h-[var(--drawer-menu-size)] group-placement-bottom/drawer:flex-row',
      'group-placement-bottom/drawer:-translate-y-[var(--drawer-menu-size)] group-placement-bottom/drawer:rounded-b-none',
      'group-placement-top/drawer:bottom-0 group-placement-top/drawer:translate-y-[var(--drawer-menu-size)] group-placement-top/drawer:rounded-t-none',
      //vertical
      'group-placement-left/drawer:left-full group-placement-left/drawer:rounded-l-none',
      'group-placement-left/drawer:w-[var(--drawer-menu-size)] group-placement-left/drawer:flex-col group-placement-left/drawer:items-center',
      'group-placement-right/drawer:-left-[var(--drawer-menu-size)] group-placement-right/drawer:rounded-r-none',
      'group-placement-right/drawer:w-[var(--drawer-menu-size)] group-placement-right/drawer:flex-col group-placement-right/drawer:items-center',
    ],
    item: [
      'flex flex-col items-center justify-center',
      'sudo:fg-primary-muted !p-xs cursor-pointer outline-none',
      'rounded-medium',
      //hover
      'sudo:hover:fg-primary-bold hover:!bg-transparent',
      //selected
      'selected:fg-accent-primary-bold selected:bg-accent-primary-muted',
      //focused
      'focus:fg-primary-bold',
      //disabled
      'disabled:fg-disabled disabled:cursor-not-allowed',
    ],
  },
  variants: {
    position: {
      start: {
        menu: [
          'group-placement-left/drawer:-translate-y-1/2 group-placement-left/drawer:top-1/8',
          'group-placement-right/drawer:-translate-y-1/2 group-placement-right/drawer:top-1/8',
          'group-placement-top/drawer:left-1/8 group-placement-top/drawer:translate-x-1/4',
          'group-placement-bottom/drawer:left-1/8 group-placement-bottom/drawer:translate-x-1/4',
        ],
      },
      center: {
        menu: [
          'group-placement-left/drawer:-translate-y-1/2 group-placement-left/drawer:top-1/2',
          'group-placement-right/drawer:-translate-y-1/2 group-placement-right/drawer:top-1/2',
          'group-placement-top/drawer:-translate-x-1/8 group-placement-top/drawer:left-1/2',
          'group-placement-bottom/drawer:-translate-x-1/8 group-placement-bottom/drawer:left-1/2',
        ],
      },
      end: {
        menu: [
          'group-placement-left/drawer:-translate-y-7/2 group-placement-left/drawer:top-7/8',
          'group-placement-right/drawer:-translate-y-7/8 group-placement-right/drawer:top-7/8',
          'group-placement-top/drawer:-translate-x-1/2 group-placement-top/drawer:left-7/8',
          'group-placement-bottom/drawer:-translate-x-1/2 group-placement-bottom/drawer:left-7/8',
        ],
      },
    },
  },
  defaultVariants: DrawerMenuStylesDefaults,
});
