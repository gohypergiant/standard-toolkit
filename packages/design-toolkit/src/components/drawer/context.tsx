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
import {
  useViewStackEmit,
  ViewStackEventHandlers,
} from '../view-stack/context';
import { DrawerEventTypes } from './events';
import type { DrawerContextValue, DrawerEvent } from './types';

/**
 * Context for sharing Drawer state across child components.
 *
 * @example
 * ```tsx
 * const { register, unregister, placement } = useContext(DrawerContext);
 * ```
 */
export const DrawerContext = createContext<DrawerContextValue>({
  register: () => undefined,
  unregister: () => undefined,
  placement: 'left',
});

/**
 * Event bus instance for drawer-related events.
 *
 * @example
 * ```tsx
 * import { bus } from './context';
 * bus.on('Drawer:open', (event) => console.log(event));
 * ```
 */
export const bus = Broadcast.getInstance<DrawerEvent>();

/**
 * Event handlers for controlling drawer state programmatically.
 *
 * @example
 * ```tsx
 * import { DrawerEventHandlers } from './context';
 *
 * DrawerEventHandlers.open(viewId);
 * DrawerEventHandlers.toggle(viewId);
 * DrawerEventHandlers.close(viewId);
 * ```
 */
export const DrawerEventHandlers = {
  ...ViewStackEventHandlers,
  close: (view: UniqueId) => bus.emit(DrawerEventTypes.close, { view }),
  open: (view: UniqueId) => bus.emit(DrawerEventTypes.open, { view }),
  toggle: (view: UniqueId) => bus.emit(DrawerEventTypes.toggle, { view }),
} as const;

/**
 * Hook for emitting drawer events (open, close, toggle, push, pop, clear).
 *
 * @returns Object with methods to emit drawer events.
 *
 * @example
 * ```tsx
 * const emit = useDrawerEmit();
 * emit.open(viewId);
 * emit.toggle(viewId);
 * emit.close();
 * ```
 */
export function useDrawerEmit() {
  const viewStackEmit = useViewStackEmit();
  const emitClose = useEmit<DrawerEvent>(DrawerEventTypes.close);
  const emitOpen = useEmit<DrawerEvent>(DrawerEventTypes.open);
  const emitToggle = useEmit<DrawerEvent>(DrawerEventTypes.toggle);

  return {
    ...viewStackEmit,
    close: (view: UniqueId) => emitClose({ view }),
    open: (view: UniqueId) => emitOpen({ view }),
    toggle: (view: UniqueId) => emitToggle({ view }),
  } as const;
}
