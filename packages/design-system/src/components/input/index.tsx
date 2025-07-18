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

import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { useControlledState } from '@react-stately/utils';
import {
  type ChangeEvent,
  createContext,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  InputContext as RACInputContext,
  type InputProps as RACInputProps,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useTheme } from '../../hooks/use-theme';
import { inputs } from '../../styles/typography.css';
import { inlineVars } from '../../utils/css';
import { mergeClassNames, mergeProps } from '../../utils/props';
import { inputClassNames, inputStateVars } from './input.css';
import type { InputMapping, InputProps } from './types';

const defaultMapping: InputMapping = {
  sizer: {
    sm: inputs.sm,
    lg: inputs.lg,
  },
  input: {
    sm: inputs.sm,
    lg: inputs.lg,
  },
};

export const InputContext =
  createContext<ContextValue<InputProps, HTMLInputElement>>(null);

/**
 * Only intended for generic text-like inputs, see types in props for list
 * Other more specific inputs should be handled by other components
 */
export const Input = forwardRef(function Input(
  props: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  [props, ref] = useContextProps(props, ref, RACInputContext);

  // Disallow props possibly provided by React Aria context
  // could be render props functions we don't want to support
  (props as RACInputProps).className = undefined;
  (props as RACInputProps).style = undefined;

  // Duplicate context prop merging to support React Aria's context
  // and our own which establishes a superset type for the props
  [props, ref] = useContextProps(props, ref, InputContext);

  props = useDefaultProps(props, 'Input');

  const {
    classNames: classNamesProp,
    defaultValue = '',
    disabled: isDisabled = false,
    mapping: mappingProp,
    placeholder,
    readOnly: isReadOnly = false,
    required: isRequired = false,
    size = 'lg',
    type = 'text',
    value: valueProp,
    onChange,
    onHoverStart,
    onHoverChange,
    onHoverEnd,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;

  const [value, setValue] = useControlledState(valueProp, defaultValue);
  const length = (`${value ?? ''}`.length || placeholder?.length) ?? 0;
  const isInvalid = !!ariaInvalid && ariaInvalid !== 'false';
  const isPlaceholder = !!placeholder && !value;
  const isEmpty = !value;

  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    autoFocus: props.autoFocus,
    isTextInput: true,
  });

  const { hoverProps, isHovered } = useHover({
    isDisabled,
    onHoverStart,
    onHoverChange,
    onHoverEnd,
  });

  const theme = useTheme();

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const classNames = useMemo(
    () =>
      mergeClassNames(inputClassNames, theme.Input, classNamesProp, {
        sizer: mapping.sizer[size],
        input: mapping.input[size],
      }),
    [theme.Input, classNamesProp, mapping, size],
  );

  const mergedProps = useMemo(
    () => mergeProps(rest, focusProps, hoverProps),
    [focusProps, hoverProps, rest],
  );

  const style = useMemo(
    () =>
      inlineVars(inputStateVars, {
        length,
        size,
        type,
        isDisabled,
        isEmpty,
        isFocused,
        isFocusVisible,
        isHovered,
        isInvalid,
        isPlaceholder,
        isReadOnly,
        isRequired,
      }),
    [
      length,
      size,
      type,
      isDisabled,
      isEmpty,
      isFocused,
      isFocusVisible,
      isHovered,
      isInvalid,
      isPlaceholder,
      isReadOnly,
      isRequired,
    ],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);

      if (!event.defaultPrevented) {
        setValue(event.target.value);
      }
    },
    [onChange, setValue],
  );

  return (
    <div className={classNames?.container} style={style}>
      <div className={classNames?.sizer}>
        <input
          {...mergedProps}
          ref={ref}
          className={classNames?.input}
          disabled={isDisabled}
          placeholder={placeholder}
          readOnly={isReadOnly}
          required={isRequired}
          type={type}
          value={value}
          onChange={handleChange}
          aria-invalid={ariaInvalid}
        />
      </div>
    </div>
  );
});
