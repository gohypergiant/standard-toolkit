import type { PropsWithChildren } from 'react';

interface ContainerProps extends PropsWithChildren<{ className?: string }> {}

export type DrawerId = string;

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerRootProps
  extends ContainerProps,
    Partial<Record<DrawerPlacement, DrawerState>> {
  /**
   * Which drawers should extend to full container dimensions.
   * Determines the overall layout structure and drawer relationships in regard to space.
   *
   * @default 'left and right'
   */
  extend?: LayoutOption;
}

export interface DrawerProps extends ContainerProps {
  id: DrawerId;
  placement: DrawerPlacement;
  mode?: DrawerMode;
  hotKey?: string;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface DrawerContentProps extends ContainerProps {}

export interface DrawerMenuProps extends ContainerProps {}
export interface DrawerMainProps extends ContainerProps {}
export interface DrawerCloseProps extends ContainerProps {}

export interface DrawerTriggerProps extends ContainerProps {
  for: DrawerId;
}

export interface DrawerMenuItemProps extends ContainerProps {
  id: DrawerId;
}

export interface DrawerPanelProps extends ContainerProps {
  id: string;
}

export interface UseDrawerToggleProps {
  drawerId: DrawerId;
}

export interface DrawerLayoutContextValue {
  drawerStates: Record<DrawerId, DrawerStateOption>;
  toggleDrawer: (drawerId: DrawerId) => void;
  openDrawer: (drawerId: DrawerId) => void;
  closeDrawer: (drawerId: DrawerId) => void;
  setDrawerState: (drawerId: DrawerId, state: DrawerStateOption) => void;
  getDrawerState: (drawerId: DrawerId) => DrawerStateOption | undefined;
  registerDrawer: (
    drawerId: DrawerId,
    placement: DrawerPlacement,
    isOpen: boolean,
    mode: DrawerMode,
  ) => void;
  getDrawerPlacement: (drawerId: DrawerId) => DrawerPlacement | undefined;
  isDrawerVisible: (drawerId: DrawerId) => boolean;
  selectedMenuItem?: string;
  selectMenuItem: (menuItem: string) => void;
}

export interface DrawerContextValue {
  drawerId: DrawerId;
  placement: DrawerPlacement;
  state?: string;
  selectedMenuItem?: string;
  selectMenuItem: (menuItemId: string) => void;
}

/**
 * Extended Drawer Layout Configurations
 *
 * The layout system supports four different drawer extension modes that determine
 * how drawers are arranged and which drawers extend to the full container dimensions.
 *
 * extend: "left and right"
 * ┌──────┬──────────┬───────┐
 * │      │   top    │       │
 * │      ├──────────┤       │
 * │ left │   main   │ right │
 * │      ├──────────┤       │
 * │      │  bottom  │       │
 * └──────┴──────────┴───────┘
 *
 * extend: "top and bottom"
 * ┌─────────────────────────┐
 * │          top            │
 * ├──────┬──────────┬───────┤
 * │ left │   main   │ right │
 * ├──────┴──────────┴───────┤
 * │         bottom          │
 * └─────────────────────────┘
 *
 * extend: "top"
 * ┌─────────────────────────┐
 * │          top            │
 * ├──────┬──────────┬───────┤
 * │      │   main   │       │
 * │ left ├──────────┤ right │
 * │      │  bottom  │       │
 * └──────┴──────────┴───────┘
 *
 * extend: "bottom"
 * ┌──────┬──────────┬───────┐
 * │      │   top    │       │
 * │ left ├──────────┤ right │
 * │      │   main   │       │
 * ├──────┴──────────┴───────┤
 * │         bottom          │
 * └─────────────────────────┘
 *
 * extend: "left"
 * ┌──────┬──────────────────┐
 * │      │   top            │
 * │      ├──────────┬───────│
 * │ left │   main   │ right │
 * │      ├──────────┴───────┤
 * │      │  bottom          │
 * └──────┴──────────────────┘
 *
 * extend: "right"
 * ┌─────────────────┬───────┐
 * │          top    │       │
 * ├──────┬──────────┤       │
 * │ left │   main   │ right │
 * ├──────┴──────────┤       │
 * │         bottom  │       │
 * └─────────────────┴───────┘
 */
export type LayoutOption =
  | 'left and right'
  | 'top and bottom'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

/**
 * Menu Presentation Variants
 *
 * Controls how navigation menus are displayed and behave within the layout:
 *
 * - `'float'`: Compact mode - navigation collapses to a minimal state and expands on interaction
 * - `'scroll'`: Full mode - navigation remains fully visible and scrolls with content
 */
export type MenuVariant = 'float' | 'scroll';

/**
 * Drawer Layout Modes
 *
 * Determines how drawer interact with the main content area and overall layout:
 *
 * - `'over'`: Drawer floats over the main content without affecting its layout or dimensions.
 *   Content remains at full width, panel appears as an overlay.
 * - `'push'`: Drawer pushes the main content aside, reducing its available width.
 *   Content area shrinks to accommodate the panel space.
 */
export type DrawerMode = 'over' | 'push';

/**
 * Drawer Sizes
 *
 * Defines the available states for panel visibility and sizing:
 *
 * - `'closed'`: Panel is completely hidden with zero width/height
 * - `'icons'`: Panel shows minimal width/height, typically for icon-only display
 * - `'nav'`: Panel displays at navigation width, suitable for menu items with labels
 * - `'open'`: Panel shows at standard width for general content
 * - `'extra'`: Panel expands to maximum width for detailed content
 *
 * ## State Transitions
 * States can be toggled between any two options, commonly:
 * - `closed` ↔ `open` - Basic show/hide
 * - `icons` ↔ `nav` - Expand/collapse navigation
 * - `open` ↔ `extra` - Standard to expanded view
 */
export type DrawerState = 'closed' | 'icons' | 'nav' | 'open' | 'extra';

/**
 * Data Attribute Format for Panels
 *
 * Defines the string format used for panel data attributes that drive CSS behavior.
 * The format is: `{mode}-{state}[ extend]`
 *
 * @example
 * - `"over-open"` - Panel floating over content at standard width
 * - `"over-closed"` - Panel hidden
 */
export type DrawerStateOption = `${DrawerMode}-${DrawerState}${'' | ' extend'}`;
