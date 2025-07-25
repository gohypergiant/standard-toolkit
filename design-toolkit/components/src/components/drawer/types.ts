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
import type { FocusableElement, Key } from '@react-types/shared';
import type { DOMAttributes, PropsWithChildren, ReactElement } from 'react';

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
export type DrawerMode = 'overlay' | 'push';

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
export type DrawerSize = 'menu-size' | 'small' | 'medium' | 'large';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerState {
  mode: DrawerMode;
  size: DrawerSize;
  selectedMenuItemId?: Key;
  placement: DrawerPlacement;
  isOpen: boolean;
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
  id: Key;
  placement: DrawerPlacement;
  mode?: DrawerMode;
  size?: DrawerSize;
  isOpen?: boolean;
  defaultSelectedMenuItemId?: Key;
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
  for: Key;
}

export interface DrawerMenuItemProps {
  className?: string;
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
  id?: Key;
}

export interface DrawerPanelProps extends ContainerProps {
  id?: Key;
}

export interface DrawerLayoutContextValue {
  drawerStates: Record<Key, DrawerState>;
  toggleDrawer: (drawerId: Key) => void;
  openDrawer: (drawerId: Key) => void;
  closeDrawer: (drawerId: Key) => void;
  setDrawerSize: (drawerId: Key, size: DrawerSize) => void;
  setDrawerMode: (drawerId: Key, mode: DrawerMode) => void;
  getDrawerState: (drawerId: Key) => DrawerState;
  registerDrawer: (
    drawerId: Key,
    initialState: DrawerState,
    callbacks?: {
      onOpenChange?: OnOpenChangeCallback;
      onStateChange?: (state: DrawerState) => void;
    },
  ) => void;
  isDrawerVisible: (drawerId: Key) => boolean;
  selectedMenuItemId?: Key;
  selectMenuItem: (drawerId: Key, menuItemId?: Key) => void;
  showSelected: (drawerId: Key, menuItemId?: Key) => boolean;
}

export interface DrawerContextValue {
  drawerId: Key;
  state?: DrawerState;
  selectedMenuItemId?: Key;
  selectMenuItem: (drawerId: Key, menuItemId?: Key) => void;
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
  | 'left right'
  | 'top bottom'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export const DrawerDefaults = {
  placement: 'left',
  mode: 'overlay',
  selectedMenuItemId: undefined,
  size: 'medium',
  isOpen: false,
} as const;
