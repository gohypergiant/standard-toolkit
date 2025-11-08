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

export const QueryBuilderStylesDefaults = {} as const;

export const QueryBuilderStyles = tv({
  slots: {
    queryBuilder: 'outline outline-transparent',
    ruleGroup:
      'group col-span-full flex flex-col gap-s rounded-medium p-s outline outline-info-bold',
    header: 'flex gap-s',
    body: 'group grid gap-x-s empty:hidden',
    combinators: 'my-s',
    addRule: '',
    addGroup: '',
    cloneRule: 'fg-info-bold hover:fg-info-hover',
    cloneGroup: 'fg-info-bold hover:fg-info-hover',
    removeGroup: '',
    rule: 'flex gap-xs py-s',
    fields: 'w-full',
    operators: '',
    value: 'w-full',
    removeRule: '',
    valid: '',
    invalid: '',
    disabled: '',
    lockRule: 'fg-info-bold hover:fg-info-hover',
    lockGroup: 'fg-info-bold hover:fg-info-hover',
    valueSource: '',
    valueListItem: '',
  },
  variants: {
    variant: {
      horizontal: {
        rule: 'min-h-[50px]',
      },
      vertical: {
        rule: 'flex-col',
      },
    },
    showRuleLines: {
      true: { body: 'grid-cols-[10px_minmax(100px,_1fr)_min-content]' },
      false: { body: 'grid-cols-[minmax(100px,_1fr)_min-content]' },
    },
  },
  defaultVariants: QueryBuilderStylesDefaults,
});

export const RuleStyles = tv({
  slots: {
    lines: 'min-h-[46px] w-[20px]',
  },
});
