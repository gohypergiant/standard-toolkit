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

import { ChevronDown } from '@accelint/icons';
import 'client-only';
import { clsx } from '@accelint/design-foundation/lib/utils';
import {
  Button,
  ComboBox,
  composeRenderProps,
  FieldError,
  Input,
  ListLayout,
  Popover,
  Text,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
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
 * @example
 * <ComboBoxField defaultItems={items}>
 *   {(item) => <OptionsItem key={item.id} textValue={item.name}>{item.name}</OptionsItem>}
 * </ComboBoxField>
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
    label: labelProp,
    layoutOptions,
    menuTrigger = 'focus',
    size = 'medium',
    isInvalid: isInvalidProp,
    isReadOnly = false,
    ...rest
  } = props;
  const errorMessage = errorMessageProp || null; // Protect against empty string
  const isSmall = size === 'small';

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
      data-size={size}
    >
      {(
        { isDisabled, isInvalid, isRequired }, // Rely on internal state, not props, since state could differ from props
      ) => (
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
            className={clsx(
              styles.control,
              !isReadOnly && styles.interactive,
              classNames?.control,
            )}
          >
            {isReadOnly ? (
              <Input
                {...inputProps}
                tabIndex={-1}
                className={composeRenderProps(classNames?.input, (className) =>
                  clsx(styles.input, className),
                )}
              />
            ) : (
              <>
                <Input
                  {...inputProps}
                  className={composeRenderProps(
                    classNames?.input,
                    (className) => clsx(styles.input, className),
                  )}
                />
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
              </>
            )}
          </div>
          {!isReadOnly && !!descriptionProp && !(isSmall || isInvalid) && (
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
      )}
    </ComboBox>
  );
}
