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

import type { UniqueId } from '@accelint/core';
import Cancel from '@accelint/icons/cancel';
import 'client-only';
import { useContext } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewStackContext } from '../view-stack/context';
import { DrawerTrigger } from './trigger';
import type { DrawerCloseProps, SimpleEvents, TargetedEvents } from './types';

export function DrawerClose(props: DrawerCloseProps) {
  const context = useContext(ViewStackContext);
  const id: UniqueId | null = props.for ?? context.parent ?? null;

  const event = id
    ? (`close:${id}` as TargetedEvents)
    : ('close' as SimpleEvents);

  console.log(event);

  return (
    // Note, not using ...rest due to possible memory leak within <Pressable />
    // Still investigating.
    <DrawerTrigger aria-label={props['aria-label']} for={event}>
      <Button variant='icon'>
        <Icon>
          <Cancel />
        </Icon>
      </Button>
    </DrawerTrigger>
  );
}
DrawerClose.displayName = 'DrawerClose';
