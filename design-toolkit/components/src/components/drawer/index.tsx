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
import { containsExactChildren } from '@/lib/react';
import { Broadcast, type Payload } from '@accelint/bus';
import { type UniqueId, isUUID } from '@accelint/core';
import { PressResponder, Pressable } from '@react-aria/interactions';
import {
  type ComponentPropsWithRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Header, Heading, composeRenderProps } from 'react-aria-components';
import { ToggleButton } from '../button';
import { Icon } from '../icon';
import {
  ViewStack,
  ViewStackContext,
  ViewStackEventTypes,
} from '../view-stack';
import type {
  ViewStackBackEvent,
  ViewStackClearEvent,
  ViewStackPushEvent,
  ViewStackResetEvent,
  ViewStackViewProps,
} from '../view-stack/types';
import { DrawerMenuStyles, DrawerStyles, DrawerTitleStyles } from './styles';
import type {
  DrawerCloseEvent,
  DrawerLayoutProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerOpenEvent,
  DrawerProps,
  DrawerTitleProps,
  DrawerTriggerProps,
} from './types';

const { layout, main, drawer, panel, view, header, content, footer } =
  DrawerStyles();
const { menu, item } = DrawerMenuStyles();
const bus = Broadcast.getInstance();
const DrawerEventNamespace = 'Drawer';

export const DrawerEventTypes = {
  close: `${DrawerEventNamespace}:close`,
  open: `${DrawerEventNamespace}:open`,
} as const;

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

function DrawerTrigger({ children, for: types }: DrawerTriggerProps) {
  const { parent } = useContext(ViewStackContext);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO: refactor
  function handlePress() {
    for (const type of Array.isArray(types) ? types : [types]) {
      if (isUUID(type)) {
        bus.emit<ViewStackPushEvent>(ViewStackEventTypes.push, {
          view: type,
        });
      } else {
        let [event, stack, view] = type.split(':') as [
          'back' | 'clear' | 'close' | 'open' | 'reset',
          UniqueId | undefined | null,
          UniqueId | undefined | null,
        ];

        stack ??= parent;

        if (!stack) {
          continue;
        }

        if (event === 'back' || event === 'clear' || event === 'reset') {
          bus.emit<
            ViewStackBackEvent | ViewStackClearEvent | ViewStackResetEvent
          >(ViewStackEventTypes[event], { stack });
        }

        if (event === 'close') {
          bus.emit<ViewStackClearEvent>(ViewStackEventTypes.clear, { stack });
        }

        if (event === 'open' && view) {
          bus.emit<ViewStackPushEvent>(ViewStackEventTypes.push, { view });
        }
      }
    }
  }

  return (
    <PressResponder onPress={handlePress}>
      <Pressable>{children}</Pressable>
    </PressResponder>
  );
}
DrawerTrigger.displayName = 'Drawer.Trigger';

function DrawerMenuItem({
  for: id,
  children,
  className,
  views,
  ...rest
}: DrawerMenuItemProps) {
  const { parent, stack } = useContext(ViewStackContext);
  const view = stack.at(-1);

  if (!(parent && view)) {
    return null;
  }

  return (
    <DrawerTrigger for={[`clear:${parent}`, id]}>
      <ToggleButton
        {...rest}
        className={composeRenderProps(className, (className) =>
          item({ className }),
        )}
        role='tab'
        variant='icon'
        isSelected={id === view || views?.some((view) => id === view)}
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
  ...rest
}: DrawerMenuProps) {
  return (
    <nav
      {...rest}
      className={menu({
        position,
        className,
      })}
    />
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

  const [isOpen, setIsOpen] = useState(!!defaultView);

  const handleClose = useCallback(
    (data: Payload<DrawerCloseEvent>) => {
      if (id === data?.payload?.drawer) {
        bus.emit<ViewStackClearEvent>(ViewStackEventTypes.clear, { stack: id });
      }
    },
    [id],
  );

  const handleOpen = useCallback(
    (data: Payload<DrawerOpenEvent>) => {
      if (id === data?.payload?.drawer && data?.payload?.view) {
        bus.emit<ViewStackClearEvent>(ViewStackEventTypes.clear, { stack: id });
        bus.emit<ViewStackPushEvent>(ViewStackEventTypes.push, {
          view: data?.payload?.view,
        });
      }
    },
    [id],
  );

  useEffect(() => {
    const listeners = [
      bus.on(DrawerEventTypes.close, handleClose),
      bus.on(DrawerEventTypes.open, handleOpen),
    ];

    () => {
      for (const off of listeners) {
        off();
      }
    };
  }, [handleClose, handleOpen]);

  return (
    <ViewStack
      id={id}
      defaultView={defaultView}
      onChange={(view) => {
        setIsOpen(!!view);
        onChange?.(!!view);
      }}
    >
      <div
        {...rest}
        className={drawer({ className })}
        data-open={isOpen || null}
        data-placement={placement}
        data-size={size}
      >
        {children}
      </div>
    </ViewStack>
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
