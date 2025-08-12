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

import { tv } from 'tailwind-variants';

export const DrawerStyles = tv({
  slots: {
    layout: [
      //properties
      '[--drawer-main-row-start:1]', //top overlay
      'data-[push~=top]:[--drawer-main-row-start:2]',
      '[--drawer-main-row-end:4]', //bottom overlay
      'data-[push~=bottom]:[--drawer-main-row-end:3]',
      '[--drawer-main-col-start:1]', //left overlay
      'data-[push~=left]:[--drawer-main-col-start:2]',
      '[--drawer-main-col-end:4]', //right overlay
      'data-[push~=right]:[--drawer-main-col-end:3]',

      '[--drawer-size-closed:0]',
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
    main: 'relative z-1 col-[var(--drawer-main-cols)] row-[var(--drawer-main-rows)]',
    drawer: [
      'group/drawer',
      'bg-surface-default text-body-m',
      'relative z-5 flex h-full min-h-0 flex-col',
      'pointer-events-none [&>*]:pointer-events-auto',
      'closed:[&>*:not(nav)]:hidden',

      //top
      'placement-top:col-start-2 placement-top:col-end-3 placement-top:row-start-1 placement-top:row-end-2',
      'group-data-[extend~=top]/layout:placement-top:z-10',
      'group-data-[extend~=top]/layout:placement-top:col-span-full',
      'group-data-[extend=left]/layout:placement-top:col-end-4',
      'group-data-[extend=right]/layout:placement-top:col-start-1',
      'placement-top:closed:h-[var(--drawer-size-closed)]',
      'placement-top:open:size-small:h-[var(--drawer-size-small)]',
      'placement-top:open:size-medium:h-[var(--drawer-size-medium)]',
      'placement-top:open:size-large:h-[var(--drawer-size-large)]',

      //bottom
      'placement-bottom:col-start-2 placement-bottom:col-end-3 placement-bottom:row-start-3 placement-bottom:row-end-4',
      'group-data-[extend=bottom]/layout:placement-bottom:z-10',
      'group-data-[extend~=bottom]/layout:placement-bottom:col-span-full',
      'group-data-[extend=left]/layout:placement-bottom:col-end-4',
      'group-data-[extend=right]/layout:placement-bottom:col-start-1',
      'placement-bottom:closed:h-[var(--drawer-size-closed)]',
      'placement-bottom:open:size-small:h-[var(--drawer-size-small)]',
      'placement-bottom:open:size-medium:h-[var(--drawer-size-medium)]',
      'placement-bottom:open:size-large:h-[var(--drawer-size-large)]',

      //left
      'placement-left:col-start-1 placement-left:col-end-2 placement-left:row-start-2 placement-left:row-end-3',
      'group-data-[extend=left]/layout:placement-left:z-10',
      'group-data-[extend=right]/layout:placement-left:z-1',
      'placement-left:closed:w-[var(--drawer-size-closed)]',
      'placement-left:open:size-small:w-[var(--drawer-size-small)]',
      'placement-left:open:size-medium:w-[var(--drawer-size-medium)]',
      'placement-left:open:size-large:w-[var(--drawer-size-large)]',
      'group-data-[extend~=left]/layout:placement-left:row-span-full',
      'group-data-[extend=top]/layout:placement-left:row-end-4',
      'group-data-[extend=bottom]/layout:placement-left:row-start-1',

      //right
      'placement-right:col-start-3 placement-right:col-end-4 placement-right:row-start-2 placement-right:row-end-3',
      'group-data-[extend=right]/layout:placement-right:z-10',
      'group-data-[extend=left]/layout:placement-right:z-1',
      'group-data-[extend~=right]/layout:placement-right:row-span-full',
      'group-data-[extend=top]/layout:placement-right:row-end-4',
      'group-data-[extend=bottom]/layout:placement-right:row-start-1',
      'placement-right:closed:w-[var(--drawer-size-closed)]',
      'placement-right:open:size-small:w-[var(--drawer-size-small)]',
      'placement-right:open:size-medium:w-[var(--drawer-size-medium)]',
      'placement-right:open:size-large:w-[var(--drawer-size-large)]',
    ],
    content: [
      'hidden h-full min-h-0 flex-col gap-s p-l group-open/drawer:flex',
    ],
    panel: [
      'flex max-h-full flex-1 flex-col overflow-y-auto text-default-light',
    ],
    header: ['mb-s flex flex-row items-center justify-between pt-px pr-px'],
    title: 'w-full text-default-light text-header-l',
    footer: 'mt-s flex flex-row items-center justify-end text-default-light',
  },
});

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
      'group-placement-right/drawer:-translate-y-1/8 group-placement-right/drawer:top-1/8',
      'group-placement-left/drawer:left-full group-placement-left/drawer:rounded-l-none',
      'group-placement-left/drawer:w-[var(--drawer-menu-size)] group-placement-left/drawer:flex-col group-placement-left/drawer:items-center',
      'group-placement-right/drawer:-left-[var(--drawer-menu-size)] group-placement-right/drawer:rounded-r-none',
      'group-placement-right/drawer:w-[var(--drawer-menu-size)] group-placement-right/drawer:flex-col group-placement-right/drawer:items-center',
    ],
    item: [
      'flex flex-col items-center justify-center',
      'fg-default-dark cursor-pointer p-s outline-none',
      'rounded-medium group-dtk-orientation-horizontal:rounded-small group-dtk-orientation-horizontal:rounded-b-none',
      'group-dtk-orientation-horizontal:border-static-light group-dtk-orientation-horizontal:border-b',
      'group-dtk-orientation-vertical:border group-dtk-orientation-vertical:border-transparent',
      //hover
      'hover:fg-default-light hover:!bg-transparent hover:group-dtk-orientation-horizontal:border-interactive-hover',
      //selected
      'selected:fg-highlight selected:bg-highlight-subtle selected:group-dtk-orientation-horizontal:border-highlight',
      //focused
      'focus:fg-default-light focus:group-dtk-orientation-horizontal:border-interactive-hover',
      //disabled
      'disabled:fg-disabled disabled:cursor-not-allowed disabled:group-dtk-orientation-horizontal:border-interactive-disabled',
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
      middle: {
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
});
