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
import { CancelFill } from '@accelint/icons';
import { useControlledState } from '@react-stately/utils';
import { clsx } from 'clsx';
import {
  Input as AriaInput,
  InputContext as AriaInputContext,
  composeRenderProps,
  useContextProps,
} from 'react-aria-components';
import { Button } from '../button';
import { Icon } from '../icon';
import { IconProvider } from '../icon/context';
import { InputContext } from './context';
import styles from './styles.module.css';
import type { ChangeEvent } from 'react';
import type { InputProps } from './types';

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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: just a little bit over, not worth refactoring
export function Input({ ref = null, ...props }: InputProps) {
  /**
   * It is necessary to pull in the AriaInputContext to capture defaultValue,
   * value & onChange props that may be supplied by a Field component
   *
   * These are necessary due to the implementation of useControlledState for
   * the purposes of supporting the clear button and to capture the length
   * of the current value for the autoSize feature
   */
  [props, ref] = useContextProps(props, ref, AriaInputContext);
  [props, ref] = useContextProps({ ...props }, ref, InputContext);

  const {
    classNames,
    autoSize,
    defaultValue = '',
    disabled,
    placeholder,
    prefix: prefixProp,
    readOnly,
    required,
    size = 'medium',
    suffix: suffixProp,
    type = 'text',
    value: valueProp,
    isClearable = true,
    isInvalid,
    onChange,
    onKeyDown,
    ...rest
  } = props;

  const [value, setValue] = useControlledState(valueProp, defaultValue);
  const length = (`${value ?? ''}`.length || placeholder?.length) ?? 0;
  const prefix = !!prefixProp && styles.hasPrefix;
  const suffix = !!suffixProp && styles.hasSuffix;
  const clear = isClearable && styles.isClearable;
  const isEmpty = value == null || value === '';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);

    if (!event.defaultPrevented) {
      setValue(event.target.value);
    }
  }

  return (
    <IconProvider size='small'>
      <div
        className={clsx(
          'group/input',
          styles.container,
          prefix,
          suffix,
          clear,
          classNames?.container,
        )}
        data-disabled={disabled || null}
        data-empty={isEmpty || null}
        data-invalid={isInvalid || null}
        data-length={length}
        data-placeholder={(!!placeholder && isEmpty) || null}
        data-readonly={readOnly || null}
        data-required={required || null}
        data-size={size}
      >
        {prefix && (
          <span className={clsx(styles.prefix, classNames?.prefix)}>
            {prefixProp}
          </span>
        )}
        <div className={clsx(styles.sizer, classNames?.sizer)}>
          <AriaInput
            {...rest}
            ref={ref}
            className={composeRenderProps(classNames?.input, (className) =>
              clsx(styles.input, className),
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
        {suffix && (
          <span
            className={clsx(
              styles.suffix,
              prefix,
              suffix,
              clear,
              classNames?.suffix,
            )}
          >
            {suffixProp}
          </span>
        )}
        {isClearable && (
          <Button
            className={composeRenderProps(classNames?.clear, (className) =>
              clsx(styles.clear, prefix, suffix, clear, className),
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
    </IconProvider>
  );
}
