import { useContext, useMemo, useSyncExternalStore } from 'react';
import { getStore } from '../store';
import { MapIdContext } from './provider';
import type { UniqueId } from '@accelint/core';

/**
 * Return value for the useMapMode hook
 */
export type UseMapCursorReturn = {
  /** The current active map mode */
  cursors: [];
  /** Function to request a mode change with ownership */
  requestCursorChange: (desiredMode: string, requestOwner: string) => void;
};

export function useMapMode(mapInstanceId?: UniqueId): UseMapCursorReturn {
  const contextId = useContext(MapIdContext);
  const actualId = mapInstanceId ?? contextId;

  if (!actualId) {
    throw new Error(
      'useMapCursor requires either a mapInstanceId parameter or to be used within a MapIdProvider',
    );
  }

  // Get the store for this map instance
  const store = getStore(actualId);

  if (!store) {
    throw new Error(
      `MapCursorStore not found for instance: ${actualId}. Ensure a store has been created for this map instance (e.g., via MapIdProvider or getOrCreateStore).`,
    );
  }

  // Subscribe to store using useSyncExternalStore
  const cursors = useSyncExternalStore(store.subscribe, store.getSnapshot);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      cursors,
      requestCursorChange: store.requestCursorChange,
    }),
    [cursors, store],
  );
}
