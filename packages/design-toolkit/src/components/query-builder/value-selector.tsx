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

export function ValueSelector(props: ValueSelectorProps) {
  const {
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
            <OptionsSection key={section.label} header={section.label}>
              {section.options.map((option) => (
                <OptionsItem id={option.name} key={option.name}>
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

  return (
    <ComboBoxField
      size='small'
      isDisabled={disabled}
      {...rest}
      selectedKey={Array.isArray(val) ? val[0] : val}
      aria-labelledby={title}
      onSelectionChange={handleSelectionChange}
    >
      {options}
    </ComboBoxField>
  );
}
