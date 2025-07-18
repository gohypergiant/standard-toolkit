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
  Children,
  createContext,
  type ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  type ContextValue,
  Provider,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  type SlotProps,
} from 'react-aria-components';
import { useContextProps } from '../../hooks/use-context-props';
import { useDefaultProps } from '../../hooks/use-defaults';
import { usePropagatingPress } from '../../hooks/use-propagating-press';
import { useTheme } from '../../hooks/use-theme';
import { inlineVars } from '../../utils/css';
import { callRenderProps, mergeClassNames } from '../../utils/props';
import {
  tabListStateVars,
  tabPanelStateVars,
  tabPanelsStateVars,
  tabStateVars,
  tabsClassNames,
} from './tabs.css';
import type { RequiredDeep } from 'type-fest';
import type {
  TabListProps,
  TabPanelProps,
  TabPanelRenderProps,
  TabPanelsProps,
  TabProps,
  TabRenderProps,
  TabsClassNames,
  TabsProps,
} from './types';

export const TEST_IDS: RequiredDeep<TabsClassNames> = {
  tabs: 'tabs',
  list: {
    container: 'tabs.list.container',
    list: 'tabs.list',
  },
  tab: {
    container: 'tabs.tab.container',
    tab: 'tabs.tab',
  },
  panels: {
    container: 'tabs.panels.container',
    panels: 'tabs.panels',
  },
  panel: {
    container: 'tabs.panel.container',
    panel: 'tabs.panel',
  },
};

export const TabsContext =
  createContext<ContextValue<TabsProps, HTMLDivElement>>(null);

/**
 * A required wrapper for other Tabs components, which manages
 * and provides the state context. Other Tabs components will
 * throw an error if not wrapped with this component
 *
 * NOTE: TabList & TabPanels do not have to be direct children
 * of this component. Additional layout can be introduced around
 * this components children
 */
export const Tabs = forwardRef(function Tabs(
  props: TabsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TabsContext);
  props = useDefaultProps(props, 'Tabs');

  const { classNames: classNamesProp, ...rest } = props;
  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tabsClassNames, theme.Tabs, classNamesProp),
    [theme.Tabs, classNamesProp],
  );

  const values = useMemo<
    [
      [
        typeof TabListContext,
        ContextValue<TabListProps<unknown>, HTMLDivElement>,
      ],
      [typeof TabPanelsContext, ContextValue<TabPanelsProps, HTMLDivElement>],
    ]
  >(
    () => [
      [TabListContext, { classNames }],
      [TabPanelsContext, { classNames }],
    ],
    [classNames],
  );

  return (
    <Provider values={values}>
      <RACTabs
        {...rest}
        ref={ref}
        className={classNames?.tabs}
        data-testid={TEST_IDS.tabs}
      />
    </Provider>
  );
});

export const TabListContext =
  createContext<ContextValue<TabListProps<unknown>, HTMLDivElement>>(null);

/**
 * Parent of Tab
 */
export const TabList = forwardRef(function TabList<T extends object>(
  props: TabListProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TabListContext);
  props = useDefaultProps(props, 'TabList');

  const {
    children,
    classNames: classNamesProp,
    anchor = 'end',
    items,
    orientation = 'horizontal',
    size = 'lg',
    variant = 'border',
    align = orientation === 'horizontal' ? 'center' : 'start',
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tabsClassNames, theme.Tabs, classNamesProp),
    [theme.Tabs, classNamesProp],
  );

  const values = useMemo<[[typeof TabContext, Omit<TabProps, 'id'>]]>(
    () => [[TabContext, { classNames }]],
    [classNames],
  );

  const style = useMemo(
    () =>
      inlineVars(tabListStateVars, {
        align,
        anchor,
        count: items ? Array.from(items).length : Children.count(children),
        orientation,
        size,
        variant,
      }),
    [align, anchor, items, children, orientation, size, variant],
  );

  return (
    <Provider values={values}>
      <div
        className={classNames?.list?.container}
        style={style}
        data-testid={TEST_IDS.list.container}
      >
        <RACTabList<T>
          {...rest}
          ref={ref}
          className={classNames?.list?.list}
          items={items}
          data-testid={TEST_IDS.list.list}
        >
          {children}
        </RACTabList>
      </div>
    </Provider>
  );
});

export const TabContext =
  createContext<ContextValue<Omit<TabProps & SlotProps, 'id'>, HTMLDivElement>>(
    null,
  );

/**
 * Must be a direct child of TabList
 */
export const Tab = forwardRef(function Tab(
  props: TabProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TabContext);
  props = useDefaultProps(props, 'Tab');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    onPress,
    onPressChange,
    onPressEnd,
    onPressStart,
    onPressUp,
    ...rest
  } = props;

  const { pressProps } = usePropagatingPress({
    onPress,
    onPressChange,
    onPressEnd,
    onPressStart,
    onPressUp,
  });

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tabsClassNames, theme.Tabs, classNamesProp),
    [theme.Tabs, classNamesProp],
  );

  const style = useCallback(
    (renderProps: TabRenderProps) => inlineVars(tabStateVars, renderProps),
    [],
  );

  const children = useCallback(
    (renderProps: TabRenderProps) => (
      <div
        {...pressProps}
        className={classNames?.tab?.tab}
        data-testid={TEST_IDS.tab.tab}
      >
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </div>
    ),
    [pressProps, classNames?.tab?.tab, childrenProp],
  );

  return (
    <RACTab
      {...rest}
      ref={ref}
      className={classNames?.tab?.container}
      style={style}
      data-testid={TEST_IDS.tab.container}
    >
      {children}
    </RACTab>
  );
});

export const TabPanelsContext =
  createContext<ContextValue<TabPanelsProps, HTMLDivElement>>(null);

/**
 * Parent of TabPanel, but only required if using shouldForceMount=true
 */
export const TabPanels = forwardRef(function TabPanels(
  props: TabPanelsProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TabPanelsContext);
  props = useDefaultProps(props, 'TabPanels');

  const {
    children,
    classNames: classNamesProp,
    shouldForceMount = false,
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tabsClassNames, theme.Tabs, classNamesProp),
    [theme.Tabs, classNamesProp],
  );

  const style = useMemo(
    () => inlineVars(tabPanelsStateVars, { shouldForceMount }),
    [shouldForceMount],
  );

  const values = useMemo<
    [
      [
        typeof TabPanelContext,
        ContextValue<Omit<TabPanelProps, 'id'>, HTMLDivElement>,
      ],
    ]
  >(
    () => [[TabPanelContext, { classNames, shouldForceMount }]],
    [classNames, shouldForceMount],
  );

  return (
    <Provider values={values}>
      <div
        ref={ref}
        className={classNames?.panels?.container}
        style={style}
        data-testid={TEST_IDS.panels.container}
      >
        <div
          className={classNames?.panels?.panels}
          data-testid={TEST_IDS.panels.panels}
        >
          {children}
        </div>
      </div>
    </Provider>
  );
});

export const TabPanelContext =
  createContext<ContextValue<Omit<TabPanelProps, 'id'>, HTMLDivElement>>(null);

/**
 * Must be direct child of TabPanels if TabPanel implements shouldForceMount=true
 *
 * Othewise can be used anywhere inside of Tabs. TabPanels may be desirable to use
 * if theme implements any styles that adjust layout
 */
export const TabPanel = forwardRef(function TabPanel(
  props: TabPanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  [props, ref] = useContextProps(props, ref, TabPanelContext);
  props = useDefaultProps(props, 'TabPanel');

  const {
    children: childrenProp,
    classNames: classNamesProp,
    shouldForceMount = false,
    ...rest
  } = props;

  const theme = useTheme();

  const classNames = useMemo(
    () => mergeClassNames(tabsClassNames, theme.Tabs, classNamesProp),
    [theme.Tabs, classNamesProp],
  );

  const style = useCallback(
    (renderProps: TabPanelRenderProps) =>
      inlineVars(tabPanelStateVars, { ...renderProps, shouldForceMount }),
    [shouldForceMount],
  );

  const children = useCallback(
    (renderProps: TabPanelRenderProps) => (
      <div
        className={classNames?.panel?.panel}
        data-testid={TEST_IDS.panel.panel}
      >
        {callRenderProps(childrenProp, {
          ...renderProps,
          defaultChildren: null,
        })}
      </div>
    ),
    [childrenProp, classNames?.panel?.panel],
  );

  return (
    <RACTabPanel
      {...rest}
      ref={ref}
      className={classNames?.panel?.container}
      shouldForceMount={shouldForceMount}
      style={style}
      data-testid={TEST_IDS.panel.container}
    >
      {children}
    </RACTabPanel>
  );
});
