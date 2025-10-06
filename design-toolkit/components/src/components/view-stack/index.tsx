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

import 'client-only';
import { Broadcast } from '@accelint/bus';
import { useEmit, useOn } from '@accelint/bus/react';
import { isUUID, type UniqueId } from '@accelint/core';
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable } from 'react-aria-components';
import { ViewStackEventTypes } from './events';
import type {
  ViewStackBackEvent,
  ViewStackClearEvent,
  ViewStackContextValue,
  ViewStackEvent,
  ViewStackProps,
  ViewStackPushEvent,
  ViewStackResetEvent,
  ViewStackTriggerProps,
  ViewStackViewProps,
} from './types';

const bus = Broadcast.getInstance<ViewStackEvent>();

export const ViewStackContext = createContext<ViewStackContextValue>({
  parent: null,
  stack: [],
  view: null,
  register: () => undefined,
  unregister: () => undefined,
});

export const ViewStackEventHandlers = {
  back: (stack: UniqueId) => bus.emit(ViewStackEventTypes.back, { stack }),
  clear: (stack: UniqueId) => bus.emit(ViewStackEventTypes.clear, { stack }),
  push: (view: UniqueId) => bus.emit(ViewStackEventTypes.push, { view }),
  reset: (stack: UniqueId) => bus.emit(ViewStackEventTypes.reset, { stack }),
} as const;

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

function ViewStackTrigger({ children, for: types }: ViewStackTriggerProps) {
  const { parent } = useContext(ViewStackContext);
  const viewStackEmit = useViewStackEmit();

  function handlePress() {
    for (const type of Array.isArray(types) ? types : [types]) {
      let [event, id] = (isUUID(type) ? ['push', type] : type.split(':')) as [
        'back' | 'clear' | 'reset' | 'push',
        UniqueId | undefined | null,
      ];

      id ??= parent;

      if (!id) {
        continue;
      }

      viewStackEmit[event](id);
    }
  }

  return <Pressable onPress={handlePress}>{children}</Pressable>;
}
ViewStackTrigger.displayName = 'ViewStack.Trigger';

function ViewStackView({ id, children }: ViewStackViewProps) {
  const { parent, view, register, unregister } = useContext(ViewStackContext);

  if (!parent) {
    throw new Error('ViewStack.View must be implemented within a ViewStack');
  }

  if (!isUUID(id)) {
    throw new Error(`ViewStack.View's id must be a UniqueId`);
  }

  useEffect(() => {
    register(id);

    return () => unregister(id);
  }, [register, unregister, id]);

  return view === id ? <Fragment key={id}>{children}</Fragment> : null;
}
ViewStackView.displayName = 'ViewStack.View';

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
ViewStack.displayName = 'ViewStack';
ViewStack.View = ViewStackView;
ViewStack.Trigger = ViewStackTrigger;
