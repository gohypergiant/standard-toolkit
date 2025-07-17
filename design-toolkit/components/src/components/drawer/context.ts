import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  DrawerContextValue,
  DrawerId,
  DrawerLayoutContextValue,
  DrawerMode,
  DrawerPlacement,
  DrawerStateOption,
  OnOpenChangeCallback,
} from './types';

const OPEN_STATE = 'open';
const CLOSE_STATE = 'closed';
const DEFAULT_STATE_OPTION = 'over-closed';
const DrawerLayoutContext = createContext<DrawerLayoutContextValue | null>(
  null,
);
const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);

  if (!ctx) {
    throw new Error(
      'useDrawerContext must be used within a Drawer.Root component',
    );
  }

  return ctx;
}

export function useDrawerLayoutContext(): DrawerLayoutContextValue {
  const ctx = useContext(DrawerLayoutContext);

  if (!ctx) {
    throw new Error(
      'useDrawerLayoutContext must be used within a Drawer.Root component',
    );
  }

  return ctx;
}

export function useDrawerLayoutState() {
  const [drawerStates, setDrawerStates] = useState<
    Record<DrawerId, DrawerStateOption>
  >({});
  const [drawerPlacements, setDrawerPlacements] = useState<
    Record<DrawerId, DrawerPlacement>
  >({});
  const [selectedMenuItem, setSelectedMenuItem] = useState<
    string | undefined
  >();
  const [callbacks, setCallbacks] = useState<
    Record<string, OnOpenChangeCallback>
  >({});

  const selectMenuItem = useCallback((menuItemId: string) => {
    setSelectedMenuItem(menuItemId);
  }, []);

  const toggleDrawer = useCallback((drawerId: DrawerId) => {
    setDrawerStates((prev) => {
      const [mode, currentState] = (
        prev[drawerId] || DEFAULT_STATE_OPTION
      ).split('-');

      const newStateOption = [
        mode,
        currentState === OPEN_STATE ? CLOSE_STATE : OPEN_STATE,
      ].join('-') as DrawerStateOption;

      notifyOpenChange(drawerId, newStateOption);

      return {
        ...prev,
        [drawerId]: newStateOption,
      };
    });
  }, []);

  const notifyOpenChange = useCallback(
    (drawerId: string, nextState: DrawerStateOption) => {
      callbacks[drawerId]?.(nextState.includes('open'));
    },
    [callbacks],
  );

  const openDrawer = useCallback(
    (drawerId: DrawerId) => {
      setDrawerStates((prev) => {
        const [mode] = (prev[drawerId] || DEFAULT_STATE_OPTION).split('-');
        const nextState = `${mode}-open` as DrawerStateOption;

        notifyOpenChange(drawerId, nextState);

        return {
          ...prev,
          [drawerId]: nextState,
        };
      });
    },
    [notifyOpenChange],
  );

  const closeDrawer = useCallback(
    (drawerId: DrawerId) => {
      setDrawerStates((prev) => {
        const [mode] = (prev[drawerId] || DEFAULT_STATE_OPTION).split('-');
        const nextState = `${mode}-${CLOSE_STATE}` as DrawerStateOption;

        notifyOpenChange(drawerId, nextState);

        return {
          ...prev,
          [drawerId]: nextState,
        };
      });
      setSelectedMenuItem('');
    },
    [notifyOpenChange],
  );

  const setDrawerState = useCallback(
    (drawerId: DrawerId, state: DrawerStateOption) => {
      setDrawerStates((prev) => ({
        ...prev,
        [drawerId]: state,
      }));
    },
    [],
  );

  const getDrawerState = useCallback(
    (drawerId: DrawerId): DrawerStateOption => {
      return drawerStates[drawerId] || DEFAULT_STATE_OPTION;
    },
    [drawerStates],
  );

  const registerDrawer = useCallback(
    (
      drawerId: DrawerId,
      placement: DrawerPlacement,
      isOpen: boolean,
      mode: DrawerMode,
      onOpenChange?: (isOpen: boolean) => void,
    ) => {
      setCallbacks((prev) => ({
        ...prev,
        [drawerId]: onOpenChange,
      }));
      setDrawerPlacements((prev) => ({
        ...prev,
        [drawerId]: placement,
      }));

      setDrawerStates((prev) => {
        return {
          ...prev,
          [drawerId]: `${mode || 'over'}-${isOpen ? OPEN_STATE : CLOSE_STATE}`,
        };
      });
    },
    [],
  );

  const getDrawerPlacement = useCallback(
    (drawerId: DrawerId) => {
      return drawerPlacements[drawerId];
    },
    [drawerPlacements],
  );

  const isDrawerVisible = useCallback(
    (drawerId: string) => {
      return drawerStates[drawerId]?.includes('open') ?? false;
    },
    [drawerStates],
  );

  const contextValue = useMemo<DrawerLayoutContextValue>(
    () => ({
      drawerStates,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      setDrawerState,
      getDrawerState,
      registerDrawer,
      getDrawerPlacement,
      isDrawerVisible,
      selectedMenuItem,
      selectMenuItem,
    }),
    [
      drawerStates,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      setDrawerState,
      getDrawerState,
      registerDrawer,
      getDrawerPlacement,
      isDrawerVisible,
      selectedMenuItem,
      selectMenuItem,
    ],
  );

  return contextValue;
}

export { DrawerLayoutContext, DrawerContext };
