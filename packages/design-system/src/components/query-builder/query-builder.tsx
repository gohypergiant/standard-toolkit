import { useMemo } from 'react';
import { Provider } from 'react-aria-components';
import { QueryBuilder as RQBuilder } from 'react-querybuilder';
import { useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { inlineVars, mergeClassNames } from '../../utils';
import { ButtonContext, type ButtonProps } from '../button';
import { CheckboxContext, type CheckboxProps } from '../checkbox';
import { InputContext, type InputProps } from '../input';
import { RadioGroupContext, type RadioGroupProps } from '../radio';
import { SelectContext, type SelectProps } from '../select';
import { SwitchContext, type SwitchProps } from '../switch';
import { TextAreaContext, type TextAreaProps } from '../textarea';
import { ActionElement } from './action-element';
import { defaultSize, QueryBuilderContext } from './constants';
import {
  RuleGroup,
  RuleGroupBodyComponents,
  RuleGroupFooterComponents,
  RuleGroupHeaderComponents,
} from './group';
import {
  queryBuilderClassNames,
  queryBuilderStateVars,
} from './query-builder.css';
import { Rule } from './rule';
import type {
  QueryBuilderContextValue,
  QueryBuilderMapping,
  QueryBuilderProps,
} from './types';
import { defaultValueEditors, ValueEditor } from './value-editor';
import { ValueSelector } from './value-selector';

const defaultMapping: QueryBuilderMapping = {
  button: {
    sm: { size: 'sm', variant: 'solid' },
    lg: { size: 'md', variant: 'solid' },
  },
  input: {
    sm: { size: 'sm' },
    lg: { size: 'lg' },
  },
  select: {
    sm: { size: 'sm' },
    lg: { size: 'lg' },
  },
  textarea: {
    sm: { size: 'sm' },
    lg: { size: 'lg' },
  },
  error: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
};

export function QueryBuilder({
  consistentColumns = true,
  controlElements: controlElementsProp,
  disabled,
  icons,
  mapping: mappingProp,
  size = defaultSize,
  valueEditors: valueEditorsProp,
  ...rest
}: QueryBuilderProps) {
  const theme = useTheme();

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(queryBuilderClassNames, theme.QueryBuilder, {
        rule: { error: mapping?.error?.[size] },
      }),
    [mapping?.error, size, theme.QueryBuilder],
  );

  const controlClassNames = useMemo(() => {
    const {
      addGroup,
      addRule,
      cloneGroup,
      cloneRule,
      dragHandle,
      lockGroup,
      lockRule,
      removeGroup,
      removeRule,
      queryBuilder,
      group,
      rule,
    } = classNames ?? {};

    return {
      addGroup,
      addRule,
      cloneGroup,
      cloneRule,
      dragHandle,
      lockGroup,
      lockRule,
      removeGroup,
      removeRule,
      queryBuilder: queryBuilder?.queryBuilder,
      ruleGroup: group?.group,
      header: group?.header,
      body: group?.body,
      rule: rule?.rule,
    };
  }, [classNames]);

  const controlElements = useMemo(
    () => ({
      actionElement: ActionElement,
      rule: Rule,
      ruleGroup: RuleGroup,
      valueEditor: ValueEditor,
      valueSelector: ValueSelector,
      ...controlElementsProp,
    }),
    [controlElementsProp],
  );

  const valueEditors = useMemo(
    () => ({
      ...defaultValueEditors,
      ...valueEditorsProp,
    }),
    [valueEditorsProp],
  );

  const context = useMemo<
    [
      [typeof QueryBuilderContext, QueryBuilderContextValue],
      [typeof ButtonContext, ButtonProps],
      [typeof CheckboxContext, CheckboxProps],
      [typeof InputContext, InputProps],
      [typeof RadioGroupContext, RadioGroupProps],
      [typeof SelectContext, SelectProps<object>],
      [typeof SwitchContext, SwitchProps],
      [typeof TextAreaContext, TextAreaProps],
    ]
  >(
    () => [
      [
        QueryBuilderContext,
        {
          classNames,
          consistentColumns,
          controlElements: {
            ruleGroupBodyElements: RuleGroupBodyComponents,
            ruleGroupFooterElements: RuleGroupFooterComponents,
            ruleGroupHeaderElements: RuleGroupHeaderComponents,
          },
          icons,
          mapping,
          size,
          valueEditors,
        },
      ],
      [
        ButtonContext,
        { ...mapping?.button?.[size], classNames: classNames?.button },
      ],
      [CheckboxContext, { classNames: classNames?.checkbox }],
      [
        InputContext,
        { ...mapping?.input?.[size], classNames: classNames?.input },
      ],
      [RadioGroupContext, { classNames: classNames?.radio }],
      [
        SelectContext,
        { ...mapping?.select?.[size], classNames: classNames?.select },
      ],
      [SwitchContext, { classNames: classNames?.switch }],
      [
        TextAreaContext,
        { ...mapping?.textarea?.[size], classNames: classNames?.textarea },
      ],
    ],
    [classNames, consistentColumns, icons, mapping, size, valueEditors],
  );

  const style = useMemo(
    () =>
      inlineVars(queryBuilderStateVars, {
        isDisabled: typeof disabled === 'boolean' ? disabled : false,
      }),
    [disabled],
  );

  return (
    <Provider values={context}>
      <div className={classNames?.queryBuilder?.container} style={style}>
        <RQBuilder
          {...rest}
          controlElements={controlElements}
          controlClassnames={controlClassNames}
          disabled={disabled}
          listsAsArrays
        />
      </div>
    </Provider>
  );
}
