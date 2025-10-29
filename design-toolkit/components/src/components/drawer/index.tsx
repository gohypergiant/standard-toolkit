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
import type { UniqueId } from '@accelint/core';
import 'client-only';
import { useCallback, useRef, useState } from 'react';
import { ViewStack } from '../view-stack';
import { useViewStackEmit } from '../view-stack/context';
import { DrawerContext } from './context';
import { DrawerEventTypes } from './events';
import { DrawerStyles } from './styles';
import type { DrawerOpenEvent, DrawerProps, DrawerToggleEvent } from './types';

const { drawer } = DrawerStyles();

/**
 * Drawer - Slide-in panel for navigation or contextual content
 *
 * A flexible panel that slides in from the viewport edge and supports
 * stacked views, headers, footers, and programmatic triggers.
 *
 * @example
 * const ids = { drawer: uuid(), a: uuid() };
 *
 * <DrawerLayout push="left">
 *   <DrawerLayoutMain>
 *     <DrawerTrigger for={`open:${ids.a}`}>
 *       <Button variant="icon">Open</Button>
 *     </DrawerTrigger>
 *   </DrawerLayoutMain>
 *
 *   <Drawer id={ids.drawer} defaultView={ids.a}>
 *     <DrawerPanel>
 *       <DrawerView id={ids.a}>
 *         <DrawerHeader title="Title A" />
 *         <DrawerContent>Content for View A</DrawerContent>
 *       </DrawerView>
 *     </DrawerPanel>
 *   </Drawer>
 * </DrawerLayout>
 */
export function Drawer({
  id,
  children,
  className,
  defaultView,
  placement = 'left',
  size = 'medium',
  onChange,
  ...rest
}: DrawerProps) {
  const views = useRef(new Set<UniqueId>());
  const [activeView, setActiveView] = useState<UniqueId | null>(
    defaultView || null,
  );

  const viewStackEmit = useViewStackEmit();

  const handleOpen = useCallback(
    (data: DrawerOpenEvent) => {
      if (views.current.has(data?.payload?.view)) {
        viewStackEmit.clear(id);
        viewStackEmit.push(data.payload.view);
      }
    },
    [id, viewStackEmit.clear, viewStackEmit.push],
  );
  const handleToggle = useCallback(
    (data: DrawerToggleEvent) => {
      if (views.current.has(data?.payload?.view)) {
        viewStackEmit.clear(id);
        if (activeView !== data?.payload?.view) {
          viewStackEmit.push(data.payload.view);
        }
      }
    },
    [id, activeView, viewStackEmit.clear, viewStackEmit.push],
  );

  useOn(DrawerEventTypes.open, handleOpen);
  useOn(DrawerEventTypes.toggle, handleToggle);

  return (
    <DrawerContext.Provider
      value={{
        register: (view: UniqueId) => views.current.add(view),
        unregister: (view: UniqueId) => views.current.delete(view),
        placement,
      }}
    >
      <ViewStack
        id={id}
        defaultView={defaultView}
        onChange={(view) => {
          setActiveView(view);
          onChange?.(view);
        }}
      >
        <div
          {...rest}
          className={drawer({ className })}
          data-open={!!activeView || null}
          data-placement={placement}
          data-size={size}
        >
          {children}
        </div>
      </ViewStack>
    </DrawerContext.Provider>
  );
}
