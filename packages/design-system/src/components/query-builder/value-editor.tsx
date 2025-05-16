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

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useContext,
} from 'react';
import { type ValueEditorProps, useValueEditor } from 'react-querybuilder';
import { Checkbox } from '../checkbox';
import { Input } from '../input/input';
import type { InputType } from '../input/types';
import { Radio, RadioGroup } from '../radio/radio';
import { Switch } from '../switch/switch';
import { TextArea } from '../textarea/textarea';
import { QueryBuilderContext, multiValueOperators } from './constants';
import type { QueryBuilderValueEditors } from './types';
import { getValidationResult } from './utils';
import { ValueSelector } from './value-selector';

function CheckboxValueEditor({
  disabled,
  fieldData: { name, validator },
  handleOnChange,
  rule,
  value,
}: ValueEditorProps) {
  const { icons } = useContext(QueryBuilderContext);
  const { valid } = getValidationResult(rule, validator);

  return (
    <Checkbox
      isDisabled={disabled}
      isSelected={value}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
    >
      {icons?.checkbox}
    </Checkbox>
  );
}

function RadioGroupValueEditor({
  disabled,
  fieldData: { name, validator },
  handleOnChange,
  rule,
  value,
  values,
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  return (
    <RadioGroup
      value={value}
      isDisabled={disabled}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
    >
      {values?.map((option) => (
        <Radio key={option.name} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}

const defaultOptions: unknown[] = [];

function SelectValueEditor({
  disabled,
  fieldData: { name, validator },
  handleOnChange,
  rule,
  type,
  value,
  values = defaultOptions,
  ...rest
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  return (
    <ValueSelector
      {...rest}
      disabled={disabled}
      multiple={type === 'multiselect'}
      options={values}
      title={name}
      validation={!valid}
      value={value}
      handleOnChange={handleOnChange}
    />
  );
}

function SwitchValueEditor({
  disabled,
  fieldData: { name, validator },
  handleOnChange,
  rule,
  value,
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  return (
    <Switch
      isDisabled={disabled}
      isSelected={Boolean(value)}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
    />
  );
}

function TextValueEditor({
  disabled,
  fieldData: { name, placeholder, validator },
  handleOnChange,
  inputType,
  rule,
  value,
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      handleOnChange(event.target.value),
    [handleOnChange],
  );

  return (
    <Input
      disabled={disabled}
      placeholder={placeholder}
      type={(inputType as InputType) ?? 'text'}
      value={value}
      onChange={handleChange}
      aria-invalid={!valid}
      aria-label={name}
    />
  );
}

function TextareaValueEditor({
  disabled,
  fieldData: { name, placeholder, validator },
  handleOnChange,
  rule,
  value,
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  const handleChange = useCallback(
    (event: FormEvent<HTMLSpanElement>) =>
      handleOnChange(event.currentTarget.textContent),
    [handleOnChange],
  );

  return (
    <TextArea
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      aria-label={name}
      aria-invalid={!valid}
    />
  );
}

export const defaultValueEditors: QueryBuilderValueEditors = {
  checkbox: CheckboxValueEditor,
  multiselect: SelectValueEditor,
  radio: RadioGroupValueEditor,
  select: SelectValueEditor,
  switch: SwitchValueEditor,
  text: TextValueEditor,
  textarea: TextareaValueEditor,
};

export function ValueEditor(props: ValueEditorProps) {
  const {
    fieldData: { id, valueEditorType },
    operator,
    rule: ruleProp,
  } = props;

  const { classNames, valueEditors } = useContext(QueryBuilderContext);

  const { valueAsArray, multiValueHandler } = useValueEditor({
    ...props,
    skipHook: true,
  });

  const rule = useCallback(
    (index: number) => ({
      ...ruleProp,
      value: valueAsArray[index],
    }),
    [ruleProp, valueAsArray],
  );

  const handleRangeStartChange = useCallback(
    (value: string) => multiValueHandler(value, 0),
    [multiValueHandler],
  );

  const handleRangeEndChange = useCallback(
    (value: string) => multiValueHandler(value, 1),
    [multiValueHandler],
  );

  const type =
    (typeof valueEditorType === 'function'
      ? valueEditorType(operator)
      : valueEditorType) ?? 'text';

  const Editor = valueEditors?.[type];

  if (operator === 'null' || operator === 'notNull' || !Editor) {
    return null;
  }

  if (multiValueOperators.includes(operator)) {
    return (
      <>
        {['start', 'end'].map((term, index) => (
          <div key={`${id}-${term}`} className={classNames?.rule?.value}>
            <Editor
              {...props}
              rule={rule(index)}
              value={valueAsArray[index]}
              handleOnChange={
                index ? handleRangeEndChange : handleRangeStartChange
              }
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={classNames?.rule?.value}>
      <Editor {...props} />
    </div>
  );
}
