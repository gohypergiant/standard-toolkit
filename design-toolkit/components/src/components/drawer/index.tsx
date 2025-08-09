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
import { Broadcast, type Payload } from '@accelint/bus';
import { PressResponder, Pressable } from '@react-aria/interactions';
import { useControlledState } from '@react-stately/utils';
import { type ComponentPropsWithRef, useCallback, useEffect } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewStack } from '../view-stack';
import type { ViewStackViewProps } from '../view-stack/types';
import { DrawerMenuStyles, DrawerStyles } from './styles';
import type {
  DrawerCloseEvent,
  DrawerLayoutProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerOpenEvent,
  DrawerProps,
  DrawerToggleEvent,
  DrawerTriggerProps,
} from './types';

const { layout, main, drawer, content, panel, header, footer, title } =
  DrawerStyles();
const { menu, item } = DrawerMenuStyles();
const bus = Broadcast.getInstance();
const DrawerEventNamespace = 'Drawer';

export const DrawerEventTypes = {
  close: `${DrawerEventNamespace}:close`,
  open: `${DrawerEventNamespace}:open`,
  toggle: `${DrawerEventNamespace}:toggle`,
  select: `${DrawerEventNamespace}:select`,
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
  return (
    <PressResponder onPress={handleOnPress}>
      <Pressable>{children}</Pressable>
    </PressResponder>
  );
}
DrawerTrigger.displayName = 'Drawer.Trigger';

function DrawerMenuItem({
  id,
  children,
  className,
  ...rest
}: DrawerMenuItemProps) {
  return (
    <Button
      {...rest}
      variant='icon'
      className={item({ className })}
      aria-selected={isSelected}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      data-selected={isSelected ? true : undefined}
      onPress={handlePress}
    >
      <Icon>{children}</Icon>
    </Button>
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
  return <div {...rest} className={panel({ className })} role='tabpanel' />;
}
DrawerPanel.displayName = 'Drawer.Panel';

function DrawerView(props: ViewStackViewProps) {
  return <ViewStack.View {...props} />;
}
DrawerView.displayName = 'Drawer.View';

function DrawerHeaderTitle({
  className,
  ...rest
}: ComponentPropsWithRef<'div'>) {
  return <div {...rest} className={title({ className })} />;
}
DrawerHeaderTitle.displayName = 'Drawer.Title';

function DrawerHeader({ className, ...rest }: ComponentPropsWithRef<'header'>) {
  return <header {...rest} className={header({ className })} />;
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
  className,
  defaultIsOpen = false,
  defaultView,
  placement = 'left',
  size = 'medium',
  isOpen: isOpenProp,
  onChange,
  ...rest
}: DrawerProps) {
  const [isOpen, setIsOpen] = useControlledState(
    isOpenProp,
    defaultIsOpen,
    onChange,
  );

  const handleClose = useCallback(
    (data: Payload<DrawerCloseEvent>) => {
      if (id === data?.payload?.drawer) {
        setIsOpen(false);
      }
    },
    [id, setIsOpen],
  );

  const handleOpen = useCallback(
    (data: Payload<DrawerOpenEvent>) => {
      if (id === data?.payload?.drawer) {
        setIsOpen(true);
      }
    },
    [id, setIsOpen],
  );

  const handleToggle = useCallback(
    (data: Payload<DrawerToggleEvent>) => {
      if (id === data?.payload?.drawer) {
        setIsOpen(!isOpen);
      }
    },
    [id, setIsOpen, isOpen],
  );

  useEffect(() => {
    const listeners = [
      bus.on(DrawerEventTypes.close, handleClose),
      bus.on(DrawerEventTypes.open, handleOpen),
      bus.on(DrawerEventTypes.toggle, handleToggle),
    ];

    () => {
      for (const off of listeners) {
        off();
      }
    };
  }, [handleClose, handleOpen, handleToggle]);

  return (
    <ViewStack
      id={id}
      defaultView={defaultView}
      onChange={(view) => setIsOpen(!!view)}
    >
      <div
        {...rest}
        className={drawer({ className })}
        data-open={isOpen || null}
        data-placement={placement}
        data-size={size}
      />
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
