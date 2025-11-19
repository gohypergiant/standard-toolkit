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
import { clsx } from 'clsx';
import { createContext, useMemo } from 'react';
import { QueryBuilder as RQBBuilder } from 'react-querybuilder';
import { ActionElement } from './action-element';
import { CloneAction, LockAction, RemoveRuleAction } from './actions';
import { CombinatorSelector } from './combinator-selector';
import { Rule } from './rule';
import { RuleGroup } from './rule-group';
import styles from './styles.module.css';
import { ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';
import type { QueryBuilderContextType, QueryBuilderProps } from './types';

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
      queryBuilder: styles.queryBuilder,
      ruleGroup: clsx('group', styles.ruleGroup),
      header: styles.header,
      combinators: styles.combinators,
      fields: styles.fields,
      operators: '',
      value: styles.value,
      valueListItem: '',
      valueSource: '',
      cloneGroup: styles.cloneGroup,
      cloneRule: styles.cloneRule,
      lockGroup: styles.lockGroup,
      lockRule: styles.lockRule,
      disabled: '',
      valid: '',
      invalid: '',
      removeRule: '',
      addRule: '',
      addGroup: '',
      removeGroup: '',
      rule: clsx(styles.rule, styles[orientation]),
      body: clsx(
        'group',
        styles.body,
        showRuleLines && styles.showRuleLines,
        !showRuleLines && styles.hideRuleLines,
      ),
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
