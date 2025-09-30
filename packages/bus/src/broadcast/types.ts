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

import type { UniqueId } from '@accelint/core';

/** Broadcast configuration type. */
export type BroadcastConfig = {
  channelName: string;
  debug?: boolean;
};

/** Listener object type. */
export type Listener<P extends { type: string; payload?: unknown } = Payload> =
  {
    id: UniqueId;
    once?: boolean;
    callback: (data: P) => void;
  };

/** Listener callback payload type. */
export type Payload<
  T extends string = string,
  P = undefined,
> = P extends undefined
  ? {
      type: T;
      target?: UniqueId;
    }
  : {
      type: T;
      target?: UniqueId;
      payload: P;
    };

export type ExtractEvent<
  // biome-ignore lint/suspicious/noExplicitAny: proper use of `any`
  P extends { type: string; payload?: unknown } = Payload<string, any>,
  T extends P['type'] = P['type'],
> = {
  [K in P['type']]: Extract<P, { type: K }>;
}[T];

export type EmitOptions = {
  target?: 'all' | 'others' | 'self' | UniqueId;
};
