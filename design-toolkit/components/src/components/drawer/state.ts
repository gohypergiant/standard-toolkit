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
import type {
  DrawerMode,
  DrawerPlacement,
  DrawerSize,
  DrawerState,
} from './types';

export type DrawerAction =
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_SIZE'; size: DrawerSize }
  | { type: 'SET_MODE'; mode: DrawerMode }
  | { type: 'SET_EXTENDED'; extended: boolean };

/**
 * Default state for new drawers
 */
export const createDefaultDrawerState = (
  mode: DrawerMode = 'over',
  size: DrawerSize = 'open',
  extended = false,
): DrawerState => ({ mode, size, extended });

export const drawerStateReducer = (
  state: DrawerState,
  action: DrawerAction,
): DrawerState => {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        size: state.size === 'closed' ? 'open' : 'closed',
      };

    case 'OPEN':
      return {
        ...state,
        size: state.size === 'closed' ? 'open' : state.size,
      };

    case 'CLOSE':
      return {
        ...state,
        size: 'closed',
      };

    case 'SET_SIZE':
      return {
        ...state,
        size: action.size,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };
    case 'SET_EXTENDED':
      return {
        ...state,
        extended: action.extended,
      };

    default:
      return state;
  }
};

/**
 * Convert drawer state to CSS data attributes
 */
export const stateToDataAttribute = (state: DrawerState): string => {
  const base = `${state.mode}-${state.size}`;
  return state.extended ? `${base} extend` : base;
};

/**
 * Check if drawer is visible (not closed)
 */
export const isDrawerVisible = (state: DrawerState): boolean => {
  return state.size !== 'closed';
};

/**
 * Check if drawer is in an open state
 */
export const isDrawerOpen = (state: DrawerState): boolean => {
  return ['nav', 'open', 'extra', 'nav', 'icons'].includes(state.size);
};

/**
 * Type guards for runtime validation
 */
export const isValidDrawerMode = (value: unknown): value is DrawerMode => {
  return typeof value === 'string' && ['over', 'push'].includes(value);
};

export const isValidDrawerSize = (value: unknown): value is DrawerSize => {
  return (
    typeof value === 'string' &&
    ['closed', 'icons', 'nav', 'open', 'extra'].includes(value)
  );
};

export const isValidDrawerPlacement = (
  value: unknown,
): value is DrawerPlacement => {
  return (
    typeof value === 'string' &&
    ['left', 'right', 'top', 'bottom'].includes(value)
  );
};
