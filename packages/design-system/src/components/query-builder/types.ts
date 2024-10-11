import type { ComponentType, ReactElement } from 'react';
import type {
  QueryBuilderProps as RQBProps,
  FullField,
  FullOperator,
  FullCombinator,
  ActionProps as RQBActionProps,
  RuleGroupProps,
  RuleGroupType,
  ValueEditorProps,
  useRuleGroup,
} from 'react-querybuilder';
import type { LiteralUnion, PartialDeep } from 'type-fest';
import type {
  AsType,
  RenderPropsChildren,
  OmitProtectedProps,
} from '../../types';
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
import type { TextAreaProps, TextAreaClassNames } from '../textarea/types';

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
   * Represents whether the rule or any of its parents are disabled
   *
   * RQB also uses this property when a rule is locked
   */
  isDisabled: boolean;
};

export type QueryBuilderRuleState = {
  /**
   * Represents whether the rule or any of its parents are disabled
   *
   * RQB also uses this property when a rule is locked
   */
  isDisabled: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
};
