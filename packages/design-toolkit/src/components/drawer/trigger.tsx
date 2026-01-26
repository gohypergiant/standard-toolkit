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

import { isUUID, type UniqueId } from '@accelint/core';
import { Pressable } from '@react-aria/interactions';
import 'client-only';
import { useContext } from 'react';
import { ViewStackContext } from '../view-stack/context';
import { useDrawerEmit } from './context';
import type { DrawerTriggerProps } from './types';

/**
 * DrawerTrigger - Programmatic trigger for drawer actions.
 *
 * The `for` prop controls the behavior:
 * - `'open'`, `'toggle'`, `'close'`: Control drawer open state
 * - `'back'`: Pop the current view from the stack
 * - `UniqueId`: Push a specific view onto the stack
 * - `'action:viewId'`: Combine action with view ID (e.g., `'open:${viewId}'`)
 * - `Array`: Fire multiple events in sequence
 *
 * @param props - {@link DrawerTriggerProps}
 * @param props.for - The event(s) to fire when the trigger is pressed.
 * @returns The rendered DrawerTrigger component.
 *
 * @example
 * <DrawerTrigger for="close">
 *   <Button>Close</Button>
 * </DrawerTrigger>
 *
 * @example
 * <DrawerTrigger for={`open:${viewId}`}>
 *   <Button>Open Settings</Button>
 * </DrawerTrigger>
 */
export function DrawerTrigger({ for: events, ...rest }: DrawerTriggerProps) {
  const { parent } = useContext(ViewStackContext);
  const drawerEmit = useDrawerEmit();

  function handlePress() {
    for (const type of Array.isArray(events) ? events : [events]) {
      let [event, id] = (isUUID(type) ? ['push', type] : type.split(':')) as [
        'back' | 'clear' | 'close' | 'open' | 'push' | 'reset' | 'toggle',
        UniqueId | undefined | null,
      ];

      id ??= parent;

      if (!id) {
        continue;
      }

      drawerEmit[event](id);
    }
  }

  return <Pressable {...rest} onPress={handlePress} />;
}
