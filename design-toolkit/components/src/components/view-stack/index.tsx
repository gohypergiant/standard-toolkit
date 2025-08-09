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
import { Broadcast, type Payload } from '@accelint/bus';
import { type UniqueId, isUUID } from '@accelint/core';
import { PressResponder } from '@react-aria/interactions';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Pressable } from 'react-aria-components';
import type {
  ViewStackBackEvent,
  ViewStackClearEvent,
  ViewStackContextValue,
  ViewStackProps,
  ViewStackPushEvent,
  ViewStackResetEvent,
  ViewStackTriggerProps,
  ViewStackViewProps,
} from './types';

const bus = Broadcast.getInstance();
const ViewStackEventNamespace = 'ViewStack';

export const ViewStackContext = createContext<ViewStackContextValue>({
  parent: null,
  stack: [],
  view: null,
  register: () => undefined,
  unregister: () => undefined,
});

export const ViewStackEventTypes = {
  back: `${ViewStackEventNamespace}:back`,
  clear: `${ViewStackEventNamespace}:clear`,
  reset: `${ViewStackEventNamespace}:reset`,
  push: `${ViewStackEventNamespace}:push`,
} as const;

function ViewStackTrigger({ children, for: types }: ViewStackTriggerProps) {
  const { parent } = useContext(ViewStackContext);

  function handlePress() {
    for (const type of Array.isArray(types) ? types : [types]) {
      if (isUUID(type)) {
        bus.emit<ViewStackPushEvent>(ViewStackEventTypes.push, {
          view: type,
        });
      } else {
        let [event, stack] = type.split(':') as [
          'back' | 'clear' | 'reset',
          UniqueId | undefined | null,
        ];

        stack ??= parent;

        if (!stack) {
          continue;
        }

        bus.emit<
          ViewStackBackEvent | ViewStackClearEvent | ViewStackResetEvent
        >(ViewStackEventTypes[event], { stack });
      }
    }
  }

  return (
    <PressResponder onPress={handlePress}>
      <Pressable>{children}</Pressable>
    </PressResponder>
  );
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

    () => unregister(id);
  }, [register, unregister, id]);

  return view === id ? children : null;
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
    (data: Payload<ViewStackBackEvent>) => {
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
    (data: Payload<ViewStackClearEvent>) => {
      if (id === data?.payload?.stack) {
        setStack([]);
        onChange?.(null);
      }
    },
    [id, onChange],
  );

  const handleReset = useCallback(
    (data: Payload<ViewStackResetEvent>) => {
      if (id === data?.payload?.stack) {
        setStack(defaultView ? [defaultView] : []);
        onChange?.(defaultView ?? null);
      }
    },
    [id, defaultView, onChange],
  );

  const handlePush = useCallback(
    (data: Payload<ViewStackPushEvent>) => {
      if (views.current.has(data?.payload?.view)) {
        setStack((prev) => [...prev, data?.payload?.view]);
        onChange?.(data?.payload?.view);
      }
    },
    [onChange],
  );

  useEffect(() => {
    const listeners = [
      bus.on(ViewStackEventTypes.back, handleBack),
      bus.on(ViewStackEventTypes.clear, handleClear),
      bus.on(ViewStackEventTypes.reset, handleReset),
      bus.on(ViewStackEventTypes.push, handlePush),
    ];

    return () => {
      for (const off of listeners) {
        off();
      }
    };
  }, [handleBack, handleClear, handleReset, handlePush]);

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
