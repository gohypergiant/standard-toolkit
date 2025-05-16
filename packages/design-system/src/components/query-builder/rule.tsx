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

import { useContext, useMemo } from 'react';
import {
  type RuleProps,
  TestID,
  useRule,
  useStopEventPropagation,
} from 'react-querybuilder';
import { inlineVars } from '../../utils/css';
import { AriaText } from '../aria';
import { QueryBuilderContext } from './constants';
import { queryBuilderRuleStateVars } from './query-builder.css';
import { getValidationResult } from './utils';

export function Rule(props: RuleProps) {
  const { classNames, orientation } = useContext(QueryBuilderContext);
  const rule = useRule(props);
  const cloneRule = useStopEventPropagation(rule.cloneRule);
  const toggleLockRule = useStopEventPropagation(rule.toggleLockRule);
  const removeRule = useStopEventPropagation(rule.removeRule);
  const shiftRuleUp = useStopEventPropagation(rule.shiftRuleUp);
  const shiftRuleDown = useStopEventPropagation(rule.shiftRuleDown);

  const { valid: isValid, reasons } = getValidationResult(
    props.rule,
    rule.fieldData?.validator,
  );

  const style = useMemo(
    () =>
      inlineVars(queryBuilderRuleStateVars, {
        orientation,
        isDisabled: rule.disabled,
        isDragging: rule.isDragging,
        isDropTarget: rule.isOver,
      }),
    [rule.disabled, rule.isDragging, rule.isOver, orientation],
  );

  return (
    <div className={classNames?.rule?.container} style={style}>
      <div
        ref={rule.dndRef}
        className={rule.outerClassName}
        data-dragmonitorid={rule.dragMonitorId}
        data-dropmonitorid={rule.dropMonitorId}
        data-level={rule.path.length}
        data-path={JSON.stringify(rule.path)}
        data-rule-id={rule.id}
        data-testid={TestID.rule}
      >
        <RuleComponents
          {...rule}
          cloneRule={cloneRule}
          removeRule={removeRule}
          shiftRuleDown={shiftRuleDown}
          shiftRuleUp={shiftRuleUp}
          toggleLockRule={toggleLockRule}
        />
      </div>
      {!isValid &&
        reasons?.map((reason) => (
          <AriaText key={reason} className={classNames?.rule?.error}>
            {reason}
          </AriaText>
        ))}
    </div>
  );
}

export function RuleComponents({
  classNames: classNamesProp,
  cloneRule,
  context,
  disabled,
  dragRef,
  fieldData,
  generateOnChangeHandler,
  hideValueControls,
  inputType,
  operators,
  parentDisabled,
  path,
  removeRule,
  rule,
  schema,
  shiftDownDisabled,
  shiftUpDisabled,
  shiftRuleDown,
  shiftRuleUp,
  toggleLockRule,
  translations,
  validationResult,
  valueEditorSeparator,
  valueEditorType,
  valueSourceOptions,
  valueSources,
  values,
}: RuleProps & ReturnType<typeof useRule>) {
  const { classNames, consistentColumns, orientation } =
    useContext(QueryBuilderContext);

  const {
    controls: {
      shiftActions: ShiftActionsControlElement,
      dragHandle: DragHandleControlElement,
      fieldSelector: FieldSelectorControlElement,
      operatorSelector: OperatorSelectorControlElement,
      valueSourceSelector: ValueSourceSelectorControlElement,
      valueEditor: ValueEditorControlElement,
      cloneRuleAction: CloneRuleActionControlElement,
      lockRuleAction: LockRuleActionControlElement,
      removeRuleAction: RemoveRuleActionControlElement,
    },
    enableDragAndDrop,
    showCloneButtons,
    showLockButtons,
    showShiftActions,
  } = schema;

  const titles = useMemo(
    () => ({
      shiftUp: translations.shiftActionUp.title,
      shiftDown: translations.shiftActionDown.title,
    }),
    [translations.shiftActionDown.title, translations.shiftActionUp.title],
  );

  const labels = useMemo(
    () => ({
      shiftUp: translations.shiftActionUp.label,
      shiftDown: translations.shiftActionDown.label,
    }),
    [translations.shiftActionDown.label, translations.shiftActionUp.label],
  );

  const renderOperator =
    schema.autoSelectField ||
    rule.field !== translations.fields.placeholderName;

  const operator = useMemo(() => {
    if (renderOperator) {
      return (
        <div className={classNames?.rule?.operator}>
          <OperatorSelectorControlElement
            testID={TestID.operators}
            field={rule.field}
            fieldData={fieldData}
            title={translations.operators.title}
            options={operators}
            value={rule.operator}
            className={classNamesProp.operators}
            handleOnChange={generateOnChangeHandler('operator')}
            level={path.length}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
            schema={schema}
            rule={rule}
          />
        </div>
      );
    }

    return !renderOperator &&
      consistentColumns &&
      orientation === 'horizontal' ? (
      <div className={classNames?.rule?.operator} />
    ) : null;
  }, [
    OperatorSelectorControlElement,
    classNames?.rule?.operator,
    classNamesProp.operators,
    consistentColumns,
    context,
    disabled,
    fieldData,
    generateOnChangeHandler,
    operators,
    path,
    renderOperator,
    rule,
    schema,
    translations.operators.title,
    validationResult,
    orientation,
  ]);

  const renderValue =
    renderOperator &&
    (schema.autoSelectOperator ||
      rule.operator !== translations.operators.placeholderName) &&
    !hideValueControls;

  const value = useMemo(() => {
    if (renderValue) {
      return (
        <div className={classNames?.rule?.values}>
          <ValueEditorControlElement
            testID={TestID.valueEditor}
            field={rule.field}
            fieldData={fieldData}
            title={translations.value.title}
            operator={rule.operator}
            value={rule.value}
            valueSource={rule.valueSource ?? 'value'}
            type={valueEditorType}
            inputType={inputType}
            values={values}
            listsAsArrays={schema.listsAsArrays}
            parseNumbers={schema.parseNumbers}
            separator={valueEditorSeparator}
            className={classNamesProp.value}
            handleOnChange={generateOnChangeHandler('value')}
            level={path.length}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
            schema={schema}
            rule={rule}
          />
        </div>
      );
    }

    return !renderValue && consistentColumns && orientation === 'horizontal' ? (
      <div className={classNames?.rule?.values} />
    ) : null;
  }, [
    ValueEditorControlElement,
    classNames?.rule?.values,
    classNamesProp.value,
    consistentColumns,
    context,
    disabled,
    fieldData,
    generateOnChangeHandler,
    inputType,
    path,
    renderValue,
    rule,
    schema,
    translations.value.title,
    validationResult,
    valueEditorSeparator,
    valueEditorType,
    values,
    orientation,
  ]);

  const renderValueSources =
    renderValue &&
    !['null', 'notNull'].includes(rule.operator) &&
    valueSources.length > 1;

  const sources = useMemo(() => {
    if (renderValueSources) {
      return (
        <div className={classNames?.rule?.source}>
          <ValueSourceSelectorControlElement
            testID={TestID.valueSourceSelector}
            field={rule.field}
            fieldData={fieldData}
            title={translations.valueSourceSelector.title}
            options={valueSourceOptions}
            value={rule.valueSource ?? 'value'}
            className={classNamesProp.valueSource}
            handleOnChange={generateOnChangeHandler('valueSource')}
            level={path.length}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
            schema={schema}
            rule={rule}
          />
        </div>
      );
    }

    return !renderValueSources &&
      consistentColumns &&
      orientation === 'horizontal' ? (
      <div className={classNames?.rule?.source} />
    ) : null;
  }, [
    ValueSourceSelectorControlElement,
    classNames?.rule?.source,
    classNamesProp.valueSource,
    consistentColumns,
    context,
    disabled,
    fieldData,
    generateOnChangeHandler,
    path,
    renderValueSources,
    rule,
    schema,
    translations.valueSourceSelector.title,
    validationResult,
    valueSourceOptions,
    orientation,
  ]);

  const core = useMemo(() => {
    const controls = (
      <>
        <div className={classNames?.rule?.field}>
          <FieldSelectorControlElement
            testID={TestID.fields}
            options={schema.fields}
            title={translations.fields.title}
            value={rule.field}
            operator={rule.operator}
            className={classNamesProp.fields}
            handleOnChange={generateOnChangeHandler('field')}
            level={path.length}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
            schema={schema}
            rule={rule}
          />
        </div>
        {operator}
        {sources}
        {value}
      </>
    );

    return orientation === 'horizontal' ? (
      controls
    ) : (
      <div className={classNames?.rule?.core}>{controls}</div>
    );
  }, [
    FieldSelectorControlElement,
    classNames?.rule?.core,
    classNames?.rule?.field,
    schema.fields,
    translations.fields.title,
    classNamesProp.fields,
    generateOnChangeHandler,
    path,
    disabled,
    context,
    validationResult,
    schema,
    rule,
    operator,
    sources,
    value,
    orientation,
  ]);

  return (
    <>
      {showShiftActions && (
        <div className={classNames?.rule?.shift}>
          <ShiftActionsControlElement
            testID={TestID.shiftActions}
            level={path.length}
            path={path}
            titles={titles}
            labels={labels}
            className={classNamesProp.shiftActions}
            disabled={disabled}
            shiftUp={shiftRuleUp}
            shiftDown={shiftRuleDown}
            shiftUpDisabled={shiftUpDisabled}
            shiftDownDisabled={shiftDownDisabled}
            context={context}
            validation={validationResult}
            schema={schema}
            ruleOrGroup={rule}
          />
        </div>
      )}
      {enableDragAndDrop && (
        <div className={classNames?.rule?.drag}>
          <DragHandleControlElement
            testID={TestID.dragHandle}
            ref={dragRef}
            level={path.length}
            path={path}
            title={translations.dragHandle.title}
            label={translations.dragHandle.label}
            className={classNamesProp.dragHandle}
            disabled={disabled}
            context={context}
            validation={validationResult}
            schema={schema}
            ruleOrGroup={rule}
          />
        </div>
      )}
      {core}
      {showCloneButtons && (
        <div className={classNames?.rule?.clone}>
          <CloneRuleActionControlElement
            testID={TestID.cloneRule}
            label={translations.cloneRule.label}
            title={translations.cloneRule.title}
            className={classNamesProp.cloneRule}
            handleOnClick={cloneRule}
            level={path.length}
            path={path}
            disabled={disabled}
            context={context}
            validation={validationResult}
            ruleOrGroup={rule}
            schema={schema}
          />
        </div>
      )}
      {showLockButtons && (
        <div className={classNames?.rule?.lock}>
          <LockRuleActionControlElement
            testID={TestID.lockRule}
            label={translations.lockRule.label}
            title={translations.lockRule.title}
            className={classNamesProp.lockRule}
            handleOnClick={toggleLockRule}
            level={path.length}
            path={path}
            disabled={disabled}
            disabledTranslation={
              parentDisabled ? undefined : translations.lockRuleDisabled
            }
            context={context}
            validation={validationResult}
            ruleOrGroup={rule}
            schema={schema}
          />
        </div>
      )}
      <div className={classNames?.rule?.remove}>
        <RemoveRuleActionControlElement
          testID={TestID.removeRule}
          label={translations.removeRule.label}
          title={translations.removeRule.title}
          className={classNamesProp.removeRule}
          handleOnClick={removeRule}
          level={path.length}
          path={path}
          disabled={disabled}
          context={context}
          validation={validationResult}
          ruleOrGroup={rule}
          schema={schema}
        />
      </div>
    </>
  );
}
