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

export const InputStylesDefaults = {
  autoSize: false,
  type: 'text',
} as const;

export const InputStyles = tv({
  slots: {
    container: [
      'group/input w-full',
      'size-medium:text-body-s size-small:text-body-xs',
    ],
    sizer: [
      'flex w-full items-center gap-xs rounded-medium py-xs pr-xs pl-s font-display outline outline-interactive',
      'enabled:group-focus-visible-within/input:outline-accent-primary-bold',
      'enabled:group-hover/input:outline-interactive-hover',
      'enabled:group-pressed/input:outline-interactive-pressed',
      'enabled:group-invalid/input:outline-serious-bold',
      'disabled:cursor-not-allowed disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
    ],
    input: [
      'fg-primary-bold min-w-0 flex-1 font-display outline-none',
      'disabled:cursor-not-allowed disabled:text-disabled disabled:placeholder:text-disabled',
    ],
    prefix: [
      'fg-primary-muted pointer-events-none',
      'group-disabled/input:text-disabled',
    ],
    suffix: [
      'fg-primary-muted pointer-events-none',
      'group-disabled/input:text-disabled',
    ],
    clear: [
      'hidden min-w-0 group-focus-within/input:group-not-data-empty/input:block',
      'enabled:fg-info-bold enabled:focus-visible:fg-info-hover enabled:hover:fg-info-hover',
      '-my-xs group-size-small/input:p-0!', // definitely a bit of a hack!
    ],
  },
  variants: {
    autoSize: {
      false: '',
      true: '',
    },
    type: {
      button: '',
      checkbox: '',
      color: '',
      date: '',
      'datetime-local': '',
      email: '',
      file: '',
      hidden: '',
      image: '',
      month: '',
      number: {
        input:
          'placeholder:fg-primary-muted [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      },
      password: '',
      radio: '',
      range: '',
      reset: '',
      search: '',
      submit: '',
      tel: '',
      text: '',
      time: '',
      url: '',
      week: '',
    },
  },
  compoundVariants: [
    {
      type: [
        'color',
        'date',
        'datetime-local',
        'email',
        'number',
        'password',
        'search',
        'tel',
        'text',
        'time',
        'url',
      ],
      className: {
        sizer: [
          'group-size-medium/input:min-w-[160px] group-size-medium/input:max-w-[400px]',
          'group-size-small/input:min-w-[80px] group-size-small/input:max-w-[200px]',
        ],
      },
    },
  ],
  defaultVariants: InputStylesDefaults,
});
