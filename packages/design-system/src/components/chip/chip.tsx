import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
} from 'react';
import {
  Provider,
  TextContext as RACTextContext,
  Tag,
  TagGroup,
  TagList,
  type ContextValue,
  type TagRenderProps,
  type TextProps,
} from 'react-aria-components';
import { useContextProps, useDefaultProps, useTheme } from '../../hooks';
import { bodies } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import { AriaTextContext } from '../aria';
import { ButtonContext, type ButtonProps } from '../button';
import { chipClassNames, chipStateVars } from './chip.css';
import type {
  ChipGroupProps,
  ChipItemProps,
  ChipListProps,
  ChipMapping,
  ChipProps,
} from './types';

const defaults: Required<Pick<ChipProps, 'color' | 'size'>> = {
  color: 'info',
  size: 'sm',
};

const defaultMapping: ChipMapping = {
  font: {
    sm: bodies.sm,
    lg: bodies.sm,
  },
  remove: {
    sm: { size: 'sm', variant: 'icon' },
    lg: { size: 'sm', variant: 'icon' },
  },
};

export function Chip(props: ChipProps) {
  props = useDefaultProps(props, 'Chip');

  const {
    children,
    classNames: classNamesProp,
    color = defaults.color,
    mapping: mappingProp,
    size = defaults.size,
  } = props;

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
      mergeClassNames(chipClassNames, theme.Chip, classNamesProp, {
        chip: mapping.font[size],
      }),
    [theme.Chip, classNamesProp, mapping, size],
  );

  const values = useMemo<
    [[typeof AriaTextContext, ContextValue<TextProps, HTMLElement>]]
  >(
    () => [[AriaTextContext, { className: classNames?.label }]],
    [classNames?.label],
  );

  const style = useMemo(
    () =>
      inlineVars(chipStateVars, {
        allowsRemoving: false,
        color,
        selectionBehavior: 'toggle',
        selectionMode: 'none',
        size,
        isDisabled: false,
        isFocused: false,
        isFocusVisible: false,
        isHovered: false,
        isPressed: false,
        isSelected: false,
      }),
    [color, size],
  );

  return (
    <Provider values={values}>
      <div className={classNames?.container} style={style}>
        <div className={classNames?.chip}>{children}</div>
      </div>
    </Provider>
  );
}

export const ChipContext =
  createContext<ContextValue<ChipItemProps, HTMLDivElement>>(null);

/**
 * Must be used in conjunction with ChipList & ChipGroup and
 * cannot be used outside of ChipList, else will throw error
 *
 * Color & Size props can be passed in from ChipGroup and overriden
 * on each instance of this components
 *
 * Order of precedence (from lowest to highest):
 * Design System Defaults of Chip
 * Global Defaults of ChipGroup
 * Instance of ChipGroup
 * Global Defaults of ChipItem
 * Instance of ChipItem
 */
export const ChipItem = forwardRef(function ChipItem(
  props: ChipItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, ChipContext);
  props = useDefaultProps(props, 'Chip');

  const {
    children: childrenProp,
    id,
    classNames: classNamesProp,
    color = defaults.color,
    size = defaults.size,
    textValue,
    mapping: mappingProp,
    ...rest
  } = props;

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
      mergeClassNames(chipClassNames, theme.Chip, classNamesProp, {
        chip: mapping.font[size],
      }),
    [theme.Chip, classNamesProp, mapping, size],
  );

  const values = useMemo<
    [
      [typeof RACTextContext, ContextValue<TextProps, HTMLElement>],
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [typeof ButtonContext, ContextValue<ButtonProps, HTMLButtonElement>],
    ]
  >(
    () => [
      // Because ChipGroup (TagGroup) implements a TextContext, we need to block it inside of the Chip
      // so that there isn't a conflict of with our AriaTextContext. Otherwise there are slot errors
      [RACTextContext, null],
      [AriaTextContext, { className: classNames?.label }],
      [
        ButtonContext,
        {
          ...mapping.remove[size],
          classNames: { button: classNames?.remove },
          slot: 'remove',
        },
      ],
    ],
    [classNames?.label, classNames?.remove, mapping, size],
  );

  const style = useCallback(
    (renderProps: TagRenderProps) =>
      inlineVars(chipStateVars, {
        ...renderProps,
        color,
        size,
      }),
    [color, size],
  );

  const children = useCallback(
    (renderProps: TagRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.chip}>
          {callRenderProps(childrenProp, renderProps)}
        </div>
      </Provider>
    ),
    [values, classNames?.chip, childrenProp],
  );

  return (
    <Tag
      {...rest}
      ref={ref}
      id={id ?? textValue}
      className={classNames?.container}
      style={style}
      textValue={textValue}
    >
      {children}
    </Tag>
  );
});

/**
 * Must be used in conjunction with ChipItem & ChipGroup and
 * cannot be used outside of ChipGroup, else will throw error
 */
export function ChipList<T extends object>({
  classNames: classNamesProp,
  ...rest
}: ChipListProps<T>) {
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(chipClassNames, theme.Chip, classNamesProp),
    [theme.Chip, classNamesProp],
  );

  return <TagList<T> {...rest} className={classNames?.list} />;
}

export const ChipGroupContext =
  createContext<ContextValue<ChipGroupProps, HTMLDivElement>>(null);

/**
 * Color & Size props are passed down to ChipItem but can be overridden
 * on each component if desired
 */
export const ChipGroup = forwardRef(function ChipGroup(
  props: ChipGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, ChipGroupContext);
  props = useDefaultProps(props, 'ChipGroup');

  const { children, classNames: classNamesProp, color, size, ...rest } = props;
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(chipClassNames, theme.Chip, classNamesProp),
    [theme.Chip, classNamesProp],
  );

  const values = useMemo<
    [[typeof ChipContext, ContextValue<ChipItemProps, HTMLDivElement>]]
  >(
    () => [[ChipContext, { classNames, color, size }]],
    [classNames, color, size],
  );

  return (
    <TagGroup {...rest} ref={ref} className={classNames?.group}>
      <Provider values={values}>{children}</Provider>
    </TagGroup>
  );
});
