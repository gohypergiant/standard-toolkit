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
connection live: status, observer count, message log, and lifecycle
timeline, with Reconnect, Close, Clear All, Simulate-Error, and
Inject-Message actions. The panel is built with `@tanstack/devtools-ui`,
renders in the shell's light or dark theme, and reads as a native sibling
of TanStack's own panels.

SolidJS is fully bundled, so host apps never install Solid. The only
required peer is `@accelint/stream`. `react` is an optional peer, used by
the `./react` entry only.

The package follows the TanStack devtools architecture: the root entry is
the Solid core, and framework adapters live on subpath entries.

| Host | Import from |
| --- | --- |
| `@tanstack/react-devtools` shell, or any React app | `@accelint/stream-devtools/react` |
| Custom wrapper (Solid shell, other frameworks) | `@accelint/stream-devtools` (core class + store factory) |

## Usage: React host

A React shell portals each plugin render's return value as a React
element, so it needs the React adapter. The adapter drives the Solid panel
through a core class with `mount`/`unmount`, the same bridge TanStack's
own panels use.

The adapter is zero-config: the panel resolves the app's `StreamClient`
from `StreamClientProvider` context, the same way React Query's devtools
resolve their client. `<TanStackDevtools>` must sit inside the provider.
The shell portals plugin panels, and portals keep React context.

```tsx
import { TanStackDevtools } from '@tanstack/react-devtools';
import { StreamClientProvider } from '@accelint/stream/react';
import { streamDevtoolsPlugin } from '@accelint/stream-devtools/react';

<StreamClientProvider client={streamClient}>
  <App />
  <TanStackDevtools plugins={[streamDevtoolsPlugin]} />
</StreamClientProvider>;
```

To customize the tab, spread the plugin object:
`{ ...streamDevtoolsPlugin, name: 'My Streams' }`.

The adapter keeps one store per client for the client's lifetime, attached
when the panel first mounts. Timelines and message logs survive the shell
unmounting and remounting the panel. History from before the devtools
first open is limited to what the stream cache still holds.

Known limitation, inherited from the upstream React panel host that
TanStack's own panels also use: under React StrictMode (the Next.js dev
default) a mounted panel keeps the theme it first mounted with. Switch the
shell theme and reload to change it.

The entry also exports `StreamDevtoolsPanel`, the raw panel component, for
hosts without the shell. It takes the mount props directly, including an
explicit store:

```tsx
import { StreamDevtoolsPanel } from '@accelint/stream-devtools/react';
import { createStreamDevtoolsStore } from '@accelint/stream-devtools';

const panelProps = {
  store: createStreamDevtoolsStore(streamClient),
  theme: 'dark',
  devtoolsOpen: true,
} as const;

<StreamDevtoolsPanel {...panelProps} />;
```

## Usage: custom wrapper (Solid shell, other frameworks)

The root entry is the Solid core class, a constructor whose instances
`mount(el, props)` and `unmount()`, plus the store factory that binds it
to a client. A Solid-shell plugin is a few lines with
`@tanstack/devtools-utils`:

```tsx
import {
  StreamDevtoolsCore,
  createStreamDevtoolsStore,
} from '@accelint/stream-devtools';
import type { StreamDevtoolsMountProps } from '@accelint/stream-devtools';

const props: StreamDevtoolsMountProps = {
  store: createStreamDevtoolsStore(streamClient),
  theme: 'dark',
  devtoolsOpen: true,
};
const core = new StreamDevtoolsCore();
core.mount(element, props);
// later: core.unmount()
```

The store attaches to the client's `StreamCache` when created and keeps
recording while no panel is mounted. Create it eagerly if timelines should
span the whole app session.

## Production builds

The main entries are development-only, the TanStack devtools convention:
outside `NODE_ENV === 'development'` they resolve to no-op twins that
render nothing and never touch the client. Bundlers inline the check, so
the devtools code path disappears from production bundles. To keep live
devtools in a production build, import from the opt-in entries instead:

```ts
import { StreamDevtoolsCore } from '@accelint/stream-devtools/production';
// or, for React hosts:
import { streamDevtoolsPlugin } from '@accelint/stream-devtools/react/production';
```

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

- The store observes only public `StreamCache.subscribe()` events plus
  each stream's own message history. It ratchets `messageHistory` to 50 on
  every stream it sees. `@accelint/stream` has no knowledge of the
  devtools.
- Panel-to-app commands are direct in-process calls, deliberately **not**
  on the TanStack devtools event bus: the bus broadcasts to all
  same-origin tabs, which caused cross-tab state clobbering. This is the
  React Query devtools architecture.
- Inject-Message feeds panel-validated JSON through the real transport
  message path, indistinguishable from a server message. Treat it as
  destructive in apps whose observers trigger side effects.
