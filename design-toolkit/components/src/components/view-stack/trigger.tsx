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
import { useContext } from 'react';
import { Pressable } from 'react-aria-components';
import { useViewStackEmit, ViewStackContext } from './context';
import type { ViewStackTriggerProps } from './types';

/**
 * ViewStackTrigger - Trigger for ViewStack actions
 *
 * Provides a pressable element that triggers ViewStack actions
 */
export function ViewStackTrigger({
  children,
  for: types,
}: ViewStackTriggerProps) {
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
