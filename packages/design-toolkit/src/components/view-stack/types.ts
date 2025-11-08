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

import type { Payload } from '@accelint/bus';
import type { UniqueId } from '@accelint/core';
import type { ComponentProps, PropsWithChildren, RefAttributes } from 'react';
import type { Pressable } from 'react-aria-components';
import type { ViewStackEventTypes } from './events';

export type ViewStackProps = RefAttributes<HTMLDivElement> &
  PropsWithChildren<{
    id: UniqueId;
    defaultView?: UniqueId;
    onChange?: (view: UniqueId | null) => void;
  }>;

export type ViewStackViewProps = RefAttributes<HTMLDivElement> &
  PropsWithChildren<{
    id: UniqueId;
  }>;

export type ViewStackBackEvent = Payload<
  typeof ViewStackEventTypes.back,
  { stack: UniqueId }
>;

export type ViewStackClearEvent = Payload<
  typeof ViewStackEventTypes.clear,
  { stack: UniqueId }
>;

export type ViewStackResetEvent = Payload<
  typeof ViewStackEventTypes.reset,
  { stack: UniqueId }
>;

export type ViewStackPushEvent = Payload<
  typeof ViewStackEventTypes.push,
  { view: UniqueId }
>;

export type ViewStackEvent =
  | ViewStackBackEvent
  | ViewStackClearEvent
  | ViewStackResetEvent
  | ViewStackPushEvent;

type SimpleEvents = 'back' | 'clear' | 'reset' | UniqueId;

type TargetedEvents =
  | `back:${UniqueId}`
  | `clear:${UniqueId}`
  | `reset:${UniqueId}`;

type ChainedEvents = (SimpleEvents | TargetedEvents)[];

export type ViewStackTriggerProps = {
  children: ComponentProps<typeof Pressable>['children'];
  /**
   * __SimpleEvents__ allow the easiest implementation of events, but come with some restrictions:
   * - The literal commands `back | clear | reset` will only work inside of the context of a ViewStack
   * - When passing a view's UniqueId the behavior is always to push that id onto it's parent's stack
   *
   * __TargetedEvents__ allow for external control of a ViewStack, the UniqueId of a Stack is passed to know which stack to affect
   *
   * __ChainedEvents__ allow a list of events from a single control to enable multiple behaviors
   *
   * @example
   * // Clear a stack and then push a view on:
   * ['clear', myViewId]
   *
   * // Reset multiple stacks:
   * [`reset:${stackOneId}`, `reset:${stackTwoId}`]
   *
   * // Hydrate a stack with multiple views:
   * [viewOneId, viewTwoId, viewThreeId]
   */
  for: SimpleEvents | TargetedEvents | ChainedEvents;
};

export type ViewStackContextValue = {
  parent: UniqueId | null;
  stack: string[];
  view: UniqueId | null;
  register: (view: UniqueId) => void;
  unregister: (view: UniqueId) => void;
};
