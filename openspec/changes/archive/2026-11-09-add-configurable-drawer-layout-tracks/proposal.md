# Proposal

## Why

DrawerLayout currently derives each open Drawer track solely from Drawer’s `small`, `medium`, or `large` semantic size. Consumers that need a deliberate layout reservation with CSS dimensions or design tokens cannot configure it, while historical reports about persistent closed tracks lack a current reproducible defect.

## What Changes

- Add an approved, placement-keyed DrawerLayout configuration for overriding the effective open track size with supported CSS dimension values.
- Preserve semantic Drawer-size tracks when a placement is not configured; keep configured and unconfigured closed or absent Drawer tracks at `0px`.
- Define push and overlay behavior: pushed main content uses an open placement’s effective configured or semantic track, while overlay behavior remains compatible.
- Specify partial placement configuration, open/close/reopen behavior, and concurrent Drawer behavior at a shared placement.
- Add component, visual, Storybook, and generated API-document coverage for the new behavior.
- Do not treat the historical closed-track report as a production regression without the documented 9.10.0 versus current reproduction evidence.

## Scope Boundaries

Out of scope:

- Changing Drawer modal, focus, keyboard, screen-reader, or React Aria behavior.
- Reworking Drawer registration, ViewStack state, Sidenav reservation, or grid animation architecture.
- Adding a general CSS parser, runtime CSS validation, normalization, or support for unapproved CSS grammar beyond the agreed public contract.
- Fixing a historical closed-track regression without the required reproducible comparison.

## Capabilities

### New Capabilities

- `drawer-layout-tracks`: Configurable effective DrawerLayout grid tracks, including placement precedence, visibility states, and push/overlay behavior.

### Modified Capabilities

- None.

## Impact

- **Workspace packages:** `@accelint/design-toolkit` (public DrawerLayout props, DrawerLayout CSS, tests, stories, package docs); `@apps/next` (visual coverage); `@apps/docs` (generated Drawer API documentation and `.index.json` record).
- **Known monorepo dependents:** the app drawer layout, Sidenav visual shell, and Drawer/Sidenav stories; published consumers of `@accelint/design-toolkit` may adopt the new optional prop.
- **Public API approval:** required before implementation because this adds a published DrawerLayout contract. If approved as backward-compatible, it requires a **minor** changeset; migration is opt-in, so existing consumers retain semantic-size behavior without changes.
- No dependencies are added. Existing public entrypoints and CSS Modules/Tailwind patterns remain intact.
