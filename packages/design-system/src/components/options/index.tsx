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

import {
  type ForwardedRef,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Collection,
  type CollectionRenderer,
  CollectionRendererContext,
  type ContextValue,
  ListBox,
  ListBoxItem,
  type ListBoxItemRenderProps,
  type ListBoxRenderProps,
  ListStateContext,
  Popover,
  type PopoverRenderProps,
  Provider,
  type SectionProps,
  type SeparatorProps,
  type TextProps,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { useSlot } from '../../hooks/use-slot';
import { useTheme } from '../../hooks/use-theme';
import { bodies, headings } from '../../styles/typography.css';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
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
import { IconContext } from '../icon';
import type { IconProps } from '../icon/types';
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
    // @ts-expect-error ts unnecessarily guarding against null state
    () => createCollectionRenderer(ListStateContext, values),
    [values],
  );

  return (
    <CollectionRendererContext.Provider value={renderer}>
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
    </CollectionRendererContext.Provider>
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
