import type { Key } from '@react-types/shared';
import { useCallback, useContext, useMemo } from 'react';
import type { Selection } from 'react-aria-components';
import {
  type FullOption,
  isOptionGroupArray,
  useValueSelector,
  type ValueSelectorProps,
} from 'react-querybuilder';
import { callRenderProps } from '../../utils';
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
