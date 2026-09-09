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

/** @jsxImportSource react */

import { StreamClientContext } from '@accelint/stream/react';
import { createReactPlugin } from '@tanstack/devtools-utils/react';
import { useContext, useMemo } from 'react';
import { createStreamDevtoolsStore } from '../store';
import { StreamDevtoolsPanel } from './panel';
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react';
import type { StreamClient } from '@accelint/stream';
import type { StreamDevtoolsStore } from '../types';

// one store per client, for the client's lifetime — panel remounts and
// closed-panel gaps reuse it (WeakMap keeps creation idempotent)
const stores = new WeakMap<StreamClient, StreamDevtoolsStore>();

function getOrCreateStore(client: StreamClient): StreamDevtoolsStore {
  let store = stores.get(client);
  if (store === undefined) {
    store = createStreamDevtoolsStore(client);
    stores.set(client, store);
  }
  return store;
}

const MISSING_PROVIDER_STYLE = {
  font: '13px ui-sans-serif, system-ui, sans-serif',
  padding: '16px',
} as const;

/** Resolves the client from `StreamClientProvider` context and injects the store. */
function StreamsPanel(props: DevtoolsPanelProps) {
  const client = useContext(StreamClientContext);

  // memoized element: the upstream panel remounts on props identity, and
  // parent re-renders with unchanged values must not remount it
  const { devtoolsOpen, theme } = props;
  return useMemo(() => {
    if (!client) {
      return (
        <div style={MISSING_PROVIDER_STYLE}>
          No StreamClient in context. Wrap the app (including
          &lt;TanStackDevtools&gt;) in a StreamClientProvider from
          @accelint/stream/react.
        </div>
      );
    }
    const withStore = { devtoolsOpen, theme, store: getOrCreateStore(client) };
    return <StreamDevtoolsPanel {...withStore} />;
  }, [client, devtoolsOpen, theme]);
}

const [plugin, noOpPlugin] = createReactPlugin({
  name: 'Streams',
  id: 'accelint-stream',
  Component: StreamsPanel,
});

/** Streams tab for `@tanstack/react-devtools` — zero-config inside a `StreamClientProvider`. */
export const streamDevtoolsPlugin = plugin();

/** Renders nothing, touches nothing — the `./react` entry outside development. */
export const streamDevtoolsNoOpPlugin = noOpPlugin();
