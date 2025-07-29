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

import { useCallback, useMemo } from 'react';
import { Header, ListBoxSection } from 'react-aria-components';
import {
  isOptionGroupArray,
  useValueSelector,
  type ValueSelectorProps,
} from 'react-querybuilder';
import { ComboBox } from '../combobox';
import type { Key } from '@react-types/shared';

export function ValueSelector(props: ValueSelectorProps) {
  const {
    handleOnChange,
    disabled,
    listsAsArrays,
    options: optionsProp,
    multiple,
    title,
    // biome-ignore lint/correctness/noUnusedVariables: should we ignore rest siblings? https://biomejs.dev/linter/rules/no-unused-variables/#ignorerestsiblings
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
      if (selection) {
        onChange(`${selection}`);
      }
    },
    [onChange],
  );

  const options = useMemo(
    () =>
      isOptionGroupArray(optionsProp)
        ? optionsProp.map((section) => (
            <ListBoxSection key={section.label}>
              <Header>{section.label}</Header>
              {section.options.map((option) => (
                <ComboBox.Item
                  name={option.name}
                  id={option.name}
                  key={option.name}
                >
                  {option.label}
                </ComboBox.Item>
              ))}
            </ListBoxSection>
          ))
        : optionsProp.map((option) => (
            <ComboBox.Item
              name={option.name}
              textValue={option.label}
              id={option.name}
              key={option.name}
            >
              {option.label}
            </ComboBox.Item>
          )),
    [optionsProp],
  );

  return (
    <ComboBox
      size='small'
      isDisabled={disabled}
      {...rest}
      selectedKey={Array.isArray(val) ? val[0] : val}
      aria-labelledby={title}
      onSelectionChange={handleSelectionChange}
    >
      {options}
    </ComboBox>
  );
}
