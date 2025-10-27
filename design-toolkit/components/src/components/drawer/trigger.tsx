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
import { isUUID, type UniqueId } from '@accelint/core';
import { Cancel, ChevronLeft } from '@accelint/icons';
import { Pressable } from '@react-aria/interactions';
import { useContext } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewStackContext } from '../view-stack';
import { useDrawerEmit } from './context';
import type { DrawerTriggerProps } from './types';

export function DrawerTrigger({ children, for: events }: DrawerTriggerProps) {
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

  return <Pressable onPress={handlePress}>{children}</Pressable>;
}

export function DrawerClose() {
  return (
    <DrawerTrigger for='close'>
      <Button variant='icon'>
        <Icon>
          <Cancel />
        </Icon>
      </Button>
    </DrawerTrigger>
  );
}

export function DrawerBack() {
  const { stack } = useContext(ViewStackContext);
  return stack.length > 1 ? (
    <DrawerTrigger for='back'>
      <Button variant='icon'>
        <Icon>
          <ChevronLeft />
        </Icon>
      </Button>
    </DrawerTrigger>
  ) : null;
}
