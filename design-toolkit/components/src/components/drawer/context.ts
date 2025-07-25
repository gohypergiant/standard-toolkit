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
import type {
  DrawerContextValue,
  DrawerLayoutContextValue,
  DrawerMode,
  DrawerPlacement,
  DrawerSize,
  DrawerState,
  OnOpenChangeCallback,
} from './types';

import type { Key } from '@react-types/shared';

const DrawerLayoutContext = createContext<DrawerLayoutContextValue | null>(
  null,
);
const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error('useDrawerContext must be used within <Drawer.Root>');
  }

  return ctx;
}

export function useDrawerLayoutContext(): DrawerLayoutContextValue {
  const ctx = useContext(DrawerLayoutContext);

  if (!ctx) {
    throw new Error('useDrawerLayoutContext must be used within <Drawer.Root>');
  }

  return ctx;
}

interface DrawerCallbacks {
  onOpenChange?: OnOpenChangeCallback;
  onStateChange?: (state: DrawerState) => void;
}

export function useDrawerLayoutState() {
  const [drawerStates, setDrawerStates] = useState<Record<Key, DrawerState>>(
    {},
  );
  const [drawerPlacements, setDrawerPlacements] = useState<
    Record<Key, DrawerPlacement>
  >({});
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<Key>();
  const [callbacks, setCallbacks] = useState<Record<Key, DrawerCallbacks>>({});

  const selectMenuItem = useCallback((menuItemId?: Key) => {
    setSelectedMenuItemId(menuItemId);
  }, []);

  const showSelected = useCallback(
    (menuItemId?: Key) => {
      return (
        selectedMenuItemId !== '' &&
        typeof selectedMenuItemId !== 'undefined' &&
        menuItemId === selectedMenuItemId
      );
    },
    [selectedMenuItemId],
  );

  const notifyCallbacks = useCallback(
    (drawerId: Key, nextState: DrawerState) => {
      const drawerCallbacks = callbacks[drawerId];
      if (drawerCallbacks) {
        drawerCallbacks.onOpenChange?.(nextState.isOpen);
        drawerCallbacks.onStateChange?.(nextState);
      }
    },
    [callbacks],
  );

  const updateDrawerState = useCallback(
    (drawerId: Key, action: DrawerAction) => {
      setDrawerStates((prev) => {
        const currentState = prev[drawerId] || createDefaultDrawerState('left');
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
    (drawerId: Key) => {
      updateDrawerState(drawerId, { type: 'OPEN' });
    },
    [updateDrawerState],
  );

  const closeDrawer = useCallback(
    (drawerId: Key) => {
      updateDrawerState(drawerId, { type: 'CLOSE' });
      setSelectedMenuItemId(undefined);
    },
    [updateDrawerState],
  );

  const setDrawerSize = useCallback(
    (drawerId: Key, size: DrawerSize) => {
      updateDrawerState(drawerId, { type: 'SET_SIZE', size });
    },
    [updateDrawerState],
  );

  const setDrawerMode = useCallback(
    (drawerId: Key, mode: DrawerMode) => {
      updateDrawerState(drawerId, { type: 'SET_MODE', mode });
    },
    [updateDrawerState],
  );

  const getDrawerState = useCallback(
    (drawerId: Key): DrawerState => {
      return drawerStates[drawerId] || createDefaultDrawerState('left');
    },
    [drawerStates],
  );

  const registerDrawer = useCallback(
    (
      drawerId: Key,
      placement: DrawerPlacement,
      initialState: DrawerState,
      drawerCallbacks?: DrawerCallbacks,
    ) => {
      setCallbacks((prev) => ({
        ...prev,
        [drawerId]: drawerCallbacks || {},
      }));
      setDrawerPlacements((prev) => ({
        ...prev,
        [drawerId]: placement,
      }));

      setDrawerStates((prev) => {
        return {
          ...prev,
          [drawerId]: initialState,
        };
      });
    },
    [],
  );

  const getDrawerPlacement = useCallback(
    (drawerId: Key) => {
      return drawerPlacements[drawerId];
    },
    [drawerPlacements],
  );

  const isDrawerVisible = useCallback(
    (drawerId: Key) => {
      const state = drawerStates[drawerId];
      return state ? state.isOpen : false;
    },
    [drawerStates],
  );

  const contextValue = useMemo<DrawerLayoutContextValue>(
    () => ({
      drawerStates,
      drawerPlacements,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      setDrawerSize,
      setDrawerMode,
      getDrawerState,
      registerDrawer,
      getDrawerPlacement,
      isDrawerVisible,
      selectedMenuItemId,
      selectMenuItem,
      showSelected,
    }),
    [
      drawerStates,
      drawerPlacements,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      setDrawerSize,
      setDrawerMode,
      getDrawerState,
      registerDrawer,
      getDrawerPlacement,
      isDrawerVisible,
      selectedMenuItemId,
      selectMenuItem,
      showSelected,
    ],
  );

  return contextValue;
}

export { DrawerLayoutContext, DrawerContext };
