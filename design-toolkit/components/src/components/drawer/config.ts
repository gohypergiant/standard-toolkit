import type { LayoutOption , MenuVariant, DrawerStateOption} from './types';
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
export const PANEL_CONFIG_DEFAULT: DrawerStateOption = 'over-closed' as const;
