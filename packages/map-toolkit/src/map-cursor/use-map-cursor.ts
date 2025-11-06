import { useContext, useMemo, useSyncExternalStore } from 'react';
import { MapContext } from '../deckgl/base-map/provider';
import { getStore } from './store';
import type { UniqueId } from '@accelint/core';

/**
 * Return value for the useMapCursor hook
 */
export type UseMapCursorReturn = {
  /** The current active map cursor */
  cursor: string;
  /** Function to request a cursor change with ownership */
  requestCursorChange: (desiredCursor: string, requestOwner: string) => void;
};

export function useMapCursor(id?: UniqueId): UseMapCursorReturn {
  const contextId = useContext(MapContext);
  const actualId = id ?? contextId;

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
  const cursor = useSyncExternalStore(store.subscribe, store.getSnapshot);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      cursor,
      requestCursorChange: store.requestCursorChange,
    }),
    [cursor, store],
  );
}
