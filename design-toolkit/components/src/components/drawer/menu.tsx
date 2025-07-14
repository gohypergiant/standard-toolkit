/**
 * @fileoverview Panel Menu Components
 *
 * Provides a vertical menu that appears beside the panels so that when "closed"
 * the menu is still visible. These components work in conjunction with panel
 * toggles to provide expanded functionality when panels are in collapsed or
 * mini states.
 *
 * @see {@link PanelMenuForLeftPanel} - Left-positioned panel menu
 * @see {@link PanelMenuForRightPanel} - Right-positioned panel menu
 */

import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

/**
 * Base props interface for panel menu components
 */
interface BaseProps extends PropsWithChildren {
  /** Base styling string for the menu component */
  baseStyle: string;
  /** Additional Tailwind CSS classes to apply to the menu */
  className: string;
}

/**
 * Shared base styles for vertical panel menus.
 * Extracted from a React element to maintain Tailwind IntelliSense support.
 * Used for left and right panel menus that display vertically.
 */
const forVertical = (
  <br className='absolute mt-xxl w-[var(--panel-size-icons)] rounded-large bg-surface-default py-s' />
).props.className as string;

/**
 * Shared base styles for horizontal panel menus.
 * Extracted from a React element to maintain Tailwind IntelliSense support.
 * Used for header and footer panel menus that display horizontally.
 */
const forHorizontal = (
  <br className='transform-[translateX(-50%)] absolute left-[50%] flex h-[var(--panel-size-icons)] rounded-large bg-surface-default px-s' />
).props.className as string;

/**
 * Base component for all panel menus.
 * Provides the foundational structure and styling system for menu components.
 *
 * @param baseStyle - The base styling string (vertical or horizontal)
 * @param children - Menu content (buttons, links, toggles, etc.)
 * @param className - Additional Tailwind CSS classes for customization
 * @param props - Additional HTML nav element attributes
 */
function Base({ baseStyle, children, className, ...props }: BaseProps) {
  return (
    <nav className={cn(baseStyle, className)} {...props}>
      {children}
    </nav>
  );
}

/**
 * PanelMenuForBottomPanel - Bottom Panel Horizontal Menu
 *
 * Creates a horizontal menu positioned above the bottom panel.
 * Displays as a horizontal bar that appears when the bottom panel needs
 * quick-access controls or navigation elements.
 *
 * ## Features:
 * - Horizontal layout optimized for bottom placement
 * - Positioned above the bottom panel area
 * - Rounded corners except where it connects to the bottom
 * - Responsive sizing based on panel icon dimensions
 *
 * ## Usage:
 * ```tsx
 * // In bottom panel
 * <PanelMenuForBottomPanel>
 *   <PanelToggleBottom options={['over-closed', 'over-open']} />
 *   // ...
 * </PanelMenuForBottomPanel>
 * ```
 *
 * @param children - Menu content (toggles, buttons, links, etc.)
 */
export function PanelMenuForBottomPanel(props: PropsWithChildren) {
  return (
    <Base
      baseStyle={forHorizontal}
      className={'-translate-y-[var(--panel-size-icons)] rounded-b-none'}
    >
      {props.children}
    </Base>
  );
}

/**
 * PanelMenuForTopPanel - Top Panel Horizontal Menu
 *
 * Creates a horizontal menu positioned below the top panel.
 * Displays as a horizontal bar that provides quick access to top-related
 * controls and navigation elements.
 *
 * ## Features:
 * - Horizontal layout optimized for top placement
 * - Positioned below the top panel area
 * - Rounded corners except where it connects to the top
 * - Responsive sizing based on panel icon dimensions
 *
 * ## Usage:
 * ```tsx
 * // In top panel
 * <PanelMenuForTopPanel>
 *   <PanelToggleTop options={['over-closed', 'over-open']} />
 *   // ...
 * </PanelMenuForTopPanel>
 * ```
 *
 * @param children - Menu content (toggles, user controls, notifications, etc.)
 */
export function PanelMenuForTopPanel(props: PropsWithChildren) {
  return (
    <Base
      baseStyle={forHorizontal}
      className={
        'bottom-0 translate-y-[var(--panel-size-icons)] rounded-t-none'
      }
    >
      {props.children}
    </Base>
  );
}

/**
 * PanelMenuForLeftPanel - Left Panel Vertical Menu
 *
 * Creates a vertical menu positioned to the right of the left panel.
 * Typically used to provide quick access to navigation controls and panel
 * toggles when the left panel is in a collapsed or minimal state.
 *
 * ## Features:
 * - Vertical layout optimized for sidebar placement
 * - Positioned to the right edge of the left panel
 * - Rounded corners except where it connects to the panel
 * - Maintains visibility when panel is collapsed
 * - Width matches panel icon size for consistency
 *
 * ## Usage:
 * ```tsx
 * // In left panel
 * <PanelMenuForLeftPanel>
 *   <PanelToggleLeft options={['over-closed', 'over-open']} />
 *   // ...
 * </PanelMenuForLeftPanel>
 * ```
 *
 * @param children - Menu content (toggles, navigation buttons, quick actions, etc.)
 */
export function PanelMenuForLeftPanel(props: PropsWithChildren) {
  return (
    <Base baseStyle={forVertical} className={'left-full rounded-l-none'}>
      {props.children}
    </Base>
  );
}

/**
 * PanelMenuForRightPanel - Right Panel Vertical Menu
 *
 * Creates a vertical menu positioned to the left of the right panel.
 * Typically used to provide quick access to contextual tools and panel
 * toggles when the right panel is in a collapsed or minimal state.
 *
 * ## Features:
 * - Vertical layout optimized for sidebar placement
 * - Positioned to the left edge of the right panel
 * - Rounded corners except where it connects to the panel
 * - Maintains visibility when panel is collapsed
 * - Width matches panel icon size for consistency
 *
 * ## Usage:
 * ```tsx
 * // In right panel
 * <PanelMenuForRightPanel>
 *   <PanelToggleRight options={['over-closed', 'over-open']} />
 *   // ...
 * </PanelMenuForRightPanel>
 * ```
 *
 * @param children - Menu content (toggles, tools, contextual actions, etc.)
 */
export function PanelMenuForRightPanel(props: PropsWithChildren) {
  return (
    <Base
      baseStyle={forVertical}
      className={'-left-[var(--panel-size-icons)] rounded-r-none'}
    >
      {props.children}
    </Base>
  );
}
