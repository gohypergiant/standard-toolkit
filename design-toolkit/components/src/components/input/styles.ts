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
  isClearable: true,
  prefix: false,
  suffix: false,
  type: 'text',
} as const;

export const InputStyles = tv({
  slots: {
    container: [
      'group/input grid items-center gap-xs rounded-medium px-s py-xs font-display outline outline-interactive',
      '[--length:attr(data-length_type(<number>),0)] [grid-template-areas:"input_clear"]',
      'size-medium:text-body-s size-small:text-body-xs',
      'enabled:focus-visible-within:outline-accent-primary-bold',
      'enabled:hover:outline-interactive-hover',
      'enabled:pressed:outline-interactive-pressed',
      'enabled:invalid:outline-serious-bold',
      'disabled:cursor-not-allowed disabled:text-disabled disabled:outline-interactive-disabled disabled:placeholder:text-disabled',
    ],
    sizer: '[grid-area:input]',
    input: 'w-full outline-none',
    prefix: '[grid-area:prefix]',
    suffix: '',
    clear: [
      '-my-xs -mr-s invisible [grid-area:clear] group-focus-within/input:group-not-data-empty/input:visible',
    ],
  },
  variants: {
    autoSize: {
      false: '',
      true: '',
    },
    isClearable: {
      false: '',
      true: '',
    },
    prefix: {
      false: '',
      true: '',
    },
    suffix: {
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
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
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
    {
      autoSize: true,
      type: ['number', 'text'],
      className: {
        sizer: [
          'group-size-medium/input:w-[calc((var(--length)*1ch)+((var(--length)-1)*var(--typography-body-s-spacing)))]',
          'group-size-small/input:w-[calc((var(--length)*1ch)+((var(--length)-1)*var(--typography-body-xs-spacing)))] group-size-small/input:min-w-[calc(2ch+((var(--length)-1)*var(--typography-body-xs-spacing)))]',
        ],
      },
    },
    {
      isClearable: false,
      prefix: true,
      suffix: false,
      className: {
        container: '[grid-template-areas:"prefix_input"]',
      },
    },
    {
      isClearable: false,
      prefix: false,
      suffix: true,
      className: {
        container: '[grid-template-areas:"input_suffix"]',
      },
    },
    {
      isClearable: false,
      prefix: true,
      suffix: true,
      className: {
        container: '[grid-template-areas:"prefix_input_suffix"]',
      },
    },
    {
      isClearable: true,
      prefix: true,
      suffix: false,
      className: {
        container: '[grid-template-areas:"prefix_input_clear"]',
      },
    },
    {
      isClearable: true,
      prefix: false,
      suffix: true,
      className: {
        container: '[grid-template-areas:"input_suffix-1_suffix-2"]',
      },
    },
    {
      isClearable: true,
      prefix: true,
      suffix: true,
      className: {
        container: '[grid-template-areas:"prefix_input_suffix-1_suffix-2"]',
      },
    },
    {
      isClearable: true,
      suffix: true,
      className: {
        clear:
          '[grid-area:suffix-1] group-focus-within/input:group-not-data-empty/input:[grid-area:suffix-2]',
        suffix:
          '[grid-area:suffix-2] group-focus-within/input:group-not-data-empty/input:[grid-area:suffix-1]',
      },
    },
  ],
  defaultVariants: InputStylesDefaults,
});
