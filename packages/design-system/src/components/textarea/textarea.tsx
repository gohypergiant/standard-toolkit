import { useControlledState } from '@react-stately/utils';
import {
  type FormEvent,
  type ForwardedRef,
  createContext,
  forwardRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useFocusRing, useHover } from 'react-aria';
import {
  type ContextValue,
  TextAreaContext as RACTextAreaContext,
  type TextAreaProps as RACTextAreaProps,
  useContextProps,
} from 'react-aria-components';
import { useDefaultProps, useTheme } from '../../hooks';
import { inputs } from '../../styles';
import { inlineVars, mergeClassNames, mergeProps } from '../../utils';
import { textAreaClassNames, textAreaStateVars } from './textarea.css';
import { type TextAreaMapping, type TextAreaProps } from './types';

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
  delete (props as RACTextAreaProps).className;
  delete (props as RACTextAreaProps).style;

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
      <span
        {...mergedProps}
        {...hoverProps}
        ref={ref}
        className={classNames?.textarea}
        contentEditable={!isDisabled && !isReadOnly}
        role='textbox'
        suppressContentEditableWarning
        onInput={handleChange}
        aria-invalid={ariaInvalid}
        data-placeholder={placeholder}
      />
    </div>
  );
});
