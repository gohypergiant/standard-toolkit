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
  isClearable: false,
} as const;

export const InputStyles = tv({
  slots: {
    container:
      'group/input grid items-center [--length:attr(data-length_type(<number>),0)] [grid-template-columns:minmax(0,1fr)_min-content]',
    sizer: [
      '[grid-column:1/-1] [grid-row:1]',
      'font-display group-size-medium/input:text-body-s group-size-small/input:text-body-xs',
    ],
    input: [
      'block w-full rounded-medium py-xs pr-[calc(var(--room)+var(--spacing-s))] pl-s font-display text-default-light outline outline-interactive',
      'enabled:group-focus/input:outline-highlight',
      'enabled:group-hover/input:outline-interactive-hover',
      'enabled:group-invalid/input:outline-serious',
      'disabled:cursor-not-allowed disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
    ],
    clear: [
      '[grid-column:2/-1] [grid-row:1]',
      'group-size-medium/input:mr-xs group-size-small/input:mr-xxs',
      'enabled:fg-interactive enabled:bg-transparent',
      'enabled:focus:fg-interactive-hover enabled:focus:bg-transparent',
      'enabled:hover:fg-interactive-hover enabled:hover:bg-transparent',
      'group-empty/input:invisible',
      'group-not-empty/input:group-not-focus-within/input:invisible',
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
          '[appearance:textfield] placeholder:text-default-dark [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
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
    isClearable: {
      false: {
        container: '[--room:0px]',
      },
      true: {
        container: '[--room:20px]',
      },
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
          'group-size-medium/input:min-w-[80px] group-size-small/input:max-w-[200px]',
        ],
      },
    },
    {
      autoSize: true,
      type: ['number', 'text'],
      className: {
        sizer: [
          'group-size-medium/input:w-[calc((var(--length)*1ch)+((var(--length)-1)*var(--typography-body-s-spacing))+(var(--spacing-s)*2)+var(--room))]',
          'group-size-small/input:w-[calc((var(--length)*1ch)+((var(--length)-1)*var(--typography-body-xs-spacing))+(var(--spacing-s)*2)+var(--room))] group-size-small/input:min-w-[calc(2ch+((var(--length)-1)*var(--typography-body-xs-spacing))+(var(--spacing-s)*2)+var(--room))]',
        ],
      },
    },
  ],
  defaultVariants: InputStylesDefaults,
});
