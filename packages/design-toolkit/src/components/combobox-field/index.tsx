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
import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import ChevronDown from '@accelint/icons/chevron-down';
import { useControlledState } from '@react-stately/utils';
import { useCallback } from 'react';
import {
  Button,
  ComboBox,
  type ComboBoxProps,
  composeRenderProps,
  FieldError,
  Input,
  ListLayout,
  Popover,
  Text,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
import { ClearButton } from '../button/__internal__/clear';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { ComboBoxFieldContext } from './context';
import styles from './styles.module.css';
import type { OptionsDataItem } from '../options/types';
import type { ComboBoxFieldProps } from './types';

/**
 * ComboBoxField - Accessible searchable combobox with dropdown options
 *
 * A combobox field that provides a searchable input with virtualized dropdown
 * options and support for sections, icons, and rich content.
 *
 * @param props - The combobox field props.
 * @param props.ref - Reference to the field element.
 * @param props.children - Render function for options.
 * @param props.classNames - Custom class names for sub-elements.
 * @param props.label - Label text displayed above the field.
 * @param props.description - Helper text displayed below the field.
 * @param props.errorMessage - Error message displayed when invalid.
 * @param props.size - Size variant of the field.
 * @returns The combobox field component.
 *
 * @example
 * ```tsx
 * <ComboBoxField defaultItems={items}>
 *   {(item) => <OptionsItem key={item.id} textValue={item.name}>{item.name}</OptionsItem>}
 * </ComboBoxField>
 * ```
 */
export function ComboBoxField<T extends OptionsDataItem>({
  ref,
  ...props
}: ComboBoxFieldProps<T>) {
  [props, ref] = useContextProps(props, ref ?? null, ComboBoxFieldContext);

  const {
    children,
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    inputProps,
    inputValue: inputValueProp,
    defaultInputValue = '',
    label: labelProp,
    layoutOptions,
    menuTrigger = 'focus',
    size = 'medium',
    isInvalid: isInvalidProp,
    isReadOnly = false,
    isClearable = true,
    onInputChange,
    onKeyDown,
    ...rest
  } = props;

  const isInputValueControlled = inputValueProp !== undefined;

  const [inputValue, setInputValue] = useControlledState(
    inputValueProp,
    defaultInputValue,
    onInputChange,
  );

  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

  const handleClear = useCallback(() => {
    setInputValue('');
  }, [setInputValue]);

  const handleKeyDown = useCallback<Required<ComboBoxProps<T>>['onKeyDown']>(
    (event) => {
      onKeyDown?.(event);
      if (isClearable && event.key === 'Escape' && inputValue) {
        handleClear();
      }
    },
    [onKeyDown, isClearable, handleClear, inputValue],
  );

  return (
    <ComboBox<T>
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        clsx('group/combobox-field', styles.field, className),
      )}
      menuTrigger={menuTrigger}
      isInvalid={isInvalidProp || (errorMessage ? true : undefined)} // Leave uncontrolled if possible to fallback to validation state
      isReadOnly={isReadOnly}
      inputValue={isInputValueControlled ? inputValue : undefined}
      onInputChange={setInputValue}
      onKeyDown={handleKeyDown}
      data-size={size}
      data-empty={!inputValue || null}
    >
      {({ isDisabled, isInvalid, isRequired }) => {
        const shouldShowDescription =
          !isReadOnly && !!descriptionProp && !(isSmall || isInvalid);

        return (
          <>
            {!!labelProp && !isSmall && (
              <Label
                className={clsx(styles.label, classNames?.label)}
                isDisabled={isDisabled}
                isRequired={isRequired}
              >
                {labelProp}
              </Label>
            )}
            <div
              className={clsx(styles.control, classNames?.control)}
              data-readonly={isReadOnly || null}
            >
              <Input
                {...inputProps}
                tabIndex={isReadOnly ? -1 : 0}
                className={composeRenderProps(classNames?.input, (className) =>
                  clsx(styles.input, className),
                )}
                title={inputProps?.value ? String(inputProps?.value) : ''}
              />
              {!isReadOnly && isClearable && (
                <ClearButton
                  className={composeRenderProps(
                    classNames?.clear,
                    (className) => clsx(styles.clear, className),
                  )}
                  isDisabled={isDisabled}
                  onPress={handleClear}
                />
              )}
              {!isReadOnly && (
                <Button
                  className={composeRenderProps(
                    classNames?.trigger,
                    (className) => clsx(styles.trigger, className),
                  )}
                >
                  <Icon size='small'>
                    <ChevronDown />
                  </Icon>
                </Button>
              )}
            </div>
            {shouldShowDescription && (
              <Text
                className={clsx(styles.description, classNames?.description)}
                slot='description'
              >
                {descriptionProp}
              </Text>
            )}
            <FieldError
              className={composeRenderProps(classNames?.error, (className) =>
                clsx(styles.error, className),
              )}
            >
              {errorMessage}
            </FieldError>
            <Popover
              className={composeRenderProps(classNames?.popover, (className) =>
                clsx(styles.popover, className),
              )}
            >
              <Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
                <Options>{children}</Options>
              </Virtualizer>
            </Popover>
          </>
        );
      }}
    </ComboBox>
  );
}
