/**
 * @fileoverview Panel Toggle Interface Types
 *
 * Defines the shared interface used by all panel toggle components in the route layout system.
 * This provides a consistent API for toggling between any two panel states.
 */

import type { PanelState } from './config';

/**
 * Panel Toggle Component Props Interface
 *
 * Standard interface used by all panel toggle components (PanelToggleTop, PanelToggleBottom,
 * PanelToggleLeft, PanelToggleRight, etc.) to ensure consistent behavior and configuration.
 *
 * ## Panel State Options
 *
 * Any two states from: `'closed'`, `'icons'`, `'nav'`, `'open'`, `'extra'`
 *
 * ## Common Toggle Patterns
 * - **Basic visibility**: `['closed', 'open']` - Simple show/hide
 * - **Navigation modes**: `['icons', 'nav']` - Icon-only to full navigation
 * - **Maximum expansion**: `['open', 'extra']` - Standard to expanded view
 *
 * @example
 * ```tsx
 * // Basic open/close toggle
 * <PanelToggleLeft options={['closed', 'open']} />
 *
 * // Navigation expansion toggle
 * <PanelToggleLeft options={['icons', 'nav']} />
 * ```
 */
export interface PanelToggleProps {
  /** Array of exactly two panel states to toggle between */
  options: [PanelState, PanelState];
}
