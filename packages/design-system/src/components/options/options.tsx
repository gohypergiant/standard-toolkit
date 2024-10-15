import {
  createContext,
  forwardRef,
  useCallback,
  useMemo,
  type ForwardedRef,
  type HTMLAttributes,
} from 'react';
import {
  Collection,
  ListBox,
  ListBoxItem,
  ListStateContext,
  Popover,
  Provider,
  UNSTABLE_CollectionRendererContext,
  type CollectionRenderer,
  type ContextValue,
  type ListBoxItemRenderProps,
  type ListBoxRenderProps,
  type PopoverRenderProps,
  type SectionProps,
  type SeparatorProps,
  type TextProps,
} from 'react-aria-components';
import {
  useContextProps,
  useDefaultProps,
  useSlot,
  useTheme,
} from '../../hooks';
import { bodies, headings } from '../../styles';
import { callRenderProps, inlineVars, mergeClassNames } from '../../utils';
import {
  AriaHeaderContext,
  AriaKeyboardContext,
  AriaSection,
  AriaSectionContext,
  AriaSeparatorContext,
  AriaText,
  AriaTextContext,
} from '../aria';
import { createCollectionRenderer } from '../collection';
import { IconContext, type IconProps } from '../icon';
import {
  optionsClassNames,
  optionsItemStateVars,
  optionsStateVars,
} from './options.css';
import type {
  OptionsItemProps,
  OptionsListProps,
  OptionsMapping,
  OptionsProps,
} from './types';

const defaultMapping: OptionsMapping = {
  description: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
  header: {
    sm: headings.v4,
    lg: headings.v5,
  },
  label: {
    sm: bodies.sm,
    lg: bodies.sm,
  },
  shortcut: {
    sm: bodies.xs,
    lg: bodies.xs,
  },
};

const defaultSize = 'lg';

export const OptionsContext =
  createContext<ContextValue<OptionsProps, HTMLElement>>(null);

export const Options = forwardRef(function Options(
  props: OptionsProps,
  ref: ForwardedRef<HTMLElement>,
) {
  [props, ref] = useContextProps(props, ref, OptionsContext);
  props = useDefaultProps(props, 'Options');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = defaultSize,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () =>
      mergeClassNames(optionsClassNames, theme.Options, classNamesProp, {
        options: {
          container: theme.className, // required to consume global theme within Popover
        },
      }),
    [theme.className, theme.Options, classNamesProp],
  );

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const style = useCallback(
    ({ ...renderProps }: PopoverRenderProps) => ({
      ...theme.style, // required to consume global styles within Popover
      ...inlineVars(optionsStateVars, {
        ...renderProps,
        size,
      }),
    }),
    [theme.style, size],
  );

  const values = useMemo<
    [
      [
        typeof OptionsListContext,
        ContextValue<OptionsListProps<object>, HTMLDivElement>,
      ],
    ]
  >(
    () => [[OptionsListContext, { classNames, mapping, size }]],
    [classNames, mapping, size],
  );

  const children = useCallback(
    (renderProps: PopoverRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.options?.options}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            size,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.options?.options, size, values],
  );

  return (
    <Popover
      {...rest}
      ref={ref}
      className={classNames?.options?.container}
      style={style}
    >
      {children}
    </Popover>
  );
});

export const OptionsListContext =
  createContext<ContextValue<OptionsListProps<object>, HTMLDivElement>>(null);

type OptionsListContexts = [
  [
    typeof OptionsItemContext,
    ContextValue<OptionsItemProps<object>, HTMLDivElement>,
  ],
  [typeof AriaSectionContext, ContextValue<SectionProps<object>, HTMLElement>],
  [
    typeof AriaHeaderContext,
    ContextValue<HTMLAttributes<HTMLElement>, HTMLElement>,
  ],
  [typeof AriaSeparatorContext, ContextValue<SeparatorProps, HTMLElement>],
];

export const OptionsList = forwardRef(function OptionList<T extends object>(
  props: OptionsListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, OptionsListContext);
  props = useDefaultProps(props, 'OptionsList');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    items,
    mapping: mappingProp,
    selectionMode = 'single',
    size = defaultSize,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
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
      mergeClassNames(optionsClassNames, theme.Options, classNamesProp, {
        list: { header: mapping.header[size] },
      }),
    [theme.Options, classNamesProp, mapping, size],
  );

  const values = useMemo<OptionsListContexts>(
    () => [
      [OptionsItemContext, { classNames, size, mapping }],
      [AriaSectionContext, { className: classNames?.list?.section }],
      [AriaHeaderContext, { className: classNames?.list?.header }],
      [AriaSeparatorContext, { className: classNames?.list?.separator }],
    ],
    [classNames, size, mapping],
  );

  const style = useCallback(
    (renderProps: ListBoxRenderProps) =>
      inlineVars(optionsItemStateVars, { ...renderProps, size }),
    [size],
  );

  const children = useMemo(() => {
    if (!(childrenProp || items)) {
      return null;
    }

    return (
      <AriaSection className={classNames?.list?.list}>
        {typeof childrenProp === 'function' ? (
          <Collection items={items}>{childrenProp}</Collection>
        ) : (
          childrenProp
        )}
      </AriaSection>
    );
  }, [classNames?.list?.list, childrenProp, items]);

  const renderer = useMemo<CollectionRenderer>(
    () => createCollectionRenderer(ListStateContext, values),
    [values],
  );

  return (
    <UNSTABLE_CollectionRendererContext.Provider value={renderer}>
      <Provider values={values}>
        <ListBox<T>
          {...rest}
          ref={ref}
          className={classNames?.list?.container}
          items={items}
          selectionMode={selectionMode}
          style={style}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </ListBox>
      </Provider>
    </UNSTABLE_CollectionRendererContext.Provider>
  );
});

export const OptionsItemContext =
  createContext<ContextValue<OptionsItemProps<object>, HTMLDivElement>>(null);

export const OptionsItem = forwardRef(function OptionItem<T extends object>(
  props: OptionsItemProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, OptionsItemContext);
  props = useDefaultProps(props, 'OptionsItem');

  const {
    id,
    children: childrenProp,
    classNames: classNamesProp,
    mapping: mappingProp,
    size = defaultSize,
    textValue = typeof childrenProp === 'string' ? childrenProp : undefined,
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
      mergeClassNames(optionsClassNames, classNamesProp, theme.Options, {
        item: {
          description: mapping.description[size],
          label: mapping.label[size],
          shortcut: mapping.shortcut[size],
        },
      }),
    [theme.Options, classNamesProp, mapping, size],
  );

  const [descriptionRef, hasDescription] = useSlot();

  const style = useCallback(
    (renderProps: ListBoxItemRenderProps) =>
      inlineVars(optionsItemStateVars, {
        ...renderProps,
        size,
        hasDescription,
      }),
    [hasDescription, size],
  );

  const values = useMemo<
    [
      [typeof AriaTextContext, ContextValue<TextProps, HTMLElement>],
      [typeof IconContext, ContextValue<IconProps, HTMLDivElement>],
      [
        typeof AriaKeyboardContext,
        ContextValue<HTMLAttributes<HTMLElement>, HTMLElement>,
      ],
    ]
  >(
    () => [
      [
        AriaTextContext,
        {
          slots: {
            label: { className: classNames?.item?.label },
            description: {
              ref: descriptionRef,
              className: classNames?.item?.description,
            },
          },
        },
      ],
      [IconContext, { classNames: classNames?.item?.icon }],
      [AriaKeyboardContext, { className: classNames?.item?.shortcut }],
    ],
    [
      classNames?.item?.label,
      descriptionRef,
      classNames?.item?.description,
      classNames?.item?.icon,
      classNames?.item?.shortcut,
    ],
  );

  const children = useCallback(
    (renderProps: ListBoxItemRenderProps) => {
      const content = callRenderProps(childrenProp, {
        ...renderProps,
        size,
        defaultChildren: null,
      });

      return (
        <Provider values={values}>
          <div className={classNames?.item?.item}>
            {typeof content === 'string' ? (
              <AriaText slot='label'>{content}</AriaText>
            ) : (
              content
            )}
          </div>
        </Provider>
      );
    },
    [childrenProp, classNames?.item?.item, size, values],
  );

  return (
    <ListBoxItem<T>
      {...rest}
      id={id ?? textValue}
      ref={ref as ForwardedRef<T>}
      className={classNames?.item?.container}
      style={style}
      textValue={textValue}
    >
      {children}
    </ListBoxItem>
  );
});