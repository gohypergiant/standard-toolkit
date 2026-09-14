'use client';

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

import * as devtools from './panel';
import * as plugin from './plugin';

// self-contained: the check must not depend on @types/node being in scope,
// and consumer bundlers (Next, Vite) inline NODE_ENV so the losing branch
// dead-code-eliminates
// biome-ignore lint/style/useNamingConvention: must match the runtime global
declare const process: { env: { NODE_ENV?: string } };

// dev-only (TanStack convention) — ./react/production opts out
export const StreamDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? devtools.StreamDevtoolsPanelNoOp
    : devtools.StreamDevtoolsPanel;

export const streamDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.streamDevtoolsNoOpPlugin
    : plugin.streamDevtoolsPlugin;

export type {
  StreamDevtoolsActions,
  StreamDevtoolsLifecycleEvent,
  StreamDevtoolsMessageEntry,
  StreamDevtoolsShellProps,
  StreamDevtoolsState,
  StreamDevtoolsStore,
  StreamDevtoolsStreamEntry,
} from '../types';
export type { StreamDevtoolsReactInit } from './panel';
