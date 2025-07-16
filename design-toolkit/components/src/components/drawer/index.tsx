import { useEffect, useMemo } from 'react';
import { PANEL_CONFIG_DEFAULT } from './config';
import {
  LAYOUT_EXTEND_DEFAULT,
  // MENU_DEFAULT
} from './config';

import { PressResponder } from '@react-aria/interactions';
import {
  DrawerContext,
  DrawerLayoutContext,
  useDrawerContext,
  useDrawerLayoutContext,
  useDrawerLayoutState,
} from './context';
import { DrawerStyles } from './styles';
import type {
  DrawerMenuProps,
  DrawerProps,
  DrawerRootProps,
  DrawerTriggerProps,
  PanelProps,
} from './types';

const { root, main, drawer, menu, trigger } = DrawerStyles();

export const Drawer = ({
  id,
  anchor,
  isOpen = false,
  mode = 'over',
  className,
  hotKey,
  children,
  ...props
}: DrawerProps) => {
  const { getDrawerState, registerDrawer, toggleDrawer } =
    useDrawerLayoutContext();

  useEffect(() => {
    registerDrawer(id, anchor, isOpen, mode);
  }, [id, anchor, isOpen, mode, registerDrawer]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === hotKey) {
        toggleDrawer(id);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  });

  const currentState = getDrawerState(id);

  return (
    <DrawerContext.Provider value={{ drawerId: id, anchor: anchor }}>
      <div
        className={drawer({ className, anchor })}
        {...props}
        data-panel={anchor}
        data-drawer-id={id}
        data-drawer-state={currentState}
      >
        {children}
      </div>
    </DrawerContext.Provider>
  );
};

const DrawerRoot = ({ children, className, ...settings }: DrawerRootProps) => {
  const drawerState = useDrawerLayoutState();

  const dataAttributes = useMemo(() => {
    const attrs: Record<string, string> = {
      'data-top': PANEL_CONFIG_DEFAULT,
      'data-bottom': PANEL_CONFIG_DEFAULT,
      'data-left': PANEL_CONFIG_DEFAULT,
      'data-right': PANEL_CONFIG_DEFAULT,
    };

    for (const [drawerId, state] of Object.entries(drawerState.drawerStates)) {
      const anchor = drawerState.getDrawerAnchor(drawerId);
      if (anchor) {
        attrs[`data-${anchor}`] = state;
      }
    }

    return attrs;
  }, [drawerState.drawerStates, drawerState.getDrawerAnchor]);

  return (
    <DrawerLayoutContext.Provider value={drawerState}>
      <div
        className={root({ className })}
        data-extend={settings?.extend ?? LAYOUT_EXTEND_DEFAULT}
        // data-menu={settings.menu ?? MENU_DEFAULT}
        {...dataAttributes}
      >
        {children}
      </div>
    </DrawerLayoutContext.Provider>
  );
};

const DrawerMain = ({ children, className, ...props }: PanelProps) => (
  <main className={main()} {...props}>
    {children}
  </main>
);

const DrawerMenu = ({ children, className, ...props }: DrawerMenuProps) => {
  const { anchor } = useDrawerContext();
  return (
    <nav
      className={menu({
        orientation:
          anchor === 'top' || anchor === 'bottom' ? 'horizontal' : 'vertical',
        anchor,
        className,
      })}
      {...props}
    >
      {children}
    </nav>
  );
};

const DrawerOpen = ({ for: drawerId, children }: DrawerTriggerProps) => {
  const { openDrawer } = useDrawerLayoutContext();

  return (
    <PressResponder onPress={() => openDrawer(drawerId)}>
      {children}
    </PressResponder>
  );
};

const DrawerClose = ({ for: drawerId, children }: DrawerTriggerProps) => {
  const { closeDrawer } = useDrawerLayoutContext();

  return (
    <PressResponder onPress={() => closeDrawer(drawerId)}>
      {children}
    </PressResponder>
  );
};

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

Drawer.Root = DrawerRoot;
Drawer.Main = DrawerMain;
Drawer.Menu = DrawerMenu;
Drawer.Trigger = DrawerTrigger;
Drawer.Open = DrawerOpen;
Drawer.Close = DrawerClose;
