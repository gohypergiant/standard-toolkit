// import { PressResponder } from '@react-aria/interactions';
import { type PropsWithChildren } from 'react';
import { LAYOUT_ID, PANEL_CONFIG_DEFAULT } from './config';
import { LAYOUT_EXTEND_DEFAULT, MENU_DEFAULT } from './config';

import { DrawerStyles } from './styles';
import { createToggleFn } from './toggle-utils';
import type {
  DrawerMenuProps,
  DrawerProps,
  DrawerRootProps,
  DrawerTriggerProps,
  PanelProps,
  UseDrawerToggleProps,
} from './types';

const { root, main, drawer, menu, trigger } = DrawerStyles();

export const Drawer = ({
  anchor,
  className,
  children,
  ...props
}: DrawerProps) => {
  return (
    <div
      className={drawer({ className, anchor })}
      {...props}
      data-panel={anchor}
    >
      {children}
    </div>
  );
};

const DrawerRoot = ({ children, className, ...settings }: DrawerRootProps) => {
  return (
    <div
      className={root({ className })}
      data-bottom={settings.panels?.bottom ?? PANEL_CONFIG_DEFAULT}
      data-extend={settings?.extend ?? LAYOUT_EXTEND_DEFAULT}
      data-id={LAYOUT_ID}
      data-left={settings.panels?.left ?? PANEL_CONFIG_DEFAULT}
      data-menu={settings.menu ?? MENU_DEFAULT}
      data-right={settings.panels?.right ?? PANEL_CONFIG_DEFAULT}
      data-top={settings.panels?.top ?? PANEL_CONFIG_DEFAULT}
    >
      {children}
    </div>
  );
};

const DrawerMain = ({ children, className, ...props }: PanelProps) => (
  <main className={main()} {...props}>
    {children}
  </main>
);

const DrawerMenu = ({
  anchor,
  children,
  className,
  ...props
}: DrawerMenuProps) => {
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

interface ButtonProps extends PropsWithChildren {
  className?: string;
}

export function useDrawerToggle({ options, drawer }: UseDrawerToggleProps) {
  const toggleFn = createToggleFn(drawer);

  // return ({ children, className }: ButtonProps) => (
  //   <div className={className}>
  //     <PressResponder onPress={() => toggleFn(options)}>
  //       {children}
  //     </PressResponder>
  //   </div>
  // );
  return <T extends ButtonProps>({ children, className, ...props }: T) => (
    <button
      className={className}
      onClick={() => {
        toggleFn(options);
      }}
      title={`Toggle ${drawer} drawer`}
      type='button'
      {...props}
    >
      {children}
    </button>
  );
}

const DrawerTrigger = ({
  options,
  drawer,
  children,
  className,
}: DrawerTriggerProps) => {
  const Trigger = useDrawerToggle({ options, drawer });
  return <Trigger className={trigger({ className })}>{children}</Trigger>;
};

Drawer.Root = DrawerRoot;
Drawer.Main = DrawerMain;
Drawer.Menu = DrawerMenu;
Drawer.Trigger = DrawerTrigger;
