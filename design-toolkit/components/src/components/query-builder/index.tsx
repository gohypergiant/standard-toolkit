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
import { Delete, Duplicate, LockFill } from '@accelint/icons';
import { createContext, useMemo } from 'react';
import {
  type ActionProps,
  type CombinatorSelectorProps,
  QueryBuilder as RQBBuilder,
} from 'react-querybuilder';
import { Button } from '../button';
import { Icon } from '../icon';
import { Label } from '../label';
import { Radio } from '../radio';
import { Tooltip } from '../tooltip';
import { ActionElement } from './action-element';
import {
  RuleGroup,
  RuleGroupFooterComponent,
  RuleGroupHeaderComponent,
} from './group';
import { Rule } from './rule';
import { QueryBuilderStyles } from './styles';
import { getValidationResult } from './utils';
import { ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';
import type { QueryBuilderContextType, QueryBuilderProps } from './types';

const {
  queryBuilder,
  ruleGroup,
  header,
  combinators,
  cloneGroup,
  removeGroup,
  cloneRule,
  fields,
  value,
  addRule,
  addGroup,
  operators,
  valueListItem,
  valueSource,
  removeRule,
  valid,
  invalid,
  disabled,
  lockRule,
  lockGroup,
  body,
  rule,
} = QueryBuilderStyles();

const operatorDescriptions: Record<string, string> = {
  AND: 'All rules below must be true for a match',
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
      style={{flexWrap: 'nowrap'}}
    >
      <Label>Combinator</Label>
      {options.map((option) => (
        <Radio key={option.label} value={option.label}>
          <Tooltip.Trigger>
            <button type='button'>{option.label}</button>
            <Tooltip placement='top'>
              {operatorDescriptions[option.label]}
            </Tooltip>
          </Tooltip.Trigger>
        </Radio>
      ))}
    </Radio.Group>
  );
}

function RemoveRuleAction({ handleOnClick, className, ...rest }: ActionProps) {
  return (
    <Button
      size='small'
      variant='icon'
      onPress={() => handleOnClick()}
      className={className}
      {...rest}
    >
      <Icon>
        <Delete />
      </Icon>
    </Button>
  );
}

function LockAction({ handleOnClick, className, ...rest }: ActionProps) {
  return (
    <Button
      size='small'
      variant='icon'
      onPress={() => handleOnClick()}
      className={className}
      {...rest}
    >
      <Icon>
        <LockFill />
      </Icon>
    </Button>
  );
}

function CloneAction({ handleOnClick, className, ...rest }: ActionProps) {
  return (
    <Button
      size='small'
      variant='icon'
      onPress={() => handleOnClick()}
      className={className}
      {...rest}
    >
      <Icon>
        <Duplicate />
      </Icon>
    </Button>
  );
}

/**
 * QueryBuilder - A visual interface for building complex database queries
 *
 * Provides an intuitive drag-and-drop interface for constructing database queries
 * with support for multiple conditions, operators, and logical grouping. Enables
 * users to build complex filters without writing SQL or code.
 *
 * @example
 * // Basic query builder
 * <QueryBuilder
 *   fields={[
 *     // { name, label, type, inputType, operators },
 *   ]}
 *   query={
 *     // { combinator, rules }
 *   }
 *   onQueryChange={handleQueryChange}
 *   controlElements={{
 *     addRuleAction: CustomAddButton,
 *     removeRuleAction: CustomRemoveButton
 *   }}
 *   orientation="vertical"
 * />
 */
export function QueryBuilder({
  controlClassnames,
  controlElements,
  orientation = 'horizontal',
  showRuleLines = true,
  ...rest
}: QueryBuilderProps) {
  /**
   * Represents the list of available controls that the component can use as a custom
   * component override.Passed in as a map of our custom defaults, but can be
   * overridden by using the controlElements prop
   */
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

  /**
   * Represents the list of available classnames that the component will recognize.
   * Passed in as a map as all the default styling, but can be overridden by using the
   * controlClassnames prop
   */
  const mergedClassnames = useMemo(() => {
    return {
      queryBuilder: queryBuilder(),
      ruleGroup: ruleGroup(),
      header: header(),
      combinators: combinators(),
      fields: fields(),
      operators: operators(),
      value: value(),
      valueListItem: valueListItem(),
      valueSource: valueSource(),
      cloneGroup: cloneGroup(),
      cloneRule: cloneRule(),
      lockGroup: lockGroup(),
      lockRule: lockRule(),
      disabled: disabled(),
      valid: valid(),
      invalid: invalid(),
      removeRule: removeRule(),
      addRule: addRule(),
      addGroup: addGroup(),
      removeGroup: removeGroup(),
      rule: rule({ variant: orientation }),
      body: body({ showRuleLines: showRuleLines }),
      ...controlClassnames,
    };
  }, [controlClassnames, showRuleLines, orientation]);

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

QueryBuilder.CombinatorSelector = CombinatorSelector;
QueryBuilder.RemoveRuleAction = RemoveRuleAction;
QueryBuilder.LockAction = LockAction;
QueryBuilder.CloneAction = CloneAction;
QueryBuilder.ActionElement = ActionElement;
QueryBuilder.Rule = Rule;
QueryBuilder.RuleGroup = RuleGroup;
QueryBuilder.RuleGroupHeaderComponent = RuleGroupHeaderComponent;
QueryBuilder.RuleGroupFooterComponent = RuleGroupFooterComponent;
QueryBuilder.getValidationResult = getValidationResult;
QueryBuilder.ValueEditor = ValueEditor;
QueryBuilder.ValueSelector = ValueSelector;
