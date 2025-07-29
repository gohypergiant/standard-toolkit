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
import { DrawerDefaults, type DrawerState } from './types';

import type { Key } from '@react-types/shared';

export type DrawerAction =
  | { type: 'TOGGLE' }
  | { type: 'OPEN'; menuItemId?: Key }
  | { type: 'CLOSE' }
  | { type: 'SET_MENU_ID'; menuItemId?: Key };

/**
 * Default state for new drawers
 */
export const createDefaultDrawerState = ({
  id,
  selectedMenuItemId = DrawerDefaults.selectedMenuItemId,
  isOpen = DrawerDefaults.isOpen,
}: {
  id: Key;
  selectedMenuItemId?: Key;
  isOpen?: boolean;
}): DrawerState => ({ id, isOpen, selectedMenuItemId });

export const drawerStateReducer = (
  state: DrawerState,
  action: DrawerAction,
): DrawerState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        isOpen: !state.isOpen,
        selectedMenuItemId: state.isOpen ? undefined : state.selectedMenuItemId,
      };

    case 'OPEN':
      return {
        ...state,
        isOpen: true,
        selectedMenuItemId: action.menuItemId,
      };

    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
        selectedMenuItemId: undefined,
      };

    case 'SET_MENU_ID':
      return {
        ...state,
        selectedMenuItemId: action.menuItemId,
      };

    default:
      return state;
  }
};
