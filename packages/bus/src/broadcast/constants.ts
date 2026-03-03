// __private-exports
/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import type { BroadcastConfig, EmitTarget } from './types';

/** The default broadcast configuration */
export const DEFAULT_CONFIG: BroadcastConfig = {
  channelName: '@accelint/bus',
  // TODO: implement logger
  debug: false,
};

/** The default event target when emitting */
export const DEFAULT_TARGET: EmitTarget = 'self';

/**
 * These connection events are used to determine which bus instances are connected
 *
 * None of these events have a payload, linking is handled entirely through
 * source / target metadata available on every event
 */
export const CONNECTION_EVENT_TYPES = {
  echo: '__ECHO__',
  ping: '__PING__',
  stop: '__STOP__',
} as const;
