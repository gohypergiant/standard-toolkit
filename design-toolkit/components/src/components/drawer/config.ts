/**
 * @fileoverview Route Layout Configuration Types and Constants
 *
 * This module defines the core configuration system for the Route Layout component,
 * including panel layouts, states, and the modular configuration API.
 */

/**
 * Complete Layout Configuration
 *
 * Defines the overall layout behavior and individual panel configurations.
 * This is the modular configuration API that provides maximum flexibility
 * while maintaining sensible defaults.
 *
 * @example
 * ```tsx
 * const layoutConfig: LayoutConfig = {
 *   extend: 'top and bottom',
 *   menu: 'float',
 *   panels: {
 *     top: 'over-open extend',
 *     left: 'push-nav',
 *     right: 'over-closed'
 *   }
 * };
 * ```
 */
export interface LayoutConfig {
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
  panels?: Partial<Record<PanelLabel, PanelStateOption>>;
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
type LayoutOption =
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
type MenuVariant = 'float' | 'scroll';

/**
 * Panel names in the layout system.
 */
export type PanelLabel = 'bottom' | 'top' | 'left' | 'right';

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
type PanelMode = 'over' | 'push';

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
export type PanelState = 'closed' | 'icons' | 'nav' | 'open' | 'extra';

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
export type PanelStateOption = `${PanelMode}-${PanelState}${'' | ' extend'}`;

/**
 * Default Extended Panel Configuration
 *
 * The default layout preset where left and right panels extend to full container height.
 */
export const LAYOUT_EXTEND_DEFAULT: LayoutOption = 'left and right' as const;

/**
 * Unique Layout Container Identifier
 *
 * Used to create unique CSS selectors and prevent style conflicts.
 *
 * It looks like a UUIDv4, but it's actually derived from "this is a unique string" via SHA-256
 */
export const LAYOUT_ID = 'b8a0eb6e-5b5d-e65e-93d2-2596b8b7dcd9';

/**
 * CSS Selector for Layout Container
 *
 * Pre-built selector string for targeting the layout container in CSS and JavaScript.
 */
export const LAYOUT_SELECTOR = `[data-id=${LAYOUT_ID}]`;

/**
 * Default Menu Variant
 *
 * The default menu presentation mode. 'scroll' provides full visibility of navigation
 * items and is suitable for most application interfaces.
 */
export const MENU_DEFAULT: MenuVariant = 'scroll' as const;

/**
 * Default Panel Configuration
 *
 * The default state of panels when no config is provided.
 */
export const PANEL_CONFIG_DEFAULT: PanelStateOption = 'over-closed' as const;
