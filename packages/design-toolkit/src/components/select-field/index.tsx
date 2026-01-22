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
import {
  Button as AriaButton,
  Select as AriaSelect,
  composeRenderProps,
  FieldError,
  ListLayout,
  Popover,
  SelectValue,
  Text,
  useContextProps,
  Virtualizer,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { Label } from '../label';
import { Options } from '../options';
import { SelectFieldContext } from './context';
import styles from './styles.module.css';
import type { SelectFieldProps } from './types';

/**
 * SelectField - Dropdown select with form field features
 *
 * Includes label, description, error messaging, and virtualized rendering for large datasets.
 *
 * @example
 * ```tsx
 * <SelectField label="Country" onSelectionChange={setCountry}>
 *   <Option id="us">United States</Option>
 *   <Option id="ca">Canada</Option>
 * </SelectField>
 * ```
 */
export function SelectField({ ref, ...props }: SelectFieldProps) {
  [props, ref] = useContextProps(props, ref ?? null, SelectFieldContext);

  const {
    size = 'medium',
    children,
    classNames,
    description: descriptionProp,
    errorMessage: errorMessageProp,
    label: labelProp,
    layoutOptions,
    isInvalid: isInvalidProp,
    isReadOnly,
    ...rest
  } = props;

  const errorMessage = errorMessageProp?.trim() ?? null;
  const hasError = !!errorMessage;
  const isInvalid = isInvalidProp ?? hasError;
  const isSmall = size === 'small';
  const showLabel = !isSmall && !!labelProp;
  const shouldShowDescription =
    !isReadOnly && !!descriptionProp && !(isSmall || isInvalid);

  return (
    <AriaSelect
      {...rest}
      ref={ref}
      className={composeRenderProps(classNames?.field, (className) =>
        clsx('group/select-field', styles.field, className),
      )}
      isInvalid={isInvalid}
      data-size={size}
      data-readonly={isReadOnly}
    >
      {composeRenderProps(
        children,
        (children, { isRequired, isDisabled, isInvalid }) => (
          <>
            {showLabel && (
              <Label
                className={clsx(styles.label, classNames?.label)}
                isRequired={isRequired}
                isDisabled={isDisabled}
              >
                {labelProp}
              </Label>
            )}
            {isReadOnly ? (
              // Using the native RAC disabled button component because we don't want the DTK button styles
              <AriaButton isDisabled className={styles.readonly}>
                <SelectValue
                  className={clsx(styles.value, classNames?.value)}
                />
              </AriaButton>
            ) : (
              <Button
                className={composeRenderProps(
                  classNames?.trigger,
                  (className) => clsx(styles.trigger, className),
                )}
                size={size}
                variant='outline'
              >
                <SelectValue
                  className={clsx(styles.value, classNames?.value)}
                />
                <Icon>
                  <ChevronDown className='transform group-open/select-field:rotate-180' />
                </Icon>
              </Button>
            )}
            {shouldShowDescription && (
              <Text
                slot='description'
                className={clsx(styles.description, classNames?.description)}
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
        ),
      )}
    </AriaSelect>
  );
}
