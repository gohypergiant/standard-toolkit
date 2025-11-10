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
'use client';

import 'client-only';
import { Label } from '../label';
import { Radio } from '../radio';
import { RadioGroup } from '../radio/group';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip/trigger';
import type { CombinatorSelectorProps } from 'react-querybuilder';

const operatorDescriptions: Record<string, string> = {
  AND: 'All rules below must be true for a match',
  OR: 'One of the rules below must be true for a match',
};

export function CombinatorSelector({
  options,
  value,
  handleOnChange,
}: CombinatorSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onChange={handleOnChange}
      orientation='horizontal'
      style={{ flexWrap: 'nowrap' }}
    >
      <Label>Combinator</Label>
      {options.map((option) => (
        <Radio key={option.label} value={option.label}>
          <TooltipTrigger>
            <button type='button'>{option.label}</button>
            <Tooltip placement='top'>
              {operatorDescriptions[option.label]}
            </Tooltip>
          </TooltipTrigger>
        </Radio>
      ))}
    </RadioGroup>
  );
}
