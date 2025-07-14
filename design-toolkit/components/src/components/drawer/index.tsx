import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';
import { LAYOUT_ID, PANEL_CONFIG_DEFAULT } from './config';
import {
  LAYOUT_EXTEND_DEFAULT,
  type LayoutConfig,
  MENU_DEFAULT,
  type PanelLabel,
  type PanelState,
} from './config';

import { DrawerStyles } from './styles';

const { root } = DrawerStyles();

/**
 * Props interface for child panel components
 *
 * Standard props shared by all panel components (Top, Bottom, Left, Right, Main).
 */
interface PanelProps extends PropsWithChildren {
  /** Additional Tailwind CSS classes to apply to the panel */
  className?: string;
}

/**
 * Props interface for the main RouteLayout wrapper component
 */
export interface RouteLayoutProps
  extends PropsWithChildren,
    Partial<Record<PanelLabel, PanelState>> {
  /** Additional Tailwind CSS classes to apply to the layout container */
  className?: string;
}

/**
 * RouteLayout - Panel-Based Layout System
 *
 * A high-performance compound component system that provides flexible panel management
 * with CSS-driven animations and state coordination. Features a modular configuration
 * API for maximum flexibility and maintainability.
 *
 * @see {@link ./README.md} - Complete documentation with examples, configuration options, and layout presets
 *
 * ## ✨ Key Features
 * - **Modular Configuration**: Initial panel state via the `panels` prop
 * - **Layout Presets**: 4 built-in layout configurations via the `extend` prop
 * - **Performance First**: CSS-driven animations with no React re-renders for panel state transitions
 * - **Type Safe**: Comprehensive TypeScript coverage with IntelliSense support
 * - **Accessibility**: Semantic HTML with proper ARIA attributes
 *
 * ## 🎯 Modular Configuration API
 *
 * Configure panels individually with the `panels` prop:
 * ```tsx
 * <RouteLayout
 *   extend="top and bottom"
 *   menu="float"
 *   panels={{
 *     top: 'over-open extend',
 *     left: 'push-nav',
 *     right: 'over-closed',
 *   }}
 * >
 *   <RouteLayout.Top>Navigation Header</RouteLayout.Top>
 *   <RouteLayout.Left>Sidebar Menu</RouteLayout.Left>
 *   <RouteLayout.Main>Page Content</RouteLayout.Main>
 * </RouteLayout>
 * ```
 *
 * ## 🏗️ Layout Presets via `extend` Prop
 *
 * Choose from 4 layout presets that determine panel relationships:
 * - `"left and right"` - Side panels extend full height (default)
 * - `"top and bottom"` - Horizontal panels extend full width
 * - `"top"` - Only top panel extends full width
 * - `"bottom"` - Only bottom panel extends full width
 *
 * ## 📋 Panel Configuration
 *
 * Each panel accepts a string configuration in the format `{mode}-{state}[ extend]`:
 * - **mode**: `'over'` (overlay) or `'push'` (layout-affecting)
 * - **state**: `'closed'`, `'icons'`, `'nav'`, `'open'`, `'extra'`
 * - **extend**: Optional `' extend'` suffix to extend behind primary panels
 *
 * Examples: `'over-open'`, `'push-nav'`, `'over-closed extend'`
 *
 * ## 🎨 Menu Variants
 *
 * Control navigation display with the `menu` prop:
 * - `"scroll"` - Full visibility, scrolls with content (default)
 * - `"float"` - Compact mode, expands on interaction
 *
 * The "panels" are child nodes to this wrapper component and are placed within a
 * CSS grid. The intention of this layout system is to be as minimal a footprint
 * as possible and therefore have minimal impact on application performance.
 * Since this component will be used for route-based page organization, it
 * provides no state or context to be shared; all state or context would be
 * provided by other components or implementations.
 *
 * @param children - All of the content (components) to be rendered in the layout
 * @param className - Additional Tailwind CSS classes to apply
 * @param extend - Layout preset controlling which panels extend beyond their grid areas
 * @param menu - Menu variant: 'float' for compact, 'scroll' for persistent
 * @param panels - Panel configurations as strings with format "{mode}-{state}[ extend]"
 */
export function RouteLayout({
  children,
  className,
  ...settings
}: RouteLayoutProps & LayoutConfig) {
  return (
    <div
      className={cn(
        root(),
        // base styles
        'group/layout relative top-[var(--classification-banner-height)]',
        // grid definition
        'grid grid-cols-[var(--route-layout-grid-cols)] grid-rows-[var(--route-layout-grid-rows)] transition-[grid-template-columns,grid-template-rows]',
        // menu styles
        'data-[menu*=float]:h-[var(--available-height)] data-[menu*=scroll]:min-h-[var(--available-height)]',
        className ?? '',
      )}
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
}

/**
 * RouteLayout.Bottom - Bottom Panel Component
 *
 * @param children - Bottom content
 * @param className - Additional Tailwind CSS classes to apply
 * @param props - Additional HTML attributes passed to the footer element
 */
RouteLayout.Bottom = ({ children, className, ...props }: PanelProps) => (
  <footer
    className={cn(
      // base styles
      'relative row-start-3 row-end-4',
      // grid placement
      'z-5 col-start-2 col-end-3 group-data-[extend*=bottom]/layout:z-10 group-data-[bottom*=extend]/layout:col-start-1 group-data-[extend*=bottom]/layout:col-start-1 group-data-[extend=right]/layout:col-start-1 group-data-[bottom*=extend]/layout:col-end-4 group-data-[extend*=bottom]/layout:col-end-4 group-data-[extend=left]/layout:col-end-4',
      // allows pointer events to pass-through, i.e. to the map
      'pointer-events-none [&>*]:pointer-events-auto',
      // hides all content except the panel-menu when closed
      'group-data-[bottom*=closed]/layout:[&>*:not(nav)]:hidden',
      className ?? '',
    )}
    {...props}
    data-panel='bottom'
  >
    {children}
  </footer>
);

/**
 * RouteLayout.Left - Left Sidebar Panel Component
 *
 * @param children - Sidebar content (navigation menus, tool palettes, etc.)
 * @param className - Additional Tailwind CSS classes to apply
 * @param props - Additional HTML attributes passed to the aside element
 */
RouteLayout.Left = ({ children, className, ...props }: PanelProps) => (
  <aside
    className={cn(
      // base styles
      'relative col-start-1 col-end-2',
      // allows pointer events to pass-through, i.e. to the map
      'pointer-events-none [&>*]:pointer-events-auto',
      // grid placement
      'z-5 row-start-2 row-end-3 group-data-[extend*=left]/layout:z-10 group-data-[extend=right]/layout:z-1 group-data-[extend*=left]/layout:row-start-1 group-data-[extend=bottom]/layout:row-start-1 group-data-[left*=extend]/layout:row-start-1 group-data-[extend*=left]/layout:row-end-4 group-data-[extend=top]/layout:row-end-4 group-data-[left*=extend]/layout:row-end-4',
      // hides all content except the panel-menu when closed
      'group-data-[left*=closed]/layout:[&>*:not(nav)]:hidden',
      className ?? '',
    )}
    {...props}
    data-panel='left'
  >
    {children}
  </aside>
);

/**
 * RouteLayout.Main - Main Content Area Component
 *
 * @param children - The main page content (articles, forms, data displays, etc.)
 * @param className - Additional Tailwind CSS classes to apply
 * @param props - Additional HTML attributes passed to the main element
 */
RouteLayout.Main = ({ children, className, ...props }: PanelProps) => (
  <main
    className={cn(
      'relative z-1 col-[var(--panel-main-cols)] row-[var(--panel-main-rows)]',
      className ?? '',
    )}
    {...props}
  >
    {children}
  </main>
);

/**
 * RouteLayout.Right - Right Sidebar Panel Component
 *
 * @param children - Sidebar content (details, tools, contextual information, etc.)
 * @param className - Additional Tailwind CSS classes to apply
 * @param props - Additional HTML attributes passed to the aside element
 */
RouteLayout.Right = ({ children, className, ...props }: PanelProps) => (
  <aside
    className={cn(
      // base styles
      'relative col-start-3 col-end-4',
      // allows pointer events to pass-through, i.e. to the map
      'pointer-events-none [&>*]:pointer-events-auto',
      // grid placement
      'z-5 row-start-2 row-end-3 group-data-[extend*=right]/layout:z-10 group-data-[extend=left]/layout:z-1 group-data-[extend*=right]/layout:row-start-1 group-data-[extend=bottom]/layout:row-start-1 group-data-[right*=extend]/layout:row-start-1 group-data-[extend*=right]/layout:row-end-4 group-data-[extend=top]/layout:row-end-4 group-data-[right*=extend]/layout:row-end-4',
      // hides all content except the panel-menu when closed
      'group-data-[right*=closed]/layout:[&>*:not(nav)]:hidden',
      className ?? '',
    )}
    {...props}
    data-panel='right'
  >
    {children}
  </aside>
);

/**
 * RouteLayout.Top - Top Panel Component
 *
 * @param children - Top content (titles, navigation, user controls, etc.)
 * @param className - Additional Tailwind CSS classes to apply
 * @param props - Additional HTML attributes passed to the header element
 */
RouteLayout.Top = ({ children, className, ...props }: PanelProps) => (
  <header
    className={cn(
      // base styles
      'relative row-start-1 row-end-2',
      // allows pointer events to pass-through, i.e. to the map
      'pointer-events-none [&>*]:pointer-events-auto',
      // grid placement
      'z-5 col-start-2 col-end-3 group-data-[extend*=top]/layout:z-10 group-data-[extend*=top]/layout:col-start-1 group-data-[extend=right]/layout:col-start-1 group-data-[top*=extend]/layout:col-start-1 group-data-[extend*=top]/layout:col-end-4 group-data-[extend=left]/layout:col-end-4 group-data-[top*=extend]/layout:col-end-4',
      // hides all content except the panel-menu when closed
      'group-data-[top*=closed]/layout:[&>*:not(nav)]:hidden',
      className ?? '',
    )}
    {...props}
    data-panel='top'
  >
    {children}
  </header>
);
