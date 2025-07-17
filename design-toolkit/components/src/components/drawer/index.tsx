import {
  Children,
  type ReactNode,
  isValidElement,
  useEffect,
  useMemo,
} from 'react';
import { LAYOUT_EXTEND_DEFAULT, PANEL_CONFIG_DEFAULT } from './config';

import { Cancel } from '@accelint/icons';
import { PressResponder } from '@react-aria/interactions';
import { Button } from '../button';
import { Icon } from '../icon';
import {
  DrawerContext,
  DrawerLayoutContext,
  useDrawerContext,
  useDrawerLayoutContext,
  useDrawerLayoutState,
} from './context';
import { DrawerStyles } from './styles';
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

const {
  root,
  main,
  drawer,
  menu,
  trigger,
  menuItem,
  content,
  panel,
  header,
  footer,
  title,
} = DrawerStyles();

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
      const placement = drawerState.getDrawerPlacement(drawerId);
      if (placement) {
        attrs[`data-${placement}`] = state;
      }
    }

    return attrs;
  }, [drawerState.drawerStates, drawerState.getDrawerPlacement]);

  return (
    <DrawerLayoutContext.Provider value={drawerState}>
      <div
        className={root({ className })}
        data-extend={settings?.extend ?? LAYOUT_EXTEND_DEFAULT}
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
  placement,
  isOpen = false,
  mode = 'over',
  className,
  hotKey,
  children,
  ...props
}: DrawerProps) => {
  const {
    getDrawerState,
    registerDrawer,
    toggleDrawer,
    isDrawerVisible,
    selectedMenuItem,
    selectMenuItem,
  } = useDrawerLayoutContext();

  useEffect(() => {
    registerDrawer(id, placement, isOpen, mode);
  }, [id, placement, isOpen, mode, registerDrawer]);

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
  const visible = isDrawerVisible(id);
  const [, drawerState] = (currentState || 'over-closed').split('-');

  const menuChildren: ReactNode[] = [];
  const contentChildren: ReactNode[] = [];

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
        state: drawerState,
        selectedMenuItem,
        selectMenuItem,
      }}
    >
      <div
        className={drawer({ className, placement })}
        {...props}
        data-panel={placement}
        data-drawer-id={id}
        data-drawer-state={currentState}
      >
        {menuChildren}
        <DrawerContent visible={visible}>{contentChildren}</DrawerContent>
      </div>
    </DrawerContext.Provider>
  );
};

const DrawerMain = ({ children, className, ...props }: DrawerMainProps) => (
  <main className={main()} {...props}>
    {children}
  </main>
);
DrawerMain.displayName = 'Drawer.Main';

const DrawerContent = ({
  visible,
  children,
}: { visible: boolean; children: ReactNode }) => {
  return <div className={content({ visible})}>{children}</div>;
};
DrawerContent.displayName = 'Drawer.Content';

const DrawerMenu = ({ children, className, ...props }: DrawerMenuProps) => {
  const { placement } = useDrawerContext();
  return (
    <nav
      className={menu({
        orientation:
          placement === 'top' || placement === 'bottom'
            ? 'horizontal'
            : 'vertical',
        placement,
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
  const { openDrawer } = useDrawerLayoutContext();
  const { selectedMenuItem, selectMenuItem, placement, drawerId } =
    useDrawerContext();
  const isSelected = selectedMenuItem === id;
  const handleClick = () => {
    openDrawer(drawerId);
    selectMenuItem(id);
  };
  return (
    <button
      {...props}
      className={menuItem({ placement, className })}
      data-selected={isSelected}
      onClick={handleClick}
      type='button'
      role='tab'
      aria-selected={isSelected}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
    >
      {children}
    </button>
  );
};
DrawerMenuItem.displayName = 'Drawer.MenuItem';

const DrawerPanel = ({
  id,
  children,
  className,
  ...props
}: DrawerPanelProps) => {
  const { selectedMenuItem } = useDrawerContext();
  const isSelected = selectedMenuItem === id;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      {...props}
      className={panel()}
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
      <div className={title()}>{children}</div>
      <DrawerClose>
        <Button size='small' variant='outline'>
          <Icon>
            <Cancel />
          </Icon>
        </Button>
      </DrawerClose>
    </div>
  );
};
DrawerHeader.displayName = 'Drawer.Header';

const DrawerFooter = ({
  children,
  className,
}: { children: ReactNode; className?: string }) => {
  return <div className={footer({ className })}>{children}</div>;
};
DrawerFooter.displayName = 'Drawer.Footer';

Drawer.Root = DrawerRoot;
Drawer.Main = DrawerMain;
Drawer.Menu = DrawerMenu;
Drawer.Trigger = DrawerTrigger;
Drawer.Open = DrawerOpen;
Drawer.Close = DrawerClose;
Drawer.MenuItem = DrawerMenuItem;
Drawer.Panel = DrawerPanel;
Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
