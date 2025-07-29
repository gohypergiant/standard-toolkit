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

export type DrawerSize = 'small' | 'medium' | 'large';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerState {
  id: Key;
  isOpen: boolean;
  selectedMenuItemId?: Key;
}

export type DrawerClassNames = Partial<{
  layout: string;
  main: string;
  menu: string;
  content: string;
}>;

export interface DrawerContainerProps
  extends PropsWithChildren<{ className?: string }> {}

export interface DrawerProviderProps extends PropsWithChildren {
  onStateChange?: (drawerId: Key, state: DrawerState) => void;
}

export interface DrawerLayoutProps
  extends DrawerContainerProps,
    Partial<Record<DrawerPlacement, DrawerState>> {
  /**
   * Which drawers should extend to full container dimensions.
   * Determines the overall layout structure and drawer relationships in regard to space.
   *
   * @default 'left right'
   */
  extend?: DrawerLayouts;
  /**
   * Determines how drawer interact with the main content area and overall layout:
   *
   * - `'push'`: Drawer pushes the main content aside, reducing its available width.
   *   Content area shrinks to accommodate the panel space.
   *   If no placements are defined for push, the default behavior for a drawer is to float over the main content without affecting its layout or dimensions.
   *   Content remains at full width, panel appears as an overlay.
   */
  push?: DrawerPlacement;
  classNames?: DrawerClassNames;
}

export interface DrawerProps extends DrawerContainerProps {
  id: Key;
  placement: DrawerPlacement;
  size?: DrawerSize;
  isOpen?: boolean;
  defaultSelectedMenuItemId?: Key;
  onOpenChange?: OnOpenChangeCallback;
  onStateChange?: (state: DrawerState) => void;
}

export type OnOpenChangeCallback = ((isOpen: boolean) => void) | undefined;

export interface DrawerMenuProps extends DrawerContainerProps {
  position?: 'start' | 'middle' | 'end';
}

export interface DrawerTriggerProps extends DrawerContainerProps {
  for: Key;
}

export interface DrawerMenuItemProps {
  className?: string;
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
  id?: Key;
}

export interface DrawerPanelProps extends DrawerContainerProps {
  id?: Key;
}

export interface DrawerLayoutContextValue {
  drawerStates: Record<Key, DrawerState>;
  toggleDrawer: (drawerId: Key) => void;
  openDrawer: (drawerId: Key, menuItemId?: Key) => void;
  closeDrawer: (drawerId: Key) => void;
  getDrawerState: (drawerId: Key) => DrawerState;
  registerDrawer: (
    initialState: DrawerState,
    callbacks?: {
      onOpenChange?: OnOpenChangeCallback;
      onStateChange?: (state: DrawerState) => void;
    },
  ) => void;
  selectedMenuItemId?: Key;
  selectMenuItem: (drawerId: Key, menuItemId?: Key) => void;
  isSelectedMenuItem: (selectedMenuItemId?: Key, menuItemId?: Key) => boolean;
}

export interface DrawerContextValue {
  state: DrawerState;
}

/**
 * Extended Drawer Layout Configurations
 *
 * The layout system supports four different drawer extension modes that determine
 * how drawers are arranged and which drawers extend to the full container dimensions.
 *
 * extend: "tall"
 * ┌──────┬──────────┬───────┐
 * │      │   top    │       │
 * │      ├──────────┤       │
 * │ left │   main   │ right │
 * │      ├──────────┤       │
 * │      │  bottom  │       │
 * └──────┴──────────┴───────┘
 *
 * extend: "wide"
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
export type DrawerLayouts =
  | 'left right'
  | 'top bottom'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export const DrawerDefaults = {
  selectedMenuItemId: undefined,
  isOpen: false,
} as const;
