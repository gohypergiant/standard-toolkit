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
import { PressResponder } from '@react-aria/interactions';
import { useEffect, useMemo } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import {
  DrawerContext,
  DrawerLayoutContext,
  useDrawerContext,
  useDrawerLayoutContext,
  useDrawerLayoutState,
} from './context';
import { createDefaultDrawerState } from './state';
import { DrawerMenuStyles, DrawerStyles } from './styles';
import type {
  DrawerContainerProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerPanelProps,
  DrawerProps,
  DrawerRootProps,
  DrawerTriggerProps,
} from './types';

const { root, main, drawer, trigger, content, panel, header, footer, title } =
  DrawerStyles();

const { menu, item } = DrawerMenuStyles();

const DrawerRoot = ({
  children,
  classNames,
  extend = 'left right',
  onStateChange,
}: DrawerRootProps) => {
  const drawerState = useDrawerLayoutState({
    onStateChange,
  });

  const dataAttributes = useMemo(() => {
    const attrs: Record<string, string | boolean> = {};

    for (const [_, state] of Object.entries(drawerState.drawerStates)) {
      if (state?.placement) {
        attrs[`data-${state?.placement}`] = `${state.mode}-${state.size}`;
        attrs[`data-${state?.placement}-open`] = state.isOpen;
      }
    }

    return attrs;
  }, [drawerState.drawerStates]);

  return (
    <DrawerLayoutContext.Provider value={drawerState}>
      <div
        className={root({ className: classNames?.layout })}
        data-extend={extend}
        {...dataAttributes}
      >
        {children}
      </div>
    </DrawerLayoutContext.Provider>
  );
};
DrawerRoot.displayName = 'Drawer.Root';

export const Drawer = ({
  id,
  placement = 'left',
  isOpen = false,
  mode = 'overlay',
  size = 'medium',
  defaultSelectedMenuItemId,
  className,
  children,
  onOpenChange,
  onStateChange,
  ...props
}: DrawerProps) => {
  const { getDrawerState, registerDrawer } = useDrawerLayoutContext();
  const currentState = getDrawerState(id);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this should only run if these props change
  useEffect(() => {
    const initialState = createDefaultDrawerState({
      id,
      placement,
      selectedMenuItemId: defaultSelectedMenuItemId,
      mode,
      size,
      isOpen,
    });
    registerDrawer(initialState, {
      onOpenChange,
      onStateChange,
    });
  }, [isOpen, mode, size, placement]);

  return (
    <DrawerContext.Provider value={{ state: currentState }}>
      <div
        className={drawer({ className, placement })}
        {...props}
        data-placement={placement}
        data-drawer-id={id}
        data-mode={currentState.mode}
        data-size={currentState.size}
        data-open={currentState.isOpen}
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
  ...props
}: DrawerMenuItemProps) => {
  const { openDrawer, isSelectedMenuItem } = useDrawerLayoutContext();
  const { state } = useDrawerContext();
  const isSelected = isSelectedMenuItem(state.selectedMenuItemId, id);

  const handlePress = () => {
    openDrawer(state.id, id);
  };
  return (
    <Button
      {...props}
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

const DrawerOpen = ({ for: drawerId, children }: DrawerTriggerProps) => {
  const { openDrawer } = useDrawerLayoutContext();

  return (
    <PressResponder onPress={() => openDrawer(drawerId)}>
      {children}
    </PressResponder>
  );
};
DrawerOpen.displayName = 'Drawer.Open';

const DrawerClose = ({ children }: DrawerContainerProps) => {
  const { state } = useDrawerContext();
  const { closeDrawer } = useDrawerLayoutContext();

  return (
    <PressResponder onPress={() => closeDrawer(state.id)}>
      {children}
    </PressResponder>
  );
};
DrawerClose.displayName = 'Drawer.Close';

const DrawerTrigger = ({
  for: drawerId,
  children,
  className,
  ...props
}: DrawerTriggerProps) => {
  const { toggleDrawer } = useDrawerLayoutContext();

  return (
    <button
      {...props}
      className={trigger({ className })}
      title={`Toggle ${drawerId} drawer`}
      type='button'
      onClick={() => {
        toggleDrawer(drawerId);
      }}
    >
      {children}
    </button>
  );
};
DrawerTrigger.displayName = 'Drawer.Trigger';

//Slot candidates
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

const DrawerMain = ({
  children,
  className,
  ...props
}: DrawerContainerProps) => (
  <main className={main({ className })} {...props}>
    {children}
  </main>
);
DrawerMain.displayName = 'Drawer.Main';

const DrawerContent = ({ children, className }: DrawerContainerProps) => {
  const { state } = useDrawerContext();
  return (
    <div className={content({ className, visible: state?.isOpen })}>
      {children}
    </div>
  );
};
DrawerContent.displayName = 'Drawer.Content';

Drawer.Root = DrawerRoot;
Drawer.Main = DrawerMain;
DrawerMenu.Item = DrawerMenuItem;
Drawer.Menu = DrawerMenu;
Drawer.Trigger = DrawerTrigger;
Drawer.Open = DrawerOpen;
Drawer.Close = DrawerClose;
Drawer.Panel = DrawerPanel;
Drawer.Header = DrawerHeader;
Drawer.Title = DrawerTitle;
Drawer.Footer = DrawerFooter;
Drawer.Content = DrawerContent;
