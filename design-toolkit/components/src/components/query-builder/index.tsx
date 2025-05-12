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

import { Duplicate, LockFill } from '@accelint/icons';
import { Delete } from '@accelint/icons';
import type { PressEvent } from '@react-types/shared';
import { createContext, useCallback, useMemo } from 'react';
import {
  type ActionProps,
  type Classnames,
  type CombinatorSelectorProps,
  QueryBuilder as RQBBuilder,
} from 'react-querybuilder';
import { cn } from '../../lib/utils';
import { IconButton } from '../icon-button';
import { Label } from '../label';
import { Radio } from '../radio';
import { Tooltip } from '../tooltip';
import './querybuilder.css';
import { Icon } from '../icon';
import { ActionElement } from './action-element';
import { RuleGroup } from './group';
import { Rule } from './rule';
import type { QueryBuilderContextType, QueryBuilderProps } from './types';
import { pressToMouseEvent } from './utils';
import { ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';

// TODO: make these tooltips configurable?
const operatorDescriptions: Record<string, string> = {
  // biome-ignore lint/style/useNamingConvention: set by the library
  AND: 'All rules below must be true for a match',
  // biome-ignore lint/style/useNamingConvention: set by the library
  OR: 'One of the rules below must be true for a match',
};

function CombinatorSelector({
  options,
  value,
  handleOnChange,
}: CombinatorSelectorProps) {
  return (
    <Radio.Group
      value={value}
      onChange={handleOnChange}
      orientation='horizontal'
    >
      <Label>Combinator</Label>
      {options.map((option) => (
        <Radio key={option.label} value={option.label}>
          <Tooltip>
            <Tooltip.Trigger>
              <span>{option.label}</span>
            </Tooltip.Trigger>
            <Tooltip.Body placement='top'>
              {operatorDescriptions[option.label]}
            </Tooltip.Body>
          </Tooltip>
        </Radio>
      ))}
    </Radio.Group>
  );
}

function RemoveRuleAction({ handleOnClick, className, ...rest }: ActionProps) {
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  return (
    <IconButton
      size='small'
      onPress={handlePress}
      className={className}
      {...rest}
    >
      <Icon>
        <Delete />
      </Icon>
    </IconButton>
  );
}

function LockAction({ handleOnClick, className, ...rest }: ActionProps) {
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  return (
    <IconButton
      size={'small'}
      onPress={handlePress}
      className={className}
      {...rest}
    >
      <Icon>
        <LockFill />
      </Icon>
    </IconButton>
  );
}

function CloneAction({ handleOnClick, className, ...rest }: ActionProps) {
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  return (
    <IconButton
      size={'small'}
      onPress={handlePress}
      className={className}
      {...rest}
    >
      <Icon>
        <Duplicate />
      </Icon>
    </IconButton>
  );
}

// TODO: add docs notes, etc for the classname override
export function QueryBuilder({
  controlClassnames,
  controlElements,
  orientation = 'horizontal',
  showRuleLines = true,
  ...rest
}: QueryBuilderProps) {
  const mergedElements = useMemo(
    () => ({
      combinatorSelector: CombinatorSelector,
      cloneGroupAction: CloneAction,
      cloneRuleAction: CloneAction,
      removeRuleAction: RemoveRuleAction,
      lockGroupAction: LockAction,
      lockRuleAction: LockAction,
      ruleGroup: RuleGroup,
      rule: Rule,
      actionElement: ActionElement,
      valueSelector: ValueSelector,
      valueEditor: ValueEditor,
      ...controlElements,
    }),
    [controlElements],
  );

  const defaultClassnames: Partial<Classnames> = useMemo(
    () => ({
      queryBuilder: 'border border-transparent',
      ruleGroup:
        'group col-span-full flex flex-col gap-s p-s border border-info rounded-medium',
      header: 'flex gap-s',
      body: cn(
        'group grid gap-x-s empty:hidden',
        showRuleLines
          ? 'grid-cols-[10px_minmax(100px,_1fr)_min-content]'
          : 'grid-cols-[minmax(100px,_1fr)_min-content]',
      ),
      combinators: 'my-s',
      addRule: '',
      addGroup: '',
      cloneRule: 'fg-interactive hover:fg-interactive-hover',
      cloneGroup: 'fg-interactive hover:fg-interactive-hover',
      removeGroup: 'ruleGroup-remove',
      rule: cn(
        'flex items-center gap-xs py-s',
        orientation === 'vertical' && 'flex-col',
      ),
      fields: 'rule-fields w-full',
      operators: 'rule-operators',
      value: 'rule-value',
      removeRule: 'rule-remove',
      valid: 'queryBuilder-valid',
      invalid: 'queryBuilder-invalid',
      disabled: 'queryBuilder-disabled',
      lockRule: 'fg-interactive hover:fg-interactive-hover',
      lockGroup: 'fg-interactive hover:fg-interactive-hover',
      valueSource: 'rule-valueSource',
      valueListItem: 'rule-value-list-item',
    }),
    [orientation, showRuleLines],
  );

  const mergedClassnames = useMemo(() => {
    return {
      ...defaultClassnames,
      ...controlClassnames,
    };
  }, [controlClassnames, defaultClassnames]);

  const QueryBuilderContext = createContext<QueryBuilderContextType>({
    orientation,
    showRuleLines,
  });

  return (
    <RQBBuilder
      showNotToggle={false}
      showShiftActions={false}
      enableDragAndDrop={false}
      controlClassnames={mergedClassnames}
      controlElements={mergedElements}
      context={QueryBuilderContext}
      listsAsArrays
      {...rest}
    />
  );
}
