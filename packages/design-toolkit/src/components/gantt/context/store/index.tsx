/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';
import {
  createGanttStore,
  type GanttState,
  type GanttStore,
  type GanttStoreProps,
} from '../../store';

export const GanttStoreContext = createContext<GanttStore | null>(null);

export function GanttStoreProvider({
  children,
  startTimeMs,
}: PropsWithChildren<GanttStoreProps>) {
  const [store] = useState(() => createGanttStore({ startTimeMs }));

  // Sync store when startTimeMs prop changes after initial mount
  useEffect(() => {
    store.getState().setCurrentPositionMs(startTimeMs);
  }, [store, startTimeMs]);

  return (
    <GanttStoreContext.Provider value={store}>
      {children}
    </GanttStoreContext.Provider>
  );
}

function useGanttStoreBase() {
  const store = useContext(GanttStoreContext);

  if (!store) {
    throw new Error(
      'useGanttStoreBase must be used within a GanttStoreProvider',
    );
  }

  return store;
}

export function useGanttStore<T>(selector: (state: GanttState) => T): T {
  const store = useGanttStoreBase();

  return useStore(store, selector);
}

export function useGanttStoreApi() {
  return useGanttStoreBase() satisfies GanttStore;
}
