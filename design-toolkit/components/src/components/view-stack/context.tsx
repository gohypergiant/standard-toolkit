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
'use client';

import { Broadcast } from '@accelint/bus';
import { useEmit } from '@accelint/bus/react';
import type { UniqueId } from '@accelint/core';
import 'client-only';
import { createContext } from 'react';
import { ViewStackEventTypes } from './events';
import type { ViewStackContextValue, ViewStackEvent } from './types';

const bus = Broadcast.getInstance<ViewStackEvent>();

/**
 * Context for ViewStack component
 */
export const ViewStackContext = createContext<ViewStackContextValue>({
  parent: null,
  stack: [],
  view: null,
  register: () => undefined,
  unregister: () => undefined,
});

/**
 * Event handlers for ViewStack events
 */
export const ViewStackEventHandlers = {
  back: (stack: UniqueId) => bus.emit(ViewStackEventTypes.back, { stack }),
  clear: (stack: UniqueId) => bus.emit(ViewStackEventTypes.clear, { stack }),
  push: (view: UniqueId) => bus.emit(ViewStackEventTypes.push, { view }),
  reset: (stack: UniqueId) => bus.emit(ViewStackEventTypes.reset, { stack }),
} as const;

/**
 * Hook for emitting ViewStack events
 */
export function useViewStackEmit() {
  const emitBack = useEmit<ViewStackEvent>(ViewStackEventTypes.back);
  const emitClear = useEmit<ViewStackEvent>(ViewStackEventTypes.clear);
  const emitPush = useEmit<ViewStackEvent>(ViewStackEventTypes.push);
  const emitReset = useEmit<ViewStackEvent>(ViewStackEventTypes.reset);

  return {
    back: (stack: UniqueId) => emitBack({ stack }),
    clear: (stack: UniqueId) => emitClear({ stack }),
    push: (view: UniqueId) => emitPush({ view }),
    reset: (stack: UniqueId) => emitReset({ stack }),
  } as const;
}
