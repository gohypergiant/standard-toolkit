import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
} from 'react';
import {
  Collection,
  ListBox,
  ListBoxItem,
  Provider,
  Section,
  useContextProps,
  type ContextValue,
  type ListBoxItemRenderProps,
  type ListBoxRenderProps,
} from 'react-aria-components';
import { useDefaultProps, useTheme } from '../../hooks';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  pickerClassNames,
  pickerItemStateVars,
  pickerStateVars,
} from './picker.css';
import type { PickerItemProps, PickerProps } from './types';

export const PickerContext =
  createContext<ContextValue<PickerProps<unknown>, HTMLDivElement>>(null);

export const PickerItemContext =
  createContext<ContextValue<PickerItemProps<unknown>, HTMLDivElement>>(null);

/**
 * Generic stylable picker that supports the functionality (sans drag and drop) of
 * React Aria's ListBox: https://react-spectrum.adobe.com/react-aria/ListBox.html
 *
 * NOTE: The picker items does not support sections or separators
 */
export const Picker = forwardRef(function Picker<T extends object>(
  props: PickerProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, PickerContext);

  props = useDefaultProps(props, 'Picker');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    columns,
    items,
    layout = 'stack',
    orientation = 'horizontal',
    selectionMode = 'single',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(pickerClassNames, theme.Picker, classNamesProp),
    [theme.Picker, classNamesProp],
  );

  const values = useMemo<
    [
      [
        typeof PickerItemContext,
        ContextValue<PickerItemProps<unknown>, HTMLDivElement>,
      ],
    ]
  >(() => [[PickerItemContext, { classNames }]], [classNames]);

  const style = useCallback(
    ({ state, ...renderProps }: ListBoxRenderProps) =>
      inlineVars(pickerStateVars, {
        ...renderProps,
        columns,
        layout,
        orientation,
      }),
    [columns, layout, orientation],
  );

  const children = useMemo(() => {
    if (!(childrenProp || items)) {
      return null;
    }

    return (
      <Section
        className={classNames?.list?.list}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {typeof childrenProp === 'function' ? (
          <Collection items={items}>{childrenProp}</Collection>
        ) : (
          childrenProp
        )}
      </Section>
    );
  }, [childrenProp, items, classNames?.list?.list, ariaLabel, ariaLabelledBy]);

  return (
    <Provider values={values}>
      <ListBox<T>
        {...rest}
        ref={ref}
        className={classNames?.list?.container}
        items={items}
        layout={layout}
        orientation={orientation}
        selectionMode={selectionMode}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </ListBox>
    </Provider>
  );
});

export const PickerItem = forwardRef(function PickerItem<T extends object>(
  props: PickerItemProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, PickerItemContext);

  const {
    children: childrenProp,
    id,
    classNames: classNamesProp,
    textValue = typeof childrenProp === 'string' ? childrenProp : undefined,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(pickerClassNames, theme.Picker, classNamesProp),
    [theme.Picker, classNamesProp],
  );

  const style = useCallback(
    (renderProps: ListBoxItemRenderProps) =>
      inlineVars(pickerItemStateVars, renderProps),
    [],
  );

  const children = useCallback(
    (renderProps: ListBoxItemRenderProps) => (
      <div className={classNames?.item?.item}>
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </div>
    ),
    [childrenProp, classNames?.item?.item],
  );

  return (
    <ListBoxItem<T>
      {...rest}
      ref={ref as ForwardedRef<T>}
      id={id ?? textValue}
      className={classNames?.item?.container}
      style={style}
      textValue={textValue}
    >
      {children}
    </ListBoxItem>
  );
});
