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
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  type DrawerAction,
  createDefaultDrawerState,
  drawerStateReducer,
} from './state';
import {
  type DrawerContextValue,
  DrawerDefaults,
  type DrawerState,
  type DrawersContextValue,
  type OnOpenChangeCallback,
} from './types';

import type { Key } from '@react-types/shared';

const DrawersContext = createContext<DrawersContextValue | null>(null);
const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error('useDrawerContext must be used within <Drawer.Provider>');
  }

  return ctx;
}

export function useDrawersContext(): DrawersContextValue {
  const ctx = useContext(DrawersContext);

  if (!ctx) {
    throw new Error('useDrawersContext must be used within <Drawer.Provider>');
  }

  return ctx;
}

type DrawerCallbacks = {
  onOpenChange?: OnOpenChangeCallback;
  onStateChange?: (state: DrawerState) => void;
};

export function useDrawersState(opts?: {
  onStateChange?: (drawerId: Key, state: DrawerState) => void;
}) {
  const [drawerStates, setDrawerStates] = useState<Record<Key, DrawerState>>(
    {},
  );
  const [callbacks, setCallbacks] = useState<Record<Key, DrawerCallbacks>>({});

  const notifyCallbacks = useCallback(
    (drawerId: Key, nextState: DrawerState) => {
      const drawerCallbacks = callbacks[drawerId];
      if (drawerCallbacks) {
        drawerCallbacks.onOpenChange?.(nextState.isOpen);
        drawerCallbacks.onStateChange?.(nextState);
      }
      opts?.onStateChange?.(drawerId, nextState);
    },
    [opts?.onStateChange, callbacks],
  );

  const updateDrawerState = useCallback(
    (drawerId: Key, action: DrawerAction) => {
      setDrawerStates((prev) => {
        const currentState =
          prev[drawerId] ||
          createDefaultDrawerState({
            id: drawerId,
            selectedMenuItemId: DrawerDefaults.selectedMenuItemId,
            isOpen: DrawerDefaults.isOpen,
          });
        const nextState = drawerStateReducer(currentState, action);

        notifyCallbacks(drawerId, nextState);

        return {
          ...prev,
          [drawerId]: nextState,
        };
      });
    },
    [notifyCallbacks],
  );

  const toggleDrawer = useCallback(
    (drawerId: Key) => {
      updateDrawerState(drawerId, { type: 'TOGGLE' });
    },
    [updateDrawerState],
  );

  const openDrawer = useCallback(
    (drawerId: Key, menuItemId?: Key) => {
      updateDrawerState(drawerId, { type: 'OPEN', menuItemId });
    },
    [updateDrawerState],
  );

  const closeDrawer = useCallback(
    (drawerId: Key) => {
      updateDrawerState(drawerId, { type: 'CLOSE' });
    },
    [updateDrawerState],
  );

  const selectMenuItem = useCallback(
    (drawerId: Key, menuItemId?: Key) => {
      updateDrawerState(drawerId, {
        type: 'SET_MENU_ID',
        menuItemId: menuItemId ?? '',
      });
    },
    [updateDrawerState],
  );

  const isSelectedMenuItem = useCallback(
    (selectedMenuItemId?: Key, menuItemId?: Key) => {
      return (
        selectedMenuItemId !== '' &&
        typeof selectedMenuItemId !== 'undefined' &&
        menuItemId === selectedMenuItemId
      );
    },
    [],
  );

  const getDrawerState = useCallback(
    (drawerId: Key): DrawerState => {
      return (
        drawerStates[drawerId] ||
        createDefaultDrawerState({
          id: drawerId,
          selectedMenuItemId: DrawerDefaults.selectedMenuItemId,
          isOpen: DrawerDefaults.isOpen,
        })
      );
    },
    [drawerStates],
  );

  const registerDrawer = useCallback(
    (initialState: DrawerState, drawerCallbacks?: DrawerCallbacks) => {
      setCallbacks((prev) => ({
        ...prev,
        [initialState.id]: drawerCallbacks || {},
      }));

      setDrawerStates((prev) => {
        const currentState = prev[initialState.id];
        return {
          ...prev,
          [initialState.id]: {
            ...initialState,
            selectedMenuItemId:
              currentState?.selectedMenuItemId ??
              initialState.selectedMenuItemId,
          },
        };
      });
    },
    [],
  );

  const contextValue = useMemo<DrawersContextValue>(
    () => ({
      drawerStates,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      getDrawerState,
      registerDrawer,
      selectMenuItem,
      isSelectedMenuItem,
    }),
    [
      drawerStates,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      getDrawerState,
      registerDrawer,
      selectMenuItem,
      isSelectedMenuItem,
    ],
  );

  return contextValue;
}

export { DrawersContext, DrawerContext };
