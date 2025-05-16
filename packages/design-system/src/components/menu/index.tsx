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
  type ContextValue,
  DEFAULT_SLOT,
  MenuStateContext,
  Popover,
  type PopoverRenderProps,
  Provider,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  type MenuItemRenderProps as RACMenuItemRenderProps,
  type SectionProps,
  type SeparatorProps,
  type TextProps,
  UNSTABLE_CollectionRendererContext,
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
import { menuClassNames, menuItemStateVars, menuStateVars } from './menu.css';
import type {
  MenuItemProps,
  MenuListProps,
  MenuMapping,
  MenuProps,
} from './types';

const defaultMapping: MenuMapping = {
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

export const MenuContext =
  createContext<ContextValue<MenuProps, HTMLElement>>(null);

/**
 * Menu component that supports display and selection of menu items via a trigger (right-click or click)
 * Customization of React Aria's Menu and Menu Item components https://react-spectrum.adobe.com/react-aria/Menu.html
 */
export const Menu = forwardRef(function Menu(
  props: MenuProps,
  ref: ForwardedRef<HTMLElement>,
) {
  [props, ref] = useContextProps(props, ref, MenuContext);
  props = useDefaultProps(props, 'Menu');

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
      mergeClassNames(menuClassNames, classNamesProp, theme.Menu, {
        menu: { container: theme.className }, // required to consume global theme within Popover
      }),
    [classNamesProp, theme.Menu, theme.className],
  );

  const mapping = useMemo(
    () => ({
      ...defaultMapping,
      ...mappingProp,
    }),
    [mappingProp],
  );

  const style = useCallback(
    (renderProps: PopoverRenderProps) => ({
      ...theme.style, // required to consume global styles within Popover
      ...inlineVars(menuStateVars, {
        ...renderProps,
        size,
      }),
    }),
    [theme.style, size],
  );

  const values = useMemo<
    [
      [
        typeof MenuListContext,
        ContextValue<MenuListProps<unknown>, HTMLDivElement>,
      ],
    ]
  >(
    () => [[MenuListContext, { classNames, mapping, size }]],
    [classNames, mapping, size],
  );

  const children = useCallback(
    (renderProps: PopoverRenderProps) => (
      <Provider values={values}>
        <div className={classNames?.menu?.menu}>
          {callRenderProps(childrenProp, {
            ...renderProps,
            size,
            defaultChildren: null,
          })}
        </div>
      </Provider>
    ),
    [childrenProp, classNames?.menu?.menu, size, values],
  );

  return (
    <Popover
      {...rest}
      ref={ref}
      className={classNames?.menu?.container}
      style={style}
    >
      {children}
    </Popover>
  );
});

export const MenuListContext =
  createContext<ContextValue<MenuListProps<unknown>, HTMLDivElement>>(null);

type MenuListContexts = [
  [
    typeof MenuItemContext,
    ContextValue<MenuItemProps<unknown>, HTMLDivElement>,
  ],
  [typeof AriaSectionContext, ContextValue<SectionProps<object>, HTMLElement>],
  [
    typeof AriaHeaderContext,
    ContextValue<HTMLAttributes<HTMLElement>, HTMLElement>,
  ],
  [typeof AriaSeparatorContext, ContextValue<SeparatorProps, HTMLElement>],
];

export const MenuList = forwardRef(function MenuList<T extends object>(
  props: MenuListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, MenuListContext);
  props = useDefaultProps(props, 'Menu');

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
      mergeClassNames(menuClassNames, theme.Menu, classNamesProp, {
        list: { header: mapping.header[size] },
      }),
    [theme.Menu, classNamesProp, mapping.header, size],
  );

  const values = useMemo<MenuListContexts>(
    () => [
      [MenuItemContext, { classNames, mapping, size }],
      [AriaSectionContext, { className: classNames?.list?.section }],
      [AriaHeaderContext, { className: classNames?.list?.header }],
      [AriaSeparatorContext, { className: classNames?.list?.separator }],
    ],
    [classNames, mapping, size],
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
  }, [childrenProp, classNames?.list?.list, items]);

  const renderer = useMemo<CollectionRenderer>(
    () => createCollectionRenderer(MenuStateContext, values),
    [values],
  );

  return (
    <UNSTABLE_CollectionRendererContext.Provider value={renderer}>
      <Provider values={values}>
        <RACMenu<T>
          {...rest}
          ref={ref}
          className={classNames?.list?.container}
          items={items}
          selectionMode={selectionMode}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </RACMenu>
      </Provider>
    </UNSTABLE_CollectionRendererContext.Provider>
  );
});

export const MenuItemContext =
  createContext<ContextValue<MenuItemProps<unknown>, HTMLDivElement>>(null);

export const MenuItem = forwardRef(function MenuItem<T extends object>(
  props: MenuItemProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, MenuItemContext);
  props = useDefaultProps(props, 'MenuItem');

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
      mergeClassNames(menuClassNames, classNamesProp, theme.Menu, {
        item: {
          description: mapping.description[size],
          label: mapping.label[size],
          shortcut: mapping.shortcut[size],
        },
      }),
    [theme.Menu, classNamesProp, mapping, size],
  );

  const [descriptionRef, hasDescription] = useSlot();

  const style = useCallback(
    (renderProps: RACMenuItemRenderProps) =>
      inlineVars(menuItemStateVars, { ...renderProps, size, hasDescription }),
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
            [DEFAULT_SLOT]: {},
            label: { className: classNames?.item?.label },
            description: {
              ref: descriptionRef,
              className: classNames?.item?.description,
            },
          },
        },
      ],
      [
        IconContext,
        {
          slots: {
            [DEFAULT_SLOT]: { classNames: classNames?.item?.icon },
            more: { classNames: classNames?.item?.more },
          },
        },
      ],
      [AriaKeyboardContext, { className: classNames?.item?.shortcut }],
    ],
    [
      classNames?.item?.label,
      descriptionRef,
      classNames?.item?.description,
      classNames?.item?.icon,
      classNames?.item?.more,
      classNames?.item?.shortcut,
    ],
  );

  const children = useCallback(
    (renderProps: RACMenuItemRenderProps) => {
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
    <RACMenuItem<T>
      {...rest}
      id={id ?? textValue}
      ref={ref as ForwardedRef<T>}
      className={classNames?.item?.container}
      style={style}
      textValue={textValue}
    >
      {children}
    </RACMenuItem>
  );
});
