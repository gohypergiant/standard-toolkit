import { useControlledState } from '@react-stately/utils';
import {
  type ChangeEvent,
  type ForwardedRef,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import { useFocusRing, useHover } from 'react-aria';
import {
  type ContextValue,
  InputContext as RACInputContext,
  type InputProps as RACInputProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { inputs } from '../../styles';
import { inlineVars, mergeClassNames, mergeProps } from '../../utils';
import { inputClassNames, inputStateVars } from './input.css';
import { type InputMapping, type InputProps } from './types';

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
  delete (props as RACInputProps).className;
  delete (props as RACInputProps).style;

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
