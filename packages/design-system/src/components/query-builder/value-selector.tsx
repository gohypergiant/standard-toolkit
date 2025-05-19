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

import type { Key } from '@react-types/shared';
import { useCallback, useContext, useMemo } from 'react';
import type { Selection } from 'react-aria-components';
import {
  type FullOption,
  type ValueSelectorProps,
  isOptionGroupArray,
  useValueSelector,
} from 'react-querybuilder';
import { callRenderProps } from '../../utils/props';
import { AriaHeader, AriaSection, AriaSelectValue } from '../aria';
import { Button } from '../button';
import { Options, OptionsItem, OptionsList } from '../options';
import { Select } from '../select';
import { QueryBuilderContext } from './constants';

export function ValueSelector<T extends FullOption = FullOption>({
  handleOnChange,
  listsAsArrays,
  options: optionsProp,
  multiple,
  title,
  validation,
  value,
  ...rest
}: ValueSelectorProps<T>) {
  const { icons, size } = useContext(QueryBuilderContext);

  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });

  const handleSelectionChange = useCallback(
    (selection: Key) => onChange(`${selection}`),
    [onChange],
  );

  const handleMultiSelectChange = useCallback(
    (keys: Selection) => onChange([...keys].join(', ')),
    [onChange],
  );

  const options = useMemo(
    () =>
      isOptionGroupArray(optionsProp)
        ? optionsProp.map((section) => (
            <AriaSection key={section.label}>
              <AriaHeader>{section.label}</AriaHeader>
              {section.options.map((option) => (
                <OptionsItem id={option.name} key={option.name}>
                  {option.label}
                </OptionsItem>
              ))}
            </AriaSection>
          ))
        : optionsProp.map((option) => (
            <OptionsItem id={option.name} key={option.name}>
              {option.label}
            </OptionsItem>
          )),
    [optionsProp],
  );

  return multiple ? (
    <OptionsList // TODO: Replace with ChipField when it exists
      {...rest}
      selectedKeys={val}
      selectionMode='multiple'
      size={size}
      onSelectionChange={handleMultiSelectChange}
      aria-label={title}
    >
      {options}
    </OptionsList>
  ) : (
    <Select
      {...rest}
      selectedKey={Array.isArray(val) ? val[0] : val}
      size={size}
      isInvalid={title === 'Value' && !validation}
      onSelectionChange={handleSelectionChange}
      aria-label={title}
    >
      {(renderProps) => (
        <>
          <Button>
            <AriaSelectValue>
              {({ selectedText }) => selectedText}
            </AriaSelectValue>
            {callRenderProps(icons?.select, renderProps)}
          </Button>
          <Options>
            <OptionsList>{options}</OptionsList>
          </Options>
        </>
      )}
    </Select>
  );
}
