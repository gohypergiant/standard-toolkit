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
import { PressResponder, Pressable } from '@react-aria/interactions';
import {
  Children,
  type ReactNode,
  isValidElement,
  useEffect,
  useMemo,
} from 'react';
import {
  DrawerContext,
  DrawerLayoutContext,
  useDrawerContext,
  useDrawerLayoutContext,
  useDrawerLayoutState,
} from './context';
import { createDefaultDrawerState, stateToDataAttribute } from './state';
import { DrawerMenuStyles, DrawerStyles } from './styles';
import type {
  DrawerCloseProps,
  DrawerMainProps,
  DrawerMenuItemProps,
  DrawerMenuProps,
  DrawerPanelProps,
  DrawerProps,
  DrawerRootProps,
  DrawerTriggerProps,
} from './types';

const DEFAULT_DRAWER_DATA_ATTRIBUTE = stateToDataAttribute(
  createDefaultDrawerState(),
);

const { root, main, drawer, trigger, content, panel, header, footer, title } =
  DrawerStyles();

const { menu, menuItem } = DrawerMenuStyles();

const DrawerRoot = ({
  children,
  className,
  extend = 'left and right',
}: DrawerRootProps) => {
  const drawerState = useDrawerLayoutState();

  const dataAttributes = useMemo(() => {
    const attrs: Record<string, string> = {
      'data-top': DEFAULT_DRAWER_DATA_ATTRIBUTE,
      'data-bottom': DEFAULT_DRAWER_DATA_ATTRIBUTE,
      'data-left': DEFAULT_DRAWER_DATA_ATTRIBUTE,
      'data-right': DEFAULT_DRAWER_DATA_ATTRIBUTE,
    };

    for (const [drawerId, state] of Object.entries(drawerState.drawerStates)) {
      const placement = drawerState.getDrawerPlacement(drawerId);
      if (placement) {
        attrs[`data-${placement}`] = stateToDataAttribute(state);
      }
    }

    return attrs;
  }, [drawerState.drawerStates, drawerState.getDrawerPlacement]);

  return (
    <DrawerLayoutContext.Provider value={drawerState}>
      <div
        className={root({ className })}
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
  size = 'content',
  className,
  children,
  onOpenChange,
  onStateChange,
  ...props
}: DrawerProps) => {
  const {
    getDrawerState,
    registerDrawer,
    isDrawerVisible,
    selectedMenuItemId,
    selectMenuItem,
  } = useDrawerLayoutContext();
  const currentState = getDrawerState(id);
  const visible = isDrawerVisible(id);

  const menuChildren: ReactNode[] = [];
  const contentChildren: ReactNode[] = [];

  useEffect(() => {
    const initialState = createDefaultDrawerState(
      mode,
      isOpen ? size : 'closed',
      size,
    );
    registerDrawer(id, placement, initialState, {
      onOpenChange,
      onStateChange,
    });
  }, [
    id,
    placement,
    mode,
    size,
    isOpen,
    registerDrawer,
    onOpenChange,
    onStateChange,
  ]);

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === DrawerMenu) {
      menuChildren.push(child);
    } else {
      contentChildren.push(child);
    }
  });

  return (
    <DrawerContext.Provider
      value={{
        drawerId: id,
        placement,
        state: currentState,
        selectedMenuItemId,
        selectMenuItem,
      }}
    >
      <div
        className={drawer({ className, placement })}
        {...props}
        data-panel={placement}
        data-drawer-id={id}
        data-drawer-state={stateToDataAttribute(currentState)}
      >
        {menuChildren}
        <DrawerContent visible={visible}>{contentChildren}</DrawerContent>
      </div>
    </DrawerContext.Provider>
  );
};

const DrawerMain = ({ children, className, ...props }: DrawerMainProps) => (
  <main className={main({ className })} {...props}>
    {children}
  </main>
);
DrawerMain.displayName = 'Drawer.Main';

const DrawerContent = ({
  visible,
  children,
}: { visible: boolean; children: ReactNode }) => {
  return <div className={content({ visible })}>{children}</div>;
};
DrawerContent.displayName = 'Drawer.Content';

const DrawerMenu = ({ children, className, ...props }: DrawerMenuProps) => {
  const { placement } = useDrawerContext();
  const orientation =
    placement === 'top' || placement === 'bottom' ? 'horizontal' : 'vertical';
  return (
    <nav
      className={menu({
        orientation,
        drawer: placement,
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
  const { openDrawer, showSelected } = useDrawerLayoutContext();
  const { selectMenuItem, placement, drawerId } = useDrawerContext();
  const isSelected = showSelected(id);
  const handleClick = () => {
    openDrawer(drawerId);
    selectMenuItem(id);
  };
  return (
    <div
      {...props}
      className={menuItem({ drawer: placement, className })}
      aria-selected={isSelected}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      data-selected={isSelected}
    >
      <Pressable onPress={handleClick}>{children}</Pressable>
    </div>
  );
};
DrawerMenuItem.displayName = 'Drawer.Menu.Item';

const DrawerPanel = ({
  id,
  children,
  className,
  ...props
}: DrawerPanelProps) => {
  const { selectedMenuItemId } = useDrawerContext();
  const isSelected = selectedMenuItemId === id;

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

const DrawerClose = ({ children }: DrawerCloseProps) => {
  const { drawerId } = useDrawerContext();
  const { closeDrawer } = useDrawerLayoutContext();

  return (
    <PressResponder onPress={() => closeDrawer(drawerId)}>
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

const DrawerHeader = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
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

const DrawerTitle = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return <div className={title({ className })}>{children}</div>;
};
DrawerHeader.displayName = 'Drawer.Title';

const DrawerFooter = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return <div className={footer({ className })}>{children}</div>;
};
DrawerFooter.displayName = 'Drawer.Footer';

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
