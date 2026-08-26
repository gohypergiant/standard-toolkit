---
'@accelint/stream-devtools': major
---

Restructure on the TanStack devtools architecture: the root entry is the
Solid core (`StreamDevtoolsCore` + `createStreamDevtoolsStore`), and the
new `@accelint/stream-devtools/react` entry is the React adapter for the
`@tanstack/react-devtools` shell. `streamDevtoolsPlugin` is zero-config:
the panel resolves the app's `StreamClient` from `StreamClientProvider`
context and keeps one store per client, so timelines survive panel
remounts. The panel renders in the shell's light or dark theme. `react`
(^19) is an optional peer used by `./react` only.

BREAKING CHANGES:

- `createStreamDevtoolsPlugin` and `mountStreamDevtools` are removed.
  React hosts: render `<TanStackDevtools plugins={[streamDevtoolsPlugin]} />`
  inside a `StreamClientProvider`. Other hosts:
  `new StreamDevtoolsCore().mount(el, { store, theme, devtoolsOpen })`.
- All entries are development-only: outside `NODE_ENV === 'development'`
  they resolve to no-ops (including under `NODE_ENV=test`). Import from
  `./production` or `./react/production` to keep live devtools.

Also fixes a stale first snapshot when the panel mounts after streams went
idle, and 1.0.0's corrupted type declarations (`@tanstack/devtools` is now
a declared optional peer).

Known limitation, shared with TanStack's own panels (upstream
`createReactPanel`): a mounted panel keeps its mount-time theme until
reload.
