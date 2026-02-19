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
'use client';

import type { Key } from '@react-types/shared';
import 'client-only';
import { useCallback, useMemo } from 'react';
import {
  isOptionGroupArray,
  useValueSelector,
  type ValueSelectorProps,
} from 'react-querybuilder';
import { ComboBoxField } from '../combobox-field';
import { OptionsItem } from '../options/item';
import { OptionsSection } from '../options/section';

/**
 * ValueSelector - Dropdown for selecting predefined values
 *
 * Renders a ComboBoxField with options, supporting grouped and flat option lists.
 *
 * @example
 * ```tsx
 * <ValueSelector
 *   options={[
 *     { name: 'option1', label: 'Option 1' },
 *     { name: 'option2', label: 'Option 2' }
 *   ]}
 *   value="option1"
 *   handleOnChange={(value) => console.log(value)}
 * />
 * ```
 *
 * @param props - ValueSelectorProps from react-querybuilder.
 * @returns The rendered ValueSelector dropdown.
 */
export function ValueSelector(props: ValueSelectorProps) {
  const {
    className,
    handleOnChange,
    disabled,
    listsAsArrays,
    options: optionsProp,
    multiple,
    title,
    validation,
    value,
    ...rest
  } = props;

  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });

  const handleSelectionChange = useCallback(
    (selection: Key | null) => {
      if (selection !== null) {
        onChange(`${selection}`);
      }
    },
    [onChange],
  );

  const options = useMemo(
    () =>
      isOptionGroupArray(optionsProp)
        ? optionsProp.map((section) => (
            <OptionsSection key={section.label} header={section.label}>
              {section.options.map((option) => (
                <OptionsItem
                  textValue={option.label}
                  id={option.name}
                  key={option.name}
                >
                  {option.label}
                </OptionsItem>
              ))}
            </OptionsSection>
          ))
        : optionsProp.map((option) => (
            <OptionsItem
              textValue={option.label}
              id={option.name}
              key={option.name}
            >
              {option.label}
            </OptionsItem>
          )),
    [optionsProp],
  );

  const selectedKey = Array.isArray(val) ? val[0] : val;

  const flatOptions = isOptionGroupArray(optionsProp)
    ? optionsProp.flatMap((group) => group.options)
    : optionsProp;

  const selectedValue =
    flatOptions.find((option) => option.name === selectedKey)?.label ??
    selectedKey;

  return (
    <ComboBoxField
      {...rest}
      classNames={{ control: className }}
      size='small'
      allowsCustomValue={false}
      isClearable={false}
      isDisabled={disabled}
      defaultInputValue={selectedValue}
      defaultSelectedKey={selectedKey}
      aria-labelledby={title}
      onSelectionChange={handleSelectionChange}
    >
      {options}
    </ComboBoxField>
  );
}
