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
import { useEmit } from '@accelint/bus/react';
import { isUUID, type UniqueId } from '@accelint/core';
import { Pressable } from 'react-aria-components';
import { SidenavEventTypes } from './events';
import type { SidenavEvent, SidenavTriggerProps } from './types';

/**
 * SidenavTrigger - Trigger component for sidenav
 *
 * Provides a trigger button to control the sidenav state
 *
 * @example
 * ```tsx
 * <SidenavTrigger for="toggle:sidenav-id">
 *   <Button variant="icon">
 *     <Icon><Menu /></Icon>
 *   </Button>
 * </SidenavTrigger>
 * ```
 *
 * @param props - {@link SidenavTriggerProps}
 * @param props.children - Trigger content (typically a Button with icon).
 * @param props.for - Target sidenav ID or targeted event string.
 * @returns The rendered SidenavTrigger component.
 */
export function SidenavTrigger({
  children,
  for: type,
  ...rest
}: SidenavTriggerProps) {
  const [event, id] = (isUUID(type) ? ['toggle', type] : type.split(':')) as [
    'close' | 'open' | 'toggle',
    UniqueId,
  ];
  const emit = useEmit<SidenavEvent>(SidenavEventTypes[event]);

  return (
    <Pressable {...rest} onPress={() => emit({ id })}>
      {children}
    </Pressable>
  );
}
