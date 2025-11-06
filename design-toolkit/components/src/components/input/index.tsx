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

import { CancelFill } from '@accelint/icons';
import { useControlledState } from '@react-stately/utils';
import 'client-only';
import {
  Input as AriaInput,
  InputContext as AriaInputContext,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { InputContext } from './context';
import { InputStyles, InputStylesDefaults } from './styles';
import type { ChangeEvent } from 'react';
import type { InputProps } from './types';

const { container, sizer, input, clear } = InputStyles();

// TODO: Improve this implementation so it is more of a realistic event
const clearInputEvent = {
  target: { value: '' },
} as ChangeEvent<HTMLInputElement>;

/**
 * Input - A flexible text input component with enhanced features
 *
 * Provides a customizable text input with automatic sizing, clear functionality,
 * and integrated validation states. Supports various styling options and integrates
 * seamlessly with form field components for comprehensive form experiences.
 *
 * @example
 * // Basic input
 * <Input placeholder="Enter text..." />
 *
 * @example
 * // Input with clear button
 * <Input
 *   defaultValue="Clearable text"
 *   classNames={{ clear: "hover:bg-info-bold" }}
 * />
 */
export function Input({ ref, ...props }: InputProps) {
  /**
   * It is necessary to pull in the AriaInputContext to capture defaultValue,
   * value & onChange props that may be supplied by a Field component
   *
   * These are necessary due to the implementation of useControlledState for
   * the purposes of supporting the clear button and to capture the length
   * of the current value for the autoSize feature
   */
  [props, ref] = useContextProps(props, ref ?? null, AriaInputContext);
  [props, ref] = useContextProps({ ...props }, ref ?? null, InputContext);

  const {
    classNames,
    autoSize,
    defaultValue = '',
    disabled,
    placeholder,
    readOnly,
    required,
    size = 'medium',
    type = InputStylesDefaults.type,
    value: valueProp,
    isClearable,
    isInvalid,
    onChange,
    onKeyDown,
    ...rest
  } = props;

  const [value, setValue] = useControlledState(valueProp, defaultValue);
  const length = (`${value ?? ''}`.length || placeholder?.length) ?? 0;
  const isEmpty = value == null || value === '';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);

    if (!event.defaultPrevented) {
      setValue(event.target.value);
    }
  }

  return (
    <div
      className={container({
        className: classNames?.container,
        autoSize,
        type,
        isClearable,
      })}
      data-disabled={disabled || null}
      data-empty={isEmpty || null}
      data-invalid={isInvalid || null}
      data-length={length}
      data-placeholder={(!!placeholder && isEmpty) || null}
      data-readonly={readOnly || null}
      data-required={required || null}
      data-size={size}
    >
      <div
        className={sizer({
          className: classNames?.sizer,
          autoSize,
          type,
          isClearable,
        })}
      >
        <AriaInput
          {...rest}
          ref={ref}
          className={composeRenderProps(classNames?.input, (className) =>
            input({ className, autoSize, type, isClearable }),
          )}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          type={type}
          value={value}
          onChange={handleChange}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (
              isClearable &&
              !event.defaultPrevented &&
              event.key === 'Escape'
            ) {
              handleChange(clearInputEvent);
            }
          }}
        />
      </div>
      {isClearable && (
        <Button
          className={composeRenderProps(classNames?.clear, (className) =>
            clear({ className, autoSize, type, isClearable }),
          )}
          excludeFromTabOrder
          size='small'
          variant='icon'
          isDisabled={disabled}
          onPress={() => {
            handleChange(clearInputEvent);

            ref?.current?.focus();
          }}
        >
          <Icon>
            <CancelFill />
          </Icon>
        </Button>
      )}
    </div>
  );
}
