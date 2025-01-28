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
  createContext,
  type FormEvent,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  type ContextValue,
  TextAreaContext as RACTextAreaContext,
  type TextAreaProps as RACTextAreaProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { inputs } from '../../styles';
import { inlineVars, mergeClassNames, mergeProps } from '../../utils';
import { textAreaClassNames, textAreaStateVars } from './textarea.css';
import type { TextAreaMapping, TextAreaProps } from './types';

const defaultMapping: TextAreaMapping = {
  font: inputs,
};

export const TextAreaContext =
  createContext<ContextValue<TextAreaProps, HTMLTextAreaElement>>(null);

/**
 * We implement a textarea as a content editable span to provide
 * improved UX, where the input area automatically grows with input
 * content length. This can be overriden by applying max-height
 * and overflow CSS, if desired.
 *
 * This also has the side effect of changing the target element in
 * the ref and event handlers. The normal `event.target.value` is not
 * available, and must be substituted with `event.currentTarget.textContent`
 */
export const TextArea = forwardRef(function TextArea(
  props: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  [props, ref] = useContextProps(props, ref, RACTextAreaContext);

  // Disallow props possibly provided by React Aria context
  // could be render props functions we don't want to support
  (props as RACTextAreaProps).className = undefined;
  (props as RACTextAreaProps).style = undefined;

  // Duplicate context prop merging to support React Aria's context
  // and our own which establishes a superset type for the props
  [props, ref] = useContextProps(props, ref, TextAreaContext);
  props = useDefaultProps(props, 'TextArea');

  const {
    classNames: classNamesProp,
    defaultValue = '',
    disabled: isDisabled = false,
    mapping: mappingProp,
    placeholder,
    readOnly: isReadOnly = false,
    required: isRequired = false,
    resize = 'none',
    size = 'lg',
    value: valueProp,
    onChange,
    onHoverStart,
    onHoverChange,
    onHoverEnd,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;

  const [value, setValue] = useControlledState(valueProp, defaultValue);
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
      mergeClassNames(textAreaClassNames, theme.TextArea, classNamesProp, {
        textarea: mapping.font[size],
      }),
    [theme.TextArea, classNamesProp, mapping.font, size],
  );

  const mergedProps = useMemo(
    () => mergeProps(rest, focusProps, hoverProps),
    [focusProps, hoverProps, rest],
  );

  const style = useMemo(
    () =>
      inlineVars(textAreaStateVars, {
        resize,
        size,
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
      resize,
      size,
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
    (event: FormEvent<HTMLSpanElement>) => {
      onChange?.(event);

      if (!event.defaultPrevented) {
        setValue(event.currentTarget.textContent ?? '');
      }
    },
    [onChange, setValue],
  );

  /**
   * In order to provide the UX of an "input" that auto grows in height
   * thats driven by content, we implement a content-editable span instead
   * of a textarea. However, this has the side effect that it must be
   * updated as an "uncontrolled" element, otherwise the cursor resets
   * to the beginning of the input area after every keystroke if the value
   * is passed in as "children"
   */
  useEffect(() => {
    if (typeof ref !== 'function' && ref?.current) {
      ref.current.textContent = `${value ?? ''}`;
    }
  }, [ref, value]);

  return (
    <div className={classNames?.container} style={style}>
      {/* biome-ignore lint/a11y/useFocusableInteractive: TODO: refactor */}
      <span
        {...mergedProps}
        {...hoverProps}
        ref={ref}
        className={classNames?.textarea}
        contentEditable={!(isDisabled || isReadOnly)}
        role='textbox'
        suppressContentEditableWarning
        onInput={handleChange}
        aria-invalid={ariaInvalid}
        data-placeholder={placeholder}
      />
    </div>
  );
});
