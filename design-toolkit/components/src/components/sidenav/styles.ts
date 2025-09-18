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

export const SidenavStyles = tv({
  slots: {
    sidenav: [
      'group/sidenav fg-a11y-on-accent absolute left-0 row-span-full flex h-full flex-col gap-xs bg-surface-default p-m',
      'closed:items-center',
      'group-data-[push~=left]/layout:relative',
    ],
    content: 'flex h-full max-h-full flex-col gap-xs overflow-y-auto',
    header: 'mb-m flex justify-center',
    avatar: [
      'grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-m [grid-template-areas:"icon_heading"_"icon_text"] group-closed/sidenav:flex',
    ],
    avatarIcon: '[grid-area:icon]',
    avatarHeading: 'fg-primary-bold text-body-m [grid-area:heading]',
    avatarText:
      'fg-primary-muted grow-1 text-left text-body-s [grid-area:text]',
    toggle: [
      'flex cursor-pointer items-center gap-s rounded-medium p-xs group-open/sidenav:px-s',
      'enabled:hover:bg-interactive-muted-hover',
      'enabled:focus-visible:bg-interactive-muted-hover enabled:focus-visible:outline-none',
      'enabled:pressed:bg-interactive-muted-pressed',
    ],
    divider:
      'my-s h-[1px] w-full shrink-0 grow-0 border-0 bg-[var(--outline-static)]',
    heading: 'text-body-xs uppercase',
    item: [
      'group/item flex w-full cursor-pointer items-center gap-s rounded-medium p-xs text-body-m',
      'group-open/sidenav:px-s',
      'enabled:hover:bg-interactive-muted-hover',
      'enabled:focus-visible:bg-interactive-muted-hover enabled:focus-visible:outline-none',
      'enabled:pressed:bg-accent-primary-pressed',
      'enabled:selected:bg-accent-primary-bold',
      'enabled:selected:hover:bg-accent-primary-hover',
      'enabled:selected:focus-visible:bg-accent-primary-hover',
      'enabled:selected:pressed:bg-accent-primary-pressed',
      'disabled:fg-disabled disabled:cursor-not-allowed',
    ],
    text: 'grow-1 text-left text-body-s',
    transient: 'group-closed/sidenav:hidden',
    link: [
      'group/link flex w-full cursor-pointer items-center gap-s rounded-medium p-xs text-body-m',
      'group-open/sidenav:w-full',
      'enabled:hover:bg-interactive-muted-hover',
      'enabled:focus-visible:bg-interactive-muted-hover enabled:focus-visible:outline-none',
      'enabled:pressed:bg-accent-primary-pressed',
      'disabled:fg-disabled disabled:cursor-not-allowed',
    ],
    tooltip: [
      'absolute flex items-center gap-s whitespace-nowrap text-body-s',
      'group-disabled/item:fg-disabled group-disabled/link:fg-disabled',
    ],
  },
});
