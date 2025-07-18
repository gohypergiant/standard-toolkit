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

import type { Orientation } from '@react-types/shared';
import type { ComponentType, ReactElement } from 'react';
import type {
  FullCombinator,
  FullField,
  FullOperator,
  ActionProps as RQBActionProps,
  QueryBuilderProps as RQBProps,
  RuleGroupProps,
  RuleGroupType,
  useRuleGroup,
  ValueEditorProps,
} from 'react-querybuilder';
import type { LiteralUnion, PartialDeep } from 'type-fest';
import type { AsType } from '../../types/generic';
import type { OmitProtectedProps } from '../../types/props';
import type { RenderPropsChildren } from '../../types/react-aria';
import type { ButtonClassNames, ButtonProps } from '../button/types';
import type {
  CheckboxClassNames,
  CheckboxRenderProps,
} from '../checkbox/types';
import type { InputClassNames, InputProps } from '../input/types';
import type { RadioClassNames } from '../radio/types';
import type {
  SelectClassNames,
  SelectProps,
  SelectRenderProps,
} from '../select/types';
import type { SwitchClassNames } from '../switch/types';
import type { TextAreaClassNames, TextAreaProps } from '../textarea/types';

type DefaultRQBProps = RQBProps<
  RuleGroupType,
  FullField,
  FullOperator,
  FullCombinator
>;

type SupportedClassNames = Pick<
  Exclude<DefaultRQBProps['controlClassnames'], undefined>,
  | 'addGroup'
  | 'addRule'
  | 'cloneGroup'
  | 'cloneRule'
  | 'dragHandle'
  | 'lockGroup'
  | 'lockRule'
  | 'removeGroup'
  | 'removeRule'
>;

export type QueryBuilderClassNames = PartialDeep<
  { [K in keyof SupportedClassNames]: string } & {
    queryBuilder: {
      container: string;
      queryBuilder: string;
    };
    group: {
      container: string;
      group: string;
      header: string;
      body: string;
      footer: string;
      add: string;
      clone: string;
      combinator: string;
      drag: string;
      lock: string;
      shift: string;
      remove: string;
      toggle: string;
    };
    rule: {
      container: string;
      rule: string;
      core: string;
      field: string;
      operator: string;
      source: string;
      values: string;
      value: string;
      add: string;
      clone: string;
      drag: string;
      lock: string;
      shift: string;
      remove: string;
      error: string;
    };
    button: ButtonClassNames;
    checkbox: CheckboxClassNames;
    input: InputClassNames;
    radio: RadioClassNames;
    select: SelectClassNames;
    switch: SwitchClassNames;
    textarea: TextAreaClassNames;
  }
>;

export type QueryBuilderSizes = 'sm' | 'lg';

export type QueryBuilderMapping = Partial<{
  button: Record<QueryBuilderSizes, OmitProtectedProps<ButtonProps>>;
  error: Record<QueryBuilderSizes, string>;
  input: Record<QueryBuilderSizes, OmitProtectedProps<InputProps>>;
  select: Record<QueryBuilderSizes, OmitProtectedProps<SelectProps<object>>>;
  textarea: Record<QueryBuilderSizes, OmitProtectedProps<TextAreaProps>>;
}>;

export type QueryBuilderValueEditors = Record<
  LiteralUnion<Exclude<ValueEditorProps['type'], null | undefined>, string>,
  (props: ValueEditorProps) => ReactElement
>;

export type RuleGroupElementsProps = RuleGroupProps &
  ReturnType<typeof useRuleGroup>;

// NOTE: https://github.com/react-querybuilder/react-querybuilder/issues/777
export type RuleGroupElements = {
  ruleGroupBodyElements: ComponentType<RuleGroupElementsProps>;
  ruleGroupFooterElements: ComponentType<RuleGroupElementsProps>;
  ruleGroupHeaderElements: ComponentType<RuleGroupElementsProps>;
};

type BaseQueryBuilderProps = {
  classNames?: QueryBuilderClassNames;
  consistentColumns?: boolean;
  controlElements?: DefaultRQBProps['controlElements'] &
    Partial<RuleGroupElements>;
  icons?: {
    checkbox?: RenderPropsChildren<CheckboxRenderProps>;
    select?: RenderPropsChildren<SelectRenderProps>;
  };
  mapping?: QueryBuilderMapping;
  orientation?: Orientation;
  showRuleLines?: boolean;
  size?: QueryBuilderSizes;
  valueEditors?: QueryBuilderValueEditors;
};

/**
 * Omitted props are currently unsupported functionality
 */
export type QueryBuilderProps = Partial<
  Omit<DefaultRQBProps, 'showCombinatorsBetweenRules' | 'listsAsArrays'> &
    BaseQueryBuilderProps
>;

export type ActionProps = AsType<RQBActionProps>;

export type QueryBuilderContextValue = BaseQueryBuilderProps &
  Required<Pick<BaseQueryBuilderProps, 'size'>> & {
    controlElements: RuleGroupElements;
  };

export type QueryBuilderState = {
  isDisabled: boolean;
};

export type QueryBuilderGroupState = {
  /**
   * Columns after the core 4 columns and before the remove rule column
   */
  after: number;
  /**
   * Columns before the core 4 columns
   */
  before: number;
  /**
   * Calculated based on enabled features
   */
  columns: number;
  /**
   * Orientation of core inputs
   */
  orientation: Orientation;
  /**
   * Represents whether the rule or any of its parents are disabled
   *
   * RQB also uses this property when a rule is locked
   */
  isDisabled: boolean;
};

export type QueryBuilderRuleState = {
  /**
   * Orientation of core inputs
   */
  orientation: Orientation;
  /**
   * Represents whether the rule or any of its parents are disabled
   *
   * RQB also uses this property when a rule is locked
   */
  isDisabled: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
};
