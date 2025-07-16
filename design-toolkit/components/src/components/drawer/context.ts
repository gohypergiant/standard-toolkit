import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  DrawerAnchor,
  DrawerContextValue,
  DrawerId,
  DrawerLayoutContextValue,
  DrawerMode,
  DrawerStateOption,
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
  const [drawerAnchors, setDrawerAnchors] = useState<
    Record<DrawerId, DrawerAnchor>
  >({});

  const toggleDrawer = useCallback((drawerId: DrawerId) => {
    setDrawerStates((prev) => {
      const [mode, currentState] = (
        prev[drawerId] || DEFAULT_STATE_OPTION
      ).split('-');

      const newStateOption = [
        mode,
        currentState === OPEN_STATE ? CLOSE_STATE : OPEN_STATE,
      ].join('-') as DrawerStateOption;

      return {
        ...prev,
        [drawerId]: newStateOption,
      };
    });
  }, []);

  const openDrawer = useCallback((drawerId: DrawerId) => {
    setDrawerStates((prev) => {
      const [mode] = (prev[drawerId] || DEFAULT_STATE_OPTION).split('-');

      return {
        ...prev,
        [drawerId]: `${mode}-open` as DrawerStateOption,
      };
    });
  }, []);

  const closeDrawer = useCallback((drawerId: DrawerId) => {
    setDrawerStates((prev) => {
      const [mode] = (prev[drawerId] || DEFAULT_STATE_OPTION).split('-');

      return {
        ...prev,
        [drawerId]: `${mode}-${CLOSE_STATE}` as DrawerStateOption,
      };
    });
  }, []);

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
      anchor: DrawerAnchor,
      isOpen: boolean,
      mode: DrawerMode,
    ) => {
      setDrawerAnchors((prev) => ({
        ...prev,
        [drawerId]: anchor,
      }));

      setDrawerStates((prev) => {
        if (!prev[drawerId]) {
          return {
            ...prev,
            [drawerId]: `${mode || 'over'}-${isOpen ? OPEN_STATE : CLOSE_STATE}`,
          };
        }
        return prev;
      });
    },
    [],
  );

  const getDrawerAnchor = useCallback(
    (drawerId: DrawerId) => {
      return drawerAnchors[drawerId];
    },
    [drawerAnchors],
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
      getDrawerAnchor,
    }),
    [
      drawerStates,
      toggleDrawer,
      openDrawer,
      closeDrawer,
      setDrawerState,
      getDrawerState,
      registerDrawer,
      getDrawerAnchor,
    ],
  );

  return contextValue;
}

export { DrawerLayoutContext, DrawerContext };
