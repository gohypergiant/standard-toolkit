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

export const TabStyles = tv({
  slots: {
    tabs: [
      'group/tabs flex w-content',
      'orientation-horizontal:flex-col',
      'orientation-vertical:flex-row',
    ],
    list: [
      'flex',
      'orientation-horizontal:flex-row',
      'orientation-vertical:flex-col',
    ],
    tab: [
      'fg-primary-muted relative cursor-pointer rounded-small p-s',
      'group-orientation-horizontal/tabs:rounded-b-none',
      'group-orientation-horizontal/tabs:after:absolute group-orientation-horizontal/tabs:after:bottom-0 group-orientation-horizontal/tabs:after:left-0 group-orientation-horizontal/tabs:after:block group-orientation-horizontal/tabs:after:h-[1px] group-orientation-horizontal/tabs:after:w-full group-orientation-horizontal/tabs:after:bg-[color:var(--outline-static)]',

      'enabled:hover:fg-primary-bold',
      'enabled:hover:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-interactive-hover)]',

      'enabled:focus:fg-primary-bold',
      'enabled:focus:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-accent-primary-bold)]',

      'enabled:pressed:fg-pressed',
      'enabled:pressed:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-interactive-pressed)]',

      'enabled:selected:fg-accent-primary-bold enabled:selected:bg-accent-primary-muted',
      'enabled:selected:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-accent-primary-bold)]',

      'enabled:selected:hover:fg-accent-primary-hover enabled:selected:hover:bg-accent-primary-hover',
      'enabled:selected:hover:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-accent-primary-hover)]',

      'enabled:selected:focus-visible:fg-accent-primary-hover enabled:selected:focus-visible:bg-accent-primary-hover',
      'enabled:selected:focus-visible:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-accent-primary-hover)]',

      'enabled:selected:pressed:fg-accent-primary-pressed enabled:selected:pressed:bg-interactive-muted-pressed',
      'enabled:selected:pressed:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-accent-primary-pressed)]',

      'disabled:fg-disabled disabled:cursor-not-allowed',
      'disabled:selected:bg-interactive-disabled',
      'disabled:group-orientation-horizontal/tabs:after:bg-[color:var(--outline-interactive-disabled)]',
    ],
    panel: 'fg-primary-bold p-s',
  },
});
