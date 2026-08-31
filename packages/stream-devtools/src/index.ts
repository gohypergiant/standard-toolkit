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

import * as core from './core';

// self-contained: the check must not depend on @types/node being in scope,
// and consumer bundlers (Next, Vite) inline NODE_ENV so the losing branch
// dead-code-eliminates
// biome-ignore lint/style/useNamingConvention: must match the runtime global
declare const process: { env: { NODE_ENV?: string } };

// dev-only (TanStack convention) — ./production opts out; React hosts
// want ./react, other hosts mount this with a createStreamDevtoolsStore
export const StreamDevtoolsCore =
  process.env.NODE_ENV !== 'development'
    ? core.StreamDevtoolsCoreNoOp
    : core.StreamDevtoolsCore;

export { createStreamDevtoolsStore } from './store';
export type {
  StreamDevtoolsActions,
  StreamDevtoolsLifecycleEvent,
  StreamDevtoolsMessageEntry,
  StreamDevtoolsMountProps,
  StreamDevtoolsShellProps,
  StreamDevtoolsState,
  StreamDevtoolsStore,
  StreamDevtoolsStreamEntry,
} from './types';
