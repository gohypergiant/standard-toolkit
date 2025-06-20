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

import { useCallback } from 'react';
import {
  type InputType,
  type ValueEditorProps,
  useValueEditor,
} from 'react-querybuilder';
import { Checkbox } from '../checkbox';
import { Radio } from '../radio';
import { Switch } from '../switch';
import { TextArea } from '../text-area';
import { TextField } from '../text-field';
import type { QueryBuilderValueEditors } from './';
import { multiValueOperators } from './constants';
import { getValidationResult } from './utils';
import { ValueSelector } from './value-selector';

function CheckboxValueEditor({
  disabled,
  fieldData: { name, validator },
  handleOnChange,
  rule,
  value,
}: ValueEditorProps) {
  const { valid } = getValidationResult(rule, validator);

  return (
    <Checkbox
      isDisabled={disabled}
      isSelected={value}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
    />
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
    <Radio.Group
      value={value}
      isDisabled={disabled}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
      aria-labelledby={name}
    >
      {values?.map((option) => (
        <Radio key={option.name} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </Radio.Group>
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
      aria-labelledby={name}
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
      aria-labelledby={name}
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
  const { valid, reasons } = getValidationResult(rule, validator);

  return (
    <TextField
      isDisabled={disabled}
      isInvalid={!valid}
      placeholder={placeholder}
      type={(inputType as InputType) ?? 'text'}
      size='small'
      value={value}
      onChange={handleOnChange}
      aria-invalid={!valid}
      aria-label={name}
      aria-labelledby={name}
      errorMessage={reasons?.join('/n')}
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
  const { valid, reasons } = getValidationResult(rule, validator);

  return (
    <TextArea
      isDisabled={disabled}
      isInvalid={!valid}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange}
      aria-label={name}
      aria-invalid={!valid}
      aria-labelledby={name}
      errorMessage={reasons?.join('/n')}
    />
  );
}

const valueEditors: QueryBuilderValueEditors = {
  checkbox: CheckboxValueEditor,
  radio: RadioGroupValueEditor,
  select: SelectValueEditor,
  switch: SwitchValueEditor,
  text: TextValueEditor,
  textarea: TextareaValueEditor,
};

export function ValueEditor(props: ValueEditorProps) {
  const {
    fieldData: { name, valueEditorType },
    operator,
    rule: ruleProp,
  } = props;

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
          <div key={`${name}-${term}`}>
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
    <div>
      <Editor {...props} />
    </div>
  );
}
