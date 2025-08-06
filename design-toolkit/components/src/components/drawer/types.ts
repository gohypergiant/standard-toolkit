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
 * Defines the possible sizes for a drawer.
 */
export type DrawerSize = 'small' | 'medium' | 'large';

/**
 * Defines the possible placements for a drawer.
 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export type DrawerLayoutPush =
  | DrawerPlacement
  | `${DrawerPlacement} ${DrawerPlacement}`
  | `${DrawerPlacement} ${DrawerPlacement} ${DrawerPlacement}`
  | `${DrawerPlacement} ${DrawerPlacement} ${DrawerPlacement} ${DrawerPlacement}`;

/**
 * Represents the state of a single drawer.
 */
export type DrawerState = {
  id: Key;
  isOpen: boolean;
  selectedMenuItemId?: Key;
};

/**
 * Base props for drawer container components.
 */
export interface DrawerContainerProps
  extends PropsWithChildren<{ className?: string }> {}

/**
 * Props for the `Drawer.Provider` component.
 */
export interface DrawerProviderProps extends PropsWithChildren {
  /**
   * A callback function that is called when the state of any drawer changes.
   * @param drawerId
   * @param state
   * @returns
   */
  onStateChange?: (drawerId: Key, state: DrawerState) => void;
}

/**
 * Props for the `Drawer.Layout` component.
 */
export interface DrawerLayoutProps extends DrawerContainerProps {
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
  push?: DrawerLayoutPush;
}

/**
 * Props for the `Drawer` component.
 */
export interface DrawerProps extends DrawerContainerProps {
  /**
   * The unique identifier for the drawer.
   */
  id: Key;
  /**
   * The placement of the drawer.
   * @default 'left'
   */
  placement: DrawerPlacement;
  /**
   * The size of the drawer.
   * @default 'medium'
   */
  size?: DrawerSize;
  /**
   * Whether the drawer is open or not.
   * @default false
   */
  isOpen?: boolean;
  /**
   * The id of the menu item that should be selected by default.
   */
  defaultSelectedMenuItemId?: Key;
  /**
   * A callback function that is called when the drawer is opened or closed.
   * @param boolean
   */
  onOpenChange?: OnOpenChangeCallback;
  /**
   * A callback function that is called when the state of the drawer changes.
   * @param state
   * @returns
   */
  onStateChange?: (state: DrawerState) => void;
}

/**
 * A callback function that is called when the drawer is opened or closed.
 * @param boolean
 */
export type OnOpenChangeCallback = ((isOpen: boolean) => void) | undefined;

/**
 * Props for the 'Drawer.Menu' component.
 */
export interface DrawerMenuProps extends DrawerContainerProps {
  /**
   * The position of the menu.
   * @default 'middle'
   */
  position?: 'start' | 'middle' | 'end';
}

/**
 * Props for the 'Drawer.Trigger' component.
 */
export interface DrawerTriggerProps extends DrawerContainerProps {
  /**
   * The id of the drawer to control.
   */
  for: Key;
  /**
   * The behavior of the trigger.
   * @default 'toggle'
   */
  behavior?: 'open' | 'close' | 'toggle';
  /**
   * The children of the component.
   */
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
}

/**
 * Props for the 'Drawer.Menu.Item' component.
 */
export type DrawerMenuItemProps = {
  /**
   * The unique identifier for the menu item.
   */
  id?: Key;
  /**
   * The class name for the menu item.
   */
  className?: string;
  /**
   * The children of the component.
   */
  children: ReactElement<DOMAttributes<FocusableElement>, string>;
};

/**
 * Props for the 'Drawer.Panel' component.
 */
export interface DrawerPanelProps extends DrawerContainerProps {
  /**
   * The unique identifier for the panel.
   */
  id?: Key;
}

/**
 * The value provided by the 'DrawersContext'.
 */
export type DrawersContextValue = {
  /**
   * A record of all the drawer's state.
   */
  drawerStates: Record<Key, DrawerState>;
  /**
   * A function to toggle the drawer.
   * @param drawerId
   * @returns
   */
  toggleDrawer: (drawerId: Key) => void;
  /**
   * A function to open a drawer.
   * @param drawerId
   * @param menuItemId
   * @returns
   */
  openDrawer: (drawerId: Key, menuItemId?: Key) => void;
  /**
   * A function to close a drawer.
   * @param drawerId
   * @returns
   */
  closeDrawer: (drawerId: Key) => void;
  /**
   * A function to get the state of a drawer.
   * @param drawerId
   * @returns
   */
  getDrawerState: (drawerId: Key) => DrawerState;
  /**
   * A function to register a drawer.
   * @param initialState
   * @param callbacks
   * @returns
   */
  registerDrawer: (
    initialState: DrawerState,
    callbacks?: {
      onOpenChange?: OnOpenChangeCallback;
      onStateChange?: (state: DrawerState) => void;
    },
  ) => void;

  /**
   * A function to check if a menu item is selected.
   * @param selectedMenuItemId
   * @param menuItemId
   * @returns
   */
  isSelectedMenuItem: (selectedMenuItemId?: Key, menuItemId?: Key) => boolean;
};

export type DrawerContextValue = {
  state: DrawerState;
};

/**
 * Extended Drawer Layout Configurations
 *
 * The layout system supports four different drawer extension modes that determine
 * how drawers are arranged and which drawers extend to the full container dimensions.
 *
 * extend: "left right"
 * ┌──────┬──────────┬───────┐
 * │      │   top    │       │
 * │      ├──────────┤       │
 * │ left │   main   │ right │
 * │      ├──────────┤       │
 * │      │  bottom  │       │
 * └──────┴──────────┴───────┘
 *
 * extend: "top bottom"
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
