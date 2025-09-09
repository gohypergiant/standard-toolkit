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
'use client';

import 'client-only';
import { Broadcast } from '@accelint/bus';
import { isUUID, type UniqueId } from '@accelint/core';
import { Pressable } from '@react-aria/interactions';
import {
  type ComponentPropsWithRef,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { composeRenderProps, Header, Heading } from 'react-aria-components';
import { containsExactChildren } from '@/lib/react';
import { ToggleButton } from '../button';
import { Icon } from '../icon';
import {
  ViewStack,
  ViewStackContext,
  ViewStackEventHandlers,
} from '../view-stack';
import { ViewStackEventTypes } from '../view-stack/events';
import { DrawerEventTypes } from './events';
import { DrawerMenuStyles, DrawerStyles, DrawerTitleStyles } from './styles';
import type { ViewStackViewProps } from '../view-stack/types';
import type {
  DrawerContextValue,
  DrawerEvent,
  DrawerLayoutProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerOpenEvent,
  DrawerProps,
  DrawerTitleProps,
  DrawerToggleEvent,
  DrawerTriggerProps,
} from './types';

const { layout, main, drawer, panel, view, header, content, footer } =
  DrawerStyles();
const { menu, item } = DrawerMenuStyles();
const bus = Broadcast.getInstance<DrawerEvent>();

export const DrawerContext = createContext<DrawerContextValue>({
  register: () => undefined,
  unregister: () => undefined,
});

export const DrawerEventHandlers = {
  ...ViewStackEventHandlers,
  close: ViewStackEventHandlers.clear,
  open: (view: UniqueId) => bus.emit(DrawerEventTypes.open, { view }),
  toggle: (view: UniqueId) => bus.emit(DrawerEventTypes.toggle, { view }),
} as const;

function DrawerTrigger({ children, for: events }: DrawerTriggerProps) {
  const { parent } = useContext(ViewStackContext);

  function handlePress() {
    for (const type of Array.isArray(events) ? events : [events]) {
      let [event, id] = (isUUID(type) ? ['push', type] : type.split(':')) as [
        'back' | 'clear' | 'close' | 'open' | 'push' | 'reset' | 'toggle',
        UniqueId | undefined | null,
      ];

      id ??= parent;

      if (!id) {
        continue;
      }

      DrawerEventHandlers[event](id);
    }
  }

  return <Pressable onPress={handlePress}>{children}</Pressable>;
}
DrawerTrigger.displayName = 'Drawer.Trigger';

function DrawerLayoutMain({
  className,
  ...rest
}: ComponentPropsWithRef<'main'>) {
  return <main {...rest} className={main({ className })} />;
}
DrawerLayoutMain.displayName = 'Drawer.Layout.Main';

function DrawerLayout({
  className,
  extend = 'left right',
  push,
  ...rest
}: DrawerLayoutProps) {
  return (
    <div
      {...rest}
      className={layout({ className })}
      data-extend={extend}
      data-push={push}
    />
  );
}
DrawerLayout.displayName = 'Drawer.Layout';
DrawerLayout.Main = DrawerLayoutMain;

function DrawerMenuItem({
  for: id,
  children,
  className,
  toggle,
  views,
  ...rest
}: DrawerMenuItemProps) {
  const { parent, stack } = useContext(ViewStackContext);
  const view = stack.at(-1);
  const action = toggle ? 'toggle' : 'open';

  if (!parent) {
    return null;
  }

  return (
    <DrawerTrigger for={`${action}:${id}`}>
      <ToggleButton
        {...rest}
        className={composeRenderProps(className, (className) =>
          item({ className }),
        )}
        role='tab'
        variant='icon'
        isSelected={id === view || !!views?.some((view) => id === view)}
      >
        {composeRenderProps(children, (children) => (
          <Icon>{children}</Icon>
        ))}
      </ToggleButton>
    </DrawerTrigger>
  );
}
DrawerMenuItem.displayName = 'Drawer.Menu.Item';

function DrawerMenu({
  className,
  position = 'center',
  children,
  ...rest
}: DrawerMenuProps) {
  containsExactChildren({
    children,
    componentName: DrawerMenu.displayName,
    restrictions: [
      [DrawerMenuItem, { min: 1 }],
      [DrawerTrigger, { min: 0, max: 0 }],
    ],
  });
  return (
    <nav
      {...rest}
      className={menu({
        position,
        className,
      })}
    >
      {children}
    </nav>
  );
}
DrawerMenu.displayName = 'Drawer.Menu';
DrawerMenu.Item = DrawerMenuItem;

function DrawerPanel({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={panel({ className })} />;
}
DrawerPanel.displayName = 'Drawer.Panel';

function DrawerView({
  id,
  children,
  className,
  ...rest
}: ViewStackViewProps & ComponentPropsWithRef<'div'>) {
  const { register, unregister } = useContext(DrawerContext);

  useEffect(() => {
    register(id);

    () => unregister(id);
  }, [register, unregister, id]);

  return (
    <ViewStack.View id={id}>
      <div {...rest} className={view({ className })} role='tabpanel'>
        {children}
      </div>
    </ViewStack.View>
  );
}
DrawerView.displayName = 'Drawer.View';

/**
 * To change size of title, use the `level` prop: `1`-`3` (large), `4`-`6` (medium).
 *
 * `level` also changes the semantic heading tag number `h1`-`h6`
 */
function DrawerHeaderTitle({ className, level, ...rest }: DrawerTitleProps) {
  return (
    <Heading
      {...rest}
      className={DrawerTitleStyles({ className, level })}
      level={level}
    />
  );
}
DrawerHeaderTitle.displayName = 'Drawer.Title';

function DrawerHeader({ className, ...rest }: ComponentPropsWithRef<'header'>) {
  return <Header {...rest} className={header({ className })} />;
}
DrawerHeader.displayName = 'Drawer.Header';
DrawerHeader.Title = DrawerHeaderTitle;

function DrawerContent({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={content({ className })} />;
}
DrawerContent.displayName = 'Drawer.Content';

function DrawerFooter({ className, ...rest }: ComponentPropsWithRef<'footer'>) {
  return <footer {...rest} className={footer({ className })} />;
}
DrawerFooter.displayName = 'Drawer.Footer';

export function Drawer({
  id,
  children,
  className,
  defaultView,
  placement = 'left',
  size = 'medium',
  onChange,
  ...rest
}: DrawerProps) {
  containsExactChildren({
    children,
    componentName: Drawer.displayName,
    restrictions: [
      [DrawerMenu, { min: 0, max: 1 }],
      [DrawerPanel, { min: 1, max: 1 }],
    ],
  });

  const views = useRef(new Set<UniqueId>());
  const [activeView, setActiveView] = useState<UniqueId | null>(
    defaultView || null,
  );

  const handleOpen = useCallback(
    (data: DrawerOpenEvent) => {
      if (views.current.has(data?.payload?.view)) {
        bus.emit(ViewStackEventTypes.clear, { stack: id });
        bus.emit(ViewStackEventTypes.push, data.payload);
      }
    },
    [id],
  );
  const handleToggle = useCallback(
    (data: DrawerToggleEvent) => {
      if (views.current.has(data?.payload?.view)) {
        bus.emit(ViewStackEventTypes.clear, { stack: id });
        if (activeView !== data?.payload?.view) {
          bus.emit(ViewStackEventTypes.push, data.payload);
        }
      }
    },
    [id, activeView],
  );

  useEffect(() => {
    const listeners = [
      bus.on(DrawerEventTypes.open, handleOpen),
      bus.on(DrawerEventTypes.toggle, handleToggle),
    ];

    return () => {
      for (const off of listeners) {
        off();
      }
    };
  }, [handleOpen, handleToggle]);

  return (
    <DrawerContext.Provider
      value={{
        register: (view: UniqueId) => views.current.add(view),
        unregister: (view: UniqueId) => views.current.delete(view),
      }}
    >
      <ViewStack
        id={id}
        defaultView={defaultView}
        onChange={(view) => {
          setActiveView(view);
          onChange?.(view);
        }}
      >
        <div
          {...rest}
          className={drawer({ className })}
          data-open={!!activeView || null}
          data-placement={placement}
          data-size={size}
        >
          {children}
        </div>
      </ViewStack>
    </DrawerContext.Provider>
  );
}
Drawer.displayName = 'Drawer';

Drawer.Layout = DrawerLayout;
Drawer.Menu = DrawerMenu;
Drawer.Panel = DrawerPanel;
Drawer.View = DrawerView;
Drawer.Header = DrawerHeader;
Drawer.Content = DrawerContent;
Drawer.Footer = DrawerFooter;
Drawer.Trigger = DrawerTrigger;
