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

import { createSolidPlugin } from '@tanstack/devtools-utils/solid';
import { StreamDevtoolsPanel } from './components/panel';
import { createStreamDevtoolsStore } from './store';
import type { StreamClient } from '@accelint/stream';

export type StreamDevtoolsPluginOptions = {
  /**
   * The app's StreamClient — injected explicitly (a Solid panel cannot read
   * the host app's React context).
   */
  client: StreamClient;
  /** Tab label in the TanStack Devtools shell. */
  name?: string;
  id?: string;
  defaultOpen?: boolean;
};

/**
 * Streams tab for TanStack Devtools. Framework-agnostic: the returned
 * plugin mounts a Solid panel into the shell's element, so it works in a
 * React (or any other) host app — exactly how TanStack's own panels ship.
 *
 * The store is created eagerly so lifecycle timelines cover the whole app
 * session, not just while the panel is open.
 *
 * @example
 * <TanStackDevtools plugins={[createStreamDevtoolsPlugin({ client })]} />
 */
export function createStreamDevtoolsPlugin({
  client,
  name = 'Streams',
  id = 'accelint-stream',
  defaultOpen,
}: StreamDevtoolsPluginOptions) {
  const store = createStreamDevtoolsStore(client);

  const [plugin] = createSolidPlugin({
    name,
    id,
    defaultOpen,
    Component: () => <StreamDevtoolsPanel store={store} />,
  });

  return plugin();
}
