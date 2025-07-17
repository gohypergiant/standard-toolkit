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
import { Delete, Duplicate, LockFill } from '@accelint/icons';
import type { PressEvent } from '@react-types/shared';
import 'client-only';
import { type ReactElement, createContext, useCallback, useMemo } from 'react';
import {
  type ActionProps,
  type Classnames,
  type CombinatorSelectorProps,
  type FullCombinator,
  type FullField,
  type FullOperator,
  QueryBuilder as RQBBuilder,
  type Classnames as RQBClassnames,
  type Field as RQBField,
  type QueryBuilderProps as RQBProps,
  type RuleGroupType as RQBRuleGroupType,
  type ValueEditorProps,
} from 'react-querybuilder';
import type { LiteralUnion } from 'type-fest';
import { cn } from '../../lib/utils';
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
import { getValidationResult, pressToMouseEvent } from './utils';
import { ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';

export type RuleGroupType = RQBRuleGroupType;
export type Field = RQBField;

export type DefaultRQBProps = RQBProps<
  RuleGroupType,
  FullField,
  FullOperator,
  FullCombinator
>;

// TODO: need to add multiselect back in when we have a compatible component
export type QueryBuilderValueEditors = Record<
  LiteralUnion<
    Exclude<ValueEditorProps['type'], null | undefined | 'multiselect'>,
    string
  >,
  (props: ValueEditorProps) => ReactElement
>;

/**
 * Omitted props are currently unsupported functionality
 */
export type QueryBuilderProps = Partial<
  Omit<
    DefaultRQBProps,
    | 'showCombinatorsBetweenRules'
    | 'independentCombinators'
    | 'listsAsArrays'
    | 'enableDragAndDrop'
    | 'showNotToggle'
    | 'showShiftActions'
  > & {
    orientation?: 'horizontal' | 'vertical';
    showRuleLines?: boolean;
  }
>;

/**
 * Omitted classnames are for unsupported features
 */
export type ClassNames = Omit<
  RQBClassnames,
  | 'betweenRules'
  | 'branches'
  | 'dndDragging'
  | 'dndOver'
  | 'dndCopy'
  | 'dndGroup'
  | 'dragHandle'
  | 'shiftActions'
  | 'notToggle'
>;

export type QueryBuilderContextType = Pick<
  QueryBuilderProps,
  'showRuleLines' | 'orientation'
>;

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
    <Button
      size='small'
      variant='icon'
      onPress={handlePress}
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
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  return (
    <Button
      size='small'
      variant='icon'
      onPress={handlePress}
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
  // TODO: remove pressToMouseEvent when design-system is removed
  const handlePress = useCallback(
    (event: PressEvent) => handleOnClick(pressToMouseEvent(event)),
    [handleOnClick],
  );

  return (
    <Button
      size='small'
      variant='icon'
      onPress={handlePress}
      className={className}
      {...rest}
    >
      <Icon>
        <Duplicate />
      </Icon>
    </Button>
  );
}

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
      removeGroup: '',
      rule: cn(
        'flex gap-xs py-s',
        orientation === 'vertical'
          ? 'flex-col'
          : 'min-height-[50px] items-start',
      ),
      fields: 'w-full',
      operators: '',
      value: 'w-full',
      removeRule: '',
      valid: '',
      invalid: '',
      disabled: '',
      lockRule: 'fg-interactive hover:fg-interactive-hover',
      lockGroup: 'fg-interactive hover:fg-interactive-hover',
      valueSource: '',
      valueListItem: '',
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
