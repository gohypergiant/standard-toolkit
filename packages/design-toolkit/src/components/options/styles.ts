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

import { tv } from '@accelint/design-foundation/lib/utils';

export const OptionsStyles = tv({
  slots: {
    list: 'group/options max-h-[200px] overflow-y-auto overflow-x-clip rounded-medium bg-surface-overlay shadow-elevation-overlay outline outline-static',
    section: 'mt-s',
    header: 'fg-primary-muted m-xs my-s text-header-xs',
    item: [
      'group/options-item fg-primary-bold relative flex items-center gap-s p-s text-body-s outline outline-transparent',
      'group-size-small/options:pt-xs group-size-small/options:pb-xs',
      'group-size-large/options:pt-s group-size-large/options:pb-s',
      'before:pointer-events-none before:absolute before:top-0 before:left-0 before:h-full before:w-[4px]',
      'enabled:cursor-pointer',
      'enabled:hover:fg-a11y-on-accent',
      'enabled:focus-visible:fg-a11y-on-accent',
      // info
      'enabled:focus-visible:color-info:bg-accent-primary-muted',
      'enabled:hover:color-info:bg-accent-primary-muted',
      'enabled:pressed:color-info:bg-accent-primary-pressed',
      // info + selected
      'color-info:enabled:selected:bg-accent-primary-muted color-info:enabled:selected:before:bg-(--outline-accent-primary-bold)',
      'color-info:enabled:selected:hover:fg-a11y-on-accent color-info:enabled:selected:hover:bg-accent-primary-bold',
      'color-info:enabled:selected:focus-visible:bg-accent-primary-bold',
      'color-info:enabled:selected:pressed:fg-accent-primary-bold color-info:enabled:selected:pressed:bg-accent-primary-pressed color-info:enabled:selected:pressed:before:bg-(--outline-accent-primary-pressed)',
      //serious
      'enabled:hover:color-serious:bg-serious-muted',
      'enabled:focus-visible:color-serious:bg-serious-muted',
      'enabled:pressed:color-serious:bg-serious-pressed',
      // serious + selected
      'color-serious:enabled:selected:bg-serious-muted color-serious:enabled:selected:before:bg-(--outline-serious-bold)',
      'color-serious:enabled:selected:hover:bg-serious-bold color-serious:enabled:selected:hover:before:bg-(--outline-serious-hover)',
      'color-serious:enabled:selected:focus-visible:bg-serious-bold',
      'color-serious:enabled:selected:pressed:fg-serious-bold color-serious:enabled:selected:pressed:bg-serious-pressed color-serious:enabled:selected:pressed:before:bg-(--outline-serious-pressed)',
      // critical
      'enabled:hover:color-critical:bg-critical-muted',
      'enabled:pressed:color-critical:bg-critical-pressed',
      // critical + selected
      'color-critical:enabled:selected:bg-critical-muted color-critical:enabled:selected:before:bg-(--outline-critical-bold)',
      'color-critical:enabled:selected:hover:bg-critical-bold',
      'color-critical:enabled:selected:focus-visible:bg-critical-bold',
      'color-critical:enabled:selected:pressed:fg-critical-bold color-critical:enabled:selected:pressed:bg-critical-pressed color-critical:enabled:selected:pressed:before:bg-(--outline-critical-pressed)',
      // disabled
      'disabled:cursor-not-allowed disabled:bg-transparent',
      'disabled:selected:bg-interactive-disabled disabled:before:bg-(--outline-interactive)',
    ],
    content: 'flex min-w-0 flex-auto flex-col gap-xxs',
    icon: [
      'group-enabled/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      // serious
      'group-enabled/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      // critical
      'group-enabled/options-item:group-color-critical/options-item:fg-critical-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      // disabled
      'group-disabled/options-item:fg-disabled',
    ],
    label: [
      'truncate',
      // info
      'group-enabled/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-primary-bold',
      'group-enabled/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-info/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      // serious
      'group-enabled/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      // critical
      'group-enabled/options-item:group-color-critical/options-item:fg-critical-bold',
      'group-enabled/options-item:group-hover/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      // disabled
      'group-disabled/options-item:fg-disabled',
    ],
    description: [
      'group-enabled/options-item:fg-primary-muted truncate text-body-xs',
      'group-enabled/options-item:group-hover/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:fg-primary-bold',
      // info
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-info/options-item:fg-accent-primary-bold',
      // serious
      'group-enabled/options-item:group-hover/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-serious/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-serious/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-serious/options-item:fg-serious-bold',
      // critical
      'group-enabled/options-item:group-hover/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-color-critical/options-item:fg-primary-bold',
      'group-enabled/options-item:group-selected/options-item:group-hover/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-selected/options-item:group-focus-visible/options-item:group-color-critical/options-item:fg-a11y-on-accent',
      'group-enabled/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      'group-enabled/options-item:group-selected/options-item:group-pressed/options-item:group-color-critical/options-item:fg-critical-bold',
      // disabled
      'group-disabled/options-item:fg-disabled',
    ],
  },
});
