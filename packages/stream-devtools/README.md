<!-- Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

# @accelint/stream-devtools

**A Streams tab for TanStack Devtools.** Shows every `@accelint/stream`
connection live — status, observer count, message log, lifecycle timeline —
with Reconnect / Close / Clear All / Simulate-Error / Inject-Message
actions. Built with `@tanstack/devtools-ui`, so it reads as a native
sibling of TanStack's own panels (chip styling mirrors React Query
devtools, including the compact dot+count collapse at narrow widths).

SolidJS is fully bundled (the `@tanstack/query-devtools` approach): host
apps never install Solid. The only peer is `@accelint/stream`.

## Usage — TanStack Devtools shell

The `StreamClient` is injected explicitly (the panel cannot read a host
app's React context):

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools';
import { createStreamDevtoolsPlugin } from '@accelint/stream-devtools';
import { streamClient } from './stream-client';

<TanStackDevtools
  plugins={[createStreamDevtoolsPlugin({ client: streamClient })]}
/>;
```

The store attaches to the client's `StreamCache` eagerly, so lifecycle
timelines cover the whole app session — not just while the panel is open.

## Usage — standalone (no shell)

```ts
import { mountStreamDevtools } from '@accelint/stream-devtools';

const unmount = mountStreamDevtools(document.getElementById('panel'), {
  client: streamClient,
});
```

Returns a cleanup that unmounts the panel and detaches from the cache.

## What the panel shows

- **Transport tabs** (SSE / WebSockets) with per-status count chips and a
  trailing messages-per-second rate.
- **Stream list**: status-colored observer badge, stream key, total message
  count, last-update time.
- **Detail pane** per selected stream: status card, actions row (with
  transport-dependent actions disabled until a stream has connected),
  lifecycle timeline (`added`, `recreated`, `statusChanged from → to`,
  observer changes), message log (sequence numbers, duplicate markers,
  expandable JSON payloads), and a data explorer for the latest payload.

## Architecture notes

- Observes only public `StreamCache.subscribe()` events plus each stream's
  own message history (the store ratchets `messageHistory` to 50 on every
  stream it sees) — `@accelint/stream` has no knowledge of the devtools.
- Panel → app commands are direct in-process calls, deliberately **not**
  on the TanStack devtools event bus: the bus broadcasts to all same-origin
  tabs, which caused cross-tab state clobbering. This is the React Query
  devtools architecture.
- Inject-Message feeds panel-validated JSON through the real transport
  message path — indistinguishable from a server message. Treat it as
  destructive in apps whose observers trigger side effects.
