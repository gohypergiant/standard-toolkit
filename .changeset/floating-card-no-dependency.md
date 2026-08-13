---
'@accelint/design-toolkit': major
---

Reimplement `FloatingCard` without dockview.

Dragging, resizing, and stacking order are now handled directly by the
component, so `dockview-react` is no longer a peer dependency and no longer
needs to be installed.

BREAKING CHANGES:

- The `dockview-react` peer dependency has been removed. Applications that
  installed it only for `FloatingCard` can drop it.
- `useFloatingCard()` no longer returns `api`. It previously exposed the
  underlying `DockviewApi` instance, which no longer exists.
- `useFloatingCard()` no longer returns `addRef` or `removeRef`. Registering a
  card is internal wiring between `FloatingCard` and its provider, so it moved
  off the value applications consume. Nothing else called them.

`useFloatingCard()` still returns `cards`, `closeCard`, `togglePinCard`,
`isPinned`, and `subscribeToPinState`, all unchanged.

Every existing `FloatingCard` and `FloatingCardProvider` prop keeps its
behavior, so applications that do not read `api` need no code changes.

New:

- `FloatingCardProvider` accepts a `bounds` prop of `'provider'` (default) or
  `'viewport'`, controlling the region cards are confined to while dragging and
  resizing.

Behavior notes:

- Cards can be resized from any edge or corner. Pinning a card continues to
  freeze dragging and now also freezes resizing.
