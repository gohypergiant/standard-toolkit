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
      'group/sidenav',
      'z-5 flex h-screen flex-col gap-xs p-m',
      'fg-a11y-on-accent bg-surface-default',
      'group-[&:not([data-push])]/layout:open:absolute',
    ],
    header: 'flex justify-center group-closed/sidenav:mb-m',
    headerButton: 'p-0 size-medium:p-0 enabled:hover:color-info:bg-inherit',
    logoContainer: [
      'flex items-center text-left',
      'size-small:h-[35px] size-small:w-[35px] [&:not(.group/logo)]:hidden',
      'size-large:h-[49px] size-large:w-[200px] group-open/sidenav:gap-m',
    ],
    expanded: 'group-closed/sidenav:hidden',
    divider: 'my-s border-[var(--outline-static)] group-open/sidenav:hidden',
    title: 'mt-m mb-xs text-body-xs uppercase group-closed/sidenav:hidden',
  },
});

export const SidenavItemStyles = tv({
  slots: {
    item: [
      'flex w-full items-center px-s py-xs group-open/sidenav:gap-s',
      'enabled:color-info:hover:bg-accent-primary-hover',
      'disabled:color-info:hover:bg-interactive-disabled',
      'enabled:color-info:pressed:bg-accent-primary-pressed',
      'selected:color-info:pressed:bg-accent-primary-pressed',
      'enabled:color-info:selected:bg-accent-primary-bold',
      'selected:color-info:pressed:bg-accent-primary-pressed',
      'enabled:color-info:focus-visible:bg-accent-primary-hover',
    ],
    text: 'flex-1 text-left text-body-s group-closed/sidenav:hidden',
  },
});
