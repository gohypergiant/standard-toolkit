import type { PropsWithChildren } from 'react';

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';
/**
 * Props interface for child panel components
 *
 * Standard props shared by all panel components (Top, Bottom, Left, Right, Main).
 */
export interface PanelProps extends PropsWithChildren {
  /** Additional Tailwind CSS classes to apply to the panel */
  className?: string;
}

/**
 * Props interface for the Drawer.Root component
 */
export interface DrawerRootProps
  extends PropsWithChildren,
    Partial<Record<DrawerAnchor, DrawerState>> {
  /** Additional Tailwind CSS classes to apply to the layout container */
  className?: string;
  /**
   * Which panels should extend to full container dimensions.
   * Determines the overall layout structure and panel relationships.
   *
   * @default 'left and right'
   */
  extend?: LayoutOption;

  /**
   * Menu presentation variant for navigation component.
   *
   * @default 'scroll'
   */
  menu?: MenuVariant;

  /**
   * Individual panel configurations as strings. Only specify panels you want to configure;
   * omitted panels will use system defaults (over-closed).
   *
   * Format: "{mode}-{state}[ extend]"
   * Examples: 'over-open', 'push-nav', 'over-closed extend'
   */
  panels?: Partial<Record<DrawerAnchor, DrawerStateOption>>;
}

export interface DrawerProps extends PropsWithChildren {
  anchor: DrawerAnchor;
  className?: string;
}

export interface DrawerMenuProps extends PropsWithChildren {
  anchor: DrawerAnchor;
  className?: string;
}

export interface DrawerToggleProps {
  /** Array of exactly two panel states to toggle between */
  options: [DrawerState, DrawerState];
}

export interface DrawerTriggerProps
  extends PropsWithChildren<DrawerToggleProps> {
  drawer: DrawerAnchor;
  className?: string;
}

export interface UseDrawerToggleProps extends DrawerToggleProps {
  drawer: DrawerAnchor;
}

/**
 * Extended Panel Layout Configurations
 *
 * The layout system supports four different panel extension modes that determine
 * how panels are arranged and which panels extend to the full container dimensions.
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
 * Panel Layout Modes
 *
 * Determines how panels interact with the main content area and overall layout:
 *
 * - `'over'`: Panel floats over the main content without affecting its layout or dimensions.
 *   Content remains at full width, panel appears as an overlay.
 * - `'push'`: Panel pushes the main content aside, reducing its available width.
 *   Content area shrinks to accommodate the panel space.
 */
export type DrawerMode = 'over' | 'push';

/**
 * Panel Sizes
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
