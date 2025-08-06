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

import type { ReactElement } from 'react';
import type {
  FullCombinator,
  FullField,
  FullOperator,
  Classnames as RQBClassnames,
  Field as RQBField,
  QueryBuilderProps as RQBProps,
  RuleGroupType as RQBRuleGroupType,
  ValueEditorProps,
} from 'react-querybuilder';
import type { LiteralUnion } from 'type-fest';

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
