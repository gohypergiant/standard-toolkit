// __private-exports
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

import { useContext } from 'react';
import {
  type RuleProps,
  TestID,
  useRule,
  useStopEventPropagation,
} from 'react-querybuilder';
import type { QueryBuilderContextType } from './';

export function Rule(props: RuleProps) {
  const rule = useRule(props);
  const context: QueryBuilderContextType = useContext(props.context);

  const {
    classNames,
    disabled,
    operators,
    outerClassName,
    rule: { field, operator, value, valueSource },
    schema: {
      controls: {
        fieldSelector: FieldSelectorControlElement,
        operatorSelector: OperatorSelectorControlElement,
        valueSourceSelector: ValueSourceSelectorControlElement,
        valueEditor: ValueEditorControlElement,
        cloneRuleAction: CloneRuleActionControlElement,
        lockRuleAction: LockRuleActionControlElement,
        removeRuleAction: RemoveRuleActionControlElement,
      },
      fields,
      listsAsArrays,
      parseNumbers,
      showCloneButtons,
      showLockButtons,
    },
    fieldData,
    generateOnChangeHandler,
    inputType,
    parentDisabled,
    path,
    translations,
    valueEditorType,
    valueEditorSeparator,
    values,
    valueSources,
    valueSourceOptions,
    validationResult,
  } = rule;

  const cloneRule = useStopEventPropagation(rule.cloneRule);
  const toggleLockRule = useStopEventPropagation(rule.toggleLockRule);
  const removeRule = useStopEventPropagation(rule.removeRule);

  const coreRuleProps = {
    context,
    disabled,
    level: path.length,
    path,
    schema: rule.schema,
    validation: validationResult,
  };

  const renderValueSources =
    !['null', 'notNull'].includes(operator) && valueSources.length > 1;

  return (
    <>
      {context.showRuleLines && <span className='rule-lines relative' />}
      <div className={outerClassName}>
        <FieldSelectorControlElement
          testID={TestID.fields}
          options={fields}
          title={translations.fields.title}
          value={field}
          operator={operator}
          className={classNames.fields}
          handleOnChange={generateOnChangeHandler('field')}
          rule={rule.rule}
          {...coreRuleProps}
        />
        <OperatorSelectorControlElement
          testID={TestID.operators}
          field={field}
          fieldData={rule.fieldData}
          title={rule.translations.operators.title}
          options={operators}
          value={operator}
          className={rule.classNames.operators}
          handleOnChange={rule.generateOnChangeHandler('operator')}
          rule={rule.rule}
          {...coreRuleProps}
        />
        <ValueEditorControlElement
          testID={TestID.valueEditor}
          field={field}
          fieldData={fieldData}
          title={translations.value.title}
          operator={operator}
          value={value}
          valueSource={valueSource ?? 'value'}
          type={valueEditorType}
          inputType={inputType}
          values={values}
          listsAsArrays={listsAsArrays}
          parseNumbers={parseNumbers}
          separator={valueEditorSeparator}
          className={classNames.value}
          handleOnChange={generateOnChangeHandler('value')}
          rule={rule.rule}
          {...coreRuleProps}
        />
        {renderValueSources && (
          <ValueSourceSelectorControlElement
            testID={TestID.valueSourceSelector}
            field={field}
            fieldData={fieldData}
            title={translations.valueSourceSelector.title}
            options={valueSourceOptions}
            value={valueSource ?? 'value'}
            className={classNames.valueSource}
            handleOnChange={generateOnChangeHandler('valueSource')}
            rule={rule.rule}
            {...coreRuleProps}
          />
        )}
      </div>
      <div className={outerClassName}>
        <RemoveRuleActionControlElement
          testID={TestID.removeRule}
          label={translations.removeRule.label ?? 'remove'}
          title={translations.removeRule.title ?? 'remove'}
          className={classNames.removeRule}
          handleOnClick={removeRule}
          ruleOrGroup={rule.rule}
          {...coreRuleProps}
        />
        {showCloneButtons && (
          <CloneRuleActionControlElement
            testID={TestID.cloneRule}
            label={translations.cloneRule.label ?? 'clone'}
            title={translations.cloneRule.title ?? 'clone'}
            className={classNames.cloneRule}
            handleOnClick={cloneRule}
            ruleOrGroup={rule.rule}
            {...coreRuleProps}
          />
        )}
        {showLockButtons && (
          <LockRuleActionControlElement
            testID={TestID.lockRule}
            label={translations.lockRule.label ?? 'lock'}
            title={translations.lockRule.title ?? 'lock'}
            className={classNames.lockRule}
            handleOnClick={toggleLockRule}
            disabledTranslation={
              parentDisabled ? undefined : translations.lockRuleDisabled
            }
            ruleOrGroup={rule.rule}
            {...coreRuleProps}
          />
        )}
      </div>
    </>
  );
}
