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
import { Cancel } from '@accelint/icons';
import 'client-only';
import { Button } from '../button';
import { Icon } from '../icon';
import { DrawerTrigger } from './trigger';

export type DrawerCloseProps = {
  id?: UniqueId;
};

export function DrawerClose({ id }: DrawerCloseProps) {
  // Only emit onClose event if we have a specified ID.
  // Otherwise, we reset the view stack.
  return (
    <DrawerTrigger for={id ? `close:${id}` : 'reset'}>
      <Button variant='icon'>
        <Icon>
          <Cancel />
        </Icon>
      </Button>
    </DrawerTrigger>
  );
}
