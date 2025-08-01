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
import { PressResponder, Pressable } from '@react-aria/interactions';
import { useCallback, useEffect } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import {
  DrawerContext,
  DrawersContext,
  useDrawerContext,
  useDrawersContext,
  useDrawersState,
} from './context';
import { createDefaultDrawerState } from './state';
import { DrawerMenuStyles, DrawerStyles } from './styles';
import type {
  DrawerContainerProps,
  DrawerLayoutProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerPanelProps,
  DrawerProps,
  DrawerProviderProps,
  DrawerTriggerProps,
} from './types';

const { layout, main, drawer, content, panel, header, footer, title } =
  DrawerStyles();

const { menu, item } = DrawerMenuStyles();

const DrawerProvider = ({ children, onStateChange }: DrawerProviderProps) => {
  const drawerState = useDrawersState({
    onStateChange,
  });

  return (
    <DrawersContext.Provider value={drawerState}>
      {children}
    </DrawersContext.Provider>
  );
};

const DrawerLayout = ({
  children,
  className,
  extend = 'left right',
  push,
}: DrawerLayoutProps) => {
  return (
    <div
      className={layout({ className })}
      data-extend={extend}
      data-push={push}
    >
      {children}
    </div>
  );
};
DrawerLayout.displayName = 'Drawer.Layout';

export const Drawer = ({
  id,
  placement = 'left',
  isOpen = false,
  size = 'medium',
  defaultSelectedMenuItemId,
  className,
  children,
  onOpenChange,
  onStateChange,
  ...rest
}: DrawerProps) => {
  const { getDrawerState, registerDrawer } = useDrawersContext();
  const currentState = getDrawerState(id);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this should only run if these props change
  useEffect(() => {
    const initialState = createDefaultDrawerState({
      id,
      selectedMenuItemId: defaultSelectedMenuItemId,
      isOpen,
    });
    registerDrawer(initialState, {
      onOpenChange,
      onStateChange,
    });
  }, [isOpen, size, placement]);

  return (
    <DrawerContext.Provider value={{ state: currentState }}>
      <div
        {...rest}
        className={drawer({ className })}
        data-placement={placement}
        data-drawer-id={id}
        data-size={size}
        data-open={currentState.isOpen || null}
      >
        {children}
      </div>
    </DrawerContext.Provider>
  );
};

const DrawerMenu = ({
  children,
  className,
  position = 'middle',
  ...props
}: DrawerMenuProps) => {
  return (
    <nav
      className={menu({
        position,
        className,
      })}
      {...props}
    >
      {children}
    </nav>
  );
};
DrawerMenu.displayName = 'Drawer.Menu';

const DrawerMenuItem = ({
  id,
  children,
  className,
  ...rest
}: DrawerMenuItemProps) => {
  const { openDrawer, isSelectedMenuItem } = useDrawersContext();
  const { state } = useDrawerContext();
  const isSelected = isSelectedMenuItem(state.selectedMenuItemId, id);

  const handlePress = () => {
    openDrawer(state.id, id);
  };
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
};
DrawerMenuItem.displayName = 'Drawer.Menu.Item';

const DrawerPanel = ({
  id,
  children,
  className,
  ...props
}: DrawerPanelProps) => {
  const { state } = useDrawerContext();
  const isSelected = state?.selectedMenuItemId === id;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      {...props}
      className={panel({ className })}
      id={`panel-${id}`}
      role='tabpanel'
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
};
DrawerPanel.displayName = 'Drawer.Panel';

const DrawerTrigger = ({
  for: drawerId,
  children,
  behavior = 'toggle',
}: DrawerTriggerProps) => {
  const { toggleDrawer, openDrawer, closeDrawer } = useDrawersContext();

  const handleOnPress = useCallback(() => {
    if (behavior === 'open') {
      openDrawer(drawerId);
    } else if (behavior === 'close') {
      closeDrawer(drawerId);
    } else {
      toggleDrawer(drawerId);
    }
  }, [behavior, drawerId, openDrawer, closeDrawer, toggleDrawer]);

  return (
    <PressResponder onPress={handleOnPress}>
      <Pressable>{children}</Pressable>
    </PressResponder>
  );
};
DrawerTrigger.displayName = 'Drawer.Trigger';

const DrawerHeader = ({ children, className }: DrawerContainerProps) => {
  return (
    <div
      className={header({
        className,
      })}
    >
      {children}
    </div>
  );
};
DrawerHeader.displayName = 'Drawer.Header';

const DrawerTitle = ({ children, className }: DrawerContainerProps) => {
  return <div className={title({ className })}>{children}</div>;
};
DrawerHeader.displayName = 'Drawer.Title';

const DrawerFooter = ({ children, className }: DrawerContainerProps) => {
  return <div className={footer({ className })}>{children}</div>;
};
DrawerFooter.displayName = 'Drawer.Footer';

const DrawerMain = ({ children, className }: DrawerContainerProps) => (
  <main className={main({ className })}>{children}</main>
);
DrawerMain.displayName = 'Drawer.Main';

const DrawerContent = ({ children, className }: DrawerContainerProps) => {
  return <div className={content({ className })}>{children}</div>;
};
DrawerContent.displayName = 'Drawer.Content';

Drawer.Layout = DrawerLayout;
Drawer.Main = DrawerMain;
DrawerMenu.Item = DrawerMenuItem;
Drawer.Menu = DrawerMenu;
Drawer.Trigger = DrawerTrigger;
Drawer.Panel = DrawerPanel;
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Footer = DrawerFooter;
Drawer.Content = DrawerContent;
Drawer.Provider = DrawerProvider;
