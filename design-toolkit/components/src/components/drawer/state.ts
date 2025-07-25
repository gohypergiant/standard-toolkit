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
import type { DrawerMode, DrawerPlacement, DrawerSize, DrawerState } from './types';

export type DrawerAction =
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_SIZE'; size: DrawerSize }
  | { type: 'SET_MODE'; mode: DrawerMode };

/**
 * Default state for new drawers
 */
export const createDefaultDrawerState = (
  placement: DrawerPlacement,
  mode: DrawerMode = 'overlay',
  size: DrawerSize = 'medium',
  isOpen = false,
): DrawerState => ({ mode, size, placement, isOpen });

export const drawerStateReducer = (
  state: DrawerState,
  action: DrawerAction,
): DrawerState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'OPEN':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE':
      return {
        ...state,
        isOpen: false,
      };

    case 'SET_SIZE':
      return {
        ...state,
        size: action.size,
        isOpen: true,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };

    default:
      return state;
  }
};
