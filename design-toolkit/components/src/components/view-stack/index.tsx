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

import { useOn } from '@accelint/bus/react';
import { isUUID, type UniqueId } from '@accelint/core';
import 'client-only';
import { useCallback, useRef, useState } from 'react';
import { ViewStackContext } from './context';
import { ViewStackEventTypes } from './events';
import type {
  ViewStackBackEvent,
  ViewStackClearEvent,
  ViewStackProps,
  ViewStackPushEvent,
  ViewStackResetEvent,
} from './types';

/**
 * ViewStack - Stack-based view manager for pushing/popping views
 *
 * Manages a stack of views that can be pushed, popped, or reset programmatically
 * and is intended for building nested or stacked UIs such as Drawer views.
 *
 * @example
 * const ids = {
 *   stack: uuid(),
 *   a: uuid(),
 *   b: uuid(),
 * };
 *
 * <ViewStack id={ids.stack} defaultView={ids.a}>
 *   <ViewStackView id={ids.a}>
 *     <ViewStackTrigger for={ids.b}>
 *       <Button>
 *         Push View B
 *       </Button>
 *     </ViewStackTrigger>
 *     <h1>View A</h1>
 *   </ViewStackView>
 *   <ViewStackView id={ids.b}>
 *     <ViewStackTrigger for='back'>
 *       <Button variant='icon'>
 *         <Icon>
 *           <ChevronLeft />
 *         </Icon>
 *       </Button>
 *     </ViewStackTrigger>
 *     <h1>View B</h1>
 *   </ViewStackView>
 * </ViewStack>
 */
export function ViewStack({
  id,
  children,
  defaultView,
  onChange,
}: ViewStackProps) {
  if (!isUUID(id)) {
    throw new Error(`ViewStack's id must be a UniqueId`);
  }

  const views = useRef(new Set<UniqueId>());
  const [stack, setStack] = useState<UniqueId[]>(
    defaultView ? [defaultView] : [],
  );
  const view = stack.at(-1) ?? null;

  const handleBack = useCallback(
    (data: ViewStackBackEvent) => {
      if (id === data?.payload?.stack) {
        const next = stack.slice(0, -1);

        if (!next.length && defaultView) {
          next.push(defaultView);
        }

        setStack(next);
        onChange?.(next.at(-1) ?? null);
      }
    },
    [id, defaultView, onChange, stack],
  );

  const handleClear = useCallback(
    (data: ViewStackClearEvent) => {
      if (id === data?.payload?.stack) {
        setStack([]);
        onChange?.(null);
      }
    },
    [id, onChange],
  );

  const handlePush = useCallback(
    (data: ViewStackPushEvent) => {
      if (views.current.has(data?.payload?.view)) {
        setStack((prev) => [...prev, data?.payload?.view]);
        onChange?.(data?.payload?.view);
      }
    },
    [onChange],
  );

  const handleReset = useCallback(
    (data: ViewStackResetEvent) => {
      if (id === data?.payload?.stack) {
        setStack(defaultView ? [defaultView] : []);
        onChange?.(defaultView ?? null);
      }
    },
    [id, defaultView, onChange],
  );
  useOn(ViewStackEventTypes.back, handleBack);
  useOn(ViewStackEventTypes.clear, handleClear);
  useOn(ViewStackEventTypes.push, handlePush);
  useOn(ViewStackEventTypes.reset, handleReset);

  return (
    <ViewStackContext.Provider
      value={{
        parent: id,
        stack,
        view,
        register: (view: UniqueId) => views.current.add(view),
        unregister: (view: UniqueId) => views.current.delete(view),
      }}
    >
      {children}
    </ViewStackContext.Provider>
  );
}
