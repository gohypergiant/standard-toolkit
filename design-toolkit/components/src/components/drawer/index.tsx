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
import { useEmit, useOn } from '@accelint/bus/react';
import { isUUID, type UniqueId } from '@accelint/core';
import { Cancel, ChevronLeft } from '@accelint/icons';
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
import { Button, ToggleButton } from '../button';
import { Icon } from '../icon';
import { Tooltip } from '../tooltip';
import {
  useViewStackEmit,
  ViewStack,
  ViewStackContext,
  ViewStackEventHandlers,
} from '../view-stack';
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
  placement: 'left',
});

export const DrawerEventHandlers = {
  ...ViewStackEventHandlers,
  close: ViewStackEventHandlers.clear,
  open: (view: UniqueId) => bus.emit(DrawerEventTypes.open, { view }),
  toggle: (view: UniqueId) => bus.emit(DrawerEventTypes.toggle, { view }),
} as const;

export function useDrawerEmit() {
  const viewStackEmit = useViewStackEmit();
  const emitOpen = useEmit<DrawerEvent>(DrawerEventTypes.open);
  const emitToggle = useEmit<DrawerEvent>(DrawerEventTypes.toggle);

  return {
    ...viewStackEmit,
    close: viewStackEmit.clear,
    open: (view: UniqueId) => emitOpen({ view }),
    toggle: (view: UniqueId) => emitToggle({ view }),
  } as const;
}

function DrawerTrigger({ for: events, ...rest }: DrawerTriggerProps) {
  const { parent } = useContext(ViewStackContext);
  const drawerEmit = useDrawerEmit();

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

      drawerEmit[event](id);
    }
  }

  return <Pressable {...rest} onPress={handlePress} />;
}
DrawerTrigger.displayName = 'Drawer.Trigger';

function DrawerClose() {
  return (
    <Drawer.Trigger for='close'>
      <Button variant='icon'>
        <Icon>
          <Cancel />
        </Icon>
      </Button>
    </Drawer.Trigger>
  );
}

DrawerClose.displayName = 'Drawer.Close';

function DrawerBack() {
  const { stack } = useContext(ViewStackContext);
  return stack.length > 1 ? (
    <Drawer.Trigger for='back'>
      <Button variant='icon'>
        <Icon>
          <ChevronLeft />
        </Icon>
      </Button>
    </Drawer.Trigger>
  ) : null;
}

DrawerBack.displayName = 'Drawer.Back';

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

const tooltipPlacementMap = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top',
} as const;

function DrawerMenuItem({
  for: id,
  children,
  classNames,
  toggle,
  textValue,
  ...rest
}: DrawerMenuItemProps) {
  const { parent, stack } = useContext(ViewStackContext);
  const { placement } = useContext(DrawerContext);
  const view = stack.at(-1);
  const action = toggle ? 'toggle' : 'open';
  const tooltipRef = useRef(null);

  if (!parent) {
    return null;
  }

  return (
    <Tooltip.Trigger>
      <DrawerTrigger for={`${action}:${id}`}>
        <ToggleButton
          {...rest}
          ref={tooltipRef}
          className={composeRenderProps(classNames?.item, (className) =>
            item({ className }),
          )}
          role='tab'
          variant='icon'
          isSelected={id === view || (stack.length > 1 && stack.includes(id))}
        >
          {composeRenderProps(children, (children) => (
            <Icon>{children}</Icon>
          ))}
        </ToggleButton>
      </DrawerTrigger>
      <Tooltip
        triggerRef={tooltipRef}
        placement={tooltipPlacementMap[placement]}
        offset={6}
        className={classNames?.tooltip}
      >
        {textValue}
      </Tooltip>
    </Tooltip.Trigger>
  );
}
DrawerMenuItem.displayName = 'Drawer.Menu.Item';

function DrawerMenu({
  className,
  position = 'center',
  children,
  ...rest
}: DrawerMenuProps) {
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

    return () => unregister(id);
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

function DrawerHeader({
  className,
  title,
  children,
  ...rest
}: ComponentPropsWithRef<'header'>) {
  const { stack } = useContext(ViewStackContext);
  const level = stack.length > 1 ? 4 : 1;

  return (
    <Header {...rest} className={header({ className })}>
      {title ? (
        <>
          <Drawer.Back />
          <Drawer.Header.Title level={level} className='w-fit'>
            {title}
          </Drawer.Header.Title>
          <Drawer.Close />
        </>
      ) : (
        children
      )}
    </Header>
  );
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

/**
 * Drawer - Slide-in panel for navigation or contextual content
 *
 * A flexible panel that slides in from the viewport edge and supports
 * stacked views, headers, footers, and programmatic triggers.
 *
 * @example
 * const ids = { drawer: uuid(), a: uuid() };
 *
 * <Drawer.Layout push="left">
 *   <Drawer.Layout.Main>
 *     <Drawer.Trigger for={`open:${ids.a}`}>
 *       <Button variant="icon">Open</Button>
 *     </Drawer.Trigger>
 *   </Drawer.Layout.Main>
 *
 *   <Drawer id={ids.drawer} defaultView={ids.a}>
 *     <Drawer.Panel>
 *       <Drawer.View id={ids.a}>
 *         <Drawer.Header title="Title A" />
 *         <Drawer.Content>Content for View A</Drawer.Content>
 *       </Drawer.View>
 *     </Drawer.Panel>
 *   </Drawer>
 * </Drawer.Layout>
 */
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
  const views = useRef(new Set<UniqueId>());
  const [activeView, setActiveView] = useState<UniqueId | null>(
    defaultView || null,
  );

  const viewStackEmit = useViewStackEmit();

  const handleOpen = useCallback(
    (data: DrawerOpenEvent) => {
      if (views.current.has(data?.payload?.view)) {
        viewStackEmit.clear(id);
        viewStackEmit.push(data.payload.view);
      }
    },
    [id, viewStackEmit.clear, viewStackEmit.push],
  );
  const handleToggle = useCallback(
    (data: DrawerToggleEvent) => {
      if (views.current.has(data?.payload?.view)) {
        viewStackEmit.clear(id);
        if (activeView !== data?.payload?.view) {
          viewStackEmit.push(data.payload.view);
        }
      }
    },
    [id, activeView, viewStackEmit.clear, viewStackEmit.push],
  );

  useOn(DrawerEventTypes.open, handleOpen);
  useOn(DrawerEventTypes.toggle, handleToggle);

  return (
    <DrawerContext.Provider
      value={{
        register: (view: UniqueId) => views.current.add(view),
        unregister: (view: UniqueId) => views.current.delete(view),
        placement,
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
Drawer.Close = DrawerClose;
Drawer.Back = DrawerBack;
