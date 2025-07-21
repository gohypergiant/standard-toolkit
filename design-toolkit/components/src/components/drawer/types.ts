/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import type { FocusableElement } from '@react-types/shared';
import type { DOMAttributes, PropsWithChildren, ReactElement } from 'react';

export type DrawerId = string;
export type MenuItemId = string;
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
 * - `'content'`: Panel shows at standard width for general content
 * - `'extra'`: Panel expands to maximum width for detailed content
 *
 * ## State Transitions
 * States can be toggled between any two options, commonly:
 * - `closed` ↔ `open` - Basic show/hide
 * - `icons` ↔ `nav` - Expand/collapse navigation
 * - `open` ↔ `extra` - Standard to expanded view
 */
export type DrawerSize = 'closed' | 'icons' | 'nav' | 'content' | 'extra';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerState {
  mode: DrawerMode;
  size: DrawerSize;
  initialSize: DrawerSize;
  extended: boolean;
}

interface ContainerProps extends PropsWithChildren<{ className?: string }> {}

export interface DrawerRootProps
  extends ContainerProps,
    Partial<Record<DrawerPlacement, DrawerState>> {
  /**
   * Which drawers should extend to full container dimensions.
   * Determines the overall layout structure and drawer relationships in regard to space.
   *
   * @default 'left and right'
   */
  extend?: DrawerExtensions;
}

export interface DrawerProps extends ContainerProps {
  id: DrawerId;
  placement: DrawerPlacement;
  mode?: DrawerMode;
  size?: DrawerSize;
  isOpen?: boolean;
  onOpenChange?: OnOpenChangeCallback;
  onStateChange?: (state: DrawerState) => void;
}

export type OnOpenChangeCallback = ((isOpen: boolean) => void) | undefined;
export interface DrawerContentProps extends ContainerProps {}
export interface DrawerMainProps extends ContainerProps {}
export interface DrawerHeaderProps extends ContainerProps {}
export interface DrawerTitleProps extends ContainerProps {}
export interface DrawerCloseProps extends ContainerProps {}

export interface DrawerMenuProps extends ContainerProps {
  position?: 'start' | 'middle' | 'end';
}

export interface DrawerTriggerProps extends ContainerProps {
  for: DrawerId;
}

export interface DrawerMenuItemProps {
  className?: string;
  children: ReactElement<DOMAttributes<FocusableElement>, string>
  id?: MenuItemId;
}

export interface DrawerPanelProps extends ContainerProps {
  id?: MenuItemId;
}

export interface UseDrawerToggleProps {
  drawerId: DrawerId;
}

export interface DrawerLayoutContextValue {
  drawerStates: Record<DrawerId, DrawerState>;
  drawerPlacements: Record<DrawerId, DrawerPlacement>;
  toggleDrawer: (drawerId: DrawerId) => void;
  openDrawer: (drawerId: DrawerId) => void;
  closeDrawer: (drawerId: DrawerId) => void;
  setDrawerSize: (drawerId: DrawerId, size: DrawerSize) => void;
  setDrawerMode: (drawerId: DrawerId, mode: DrawerMode) => void;
  getDrawerState: (drawerId: DrawerId) => DrawerState;
  registerDrawer: (
    drawerId: DrawerId,
    placement: DrawerPlacement,
    initialState: DrawerState,
    callbacks?: {
      onOpenChange?: OnOpenChangeCallback;
      onStateChange?: (state: DrawerState) => void;
    },
  ) => void;
  getDrawerPlacement: (drawerId: DrawerId) => DrawerPlacement | undefined;
  isDrawerVisible: (drawerId: DrawerId) => boolean;
  selectedMenuItemId?: MenuItemId;
  selectMenuItem: (menuItemId?: MenuItemId) => void;
  showSelected: (menuItemId?: MenuItemId) => boolean;
}

export interface DrawerContextValue {
  drawerId: DrawerId;
  placement: DrawerPlacement;
  state?: DrawerState;
  selectedMenuItemId?: MenuItemId;
  selectMenuItem: (menuItemId?: MenuItemId) => void;
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
export type DrawerExtensions =
  | 'left and right'
  | 'top and bottom'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';
