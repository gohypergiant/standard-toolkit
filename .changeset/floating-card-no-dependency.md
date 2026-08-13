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
  underlying `DockviewApi` instance, which no longer exists. The rest of the
  context is unchanged: `cards`, `closeCard`, `togglePinCard`, `isPinned`,
  `subscribeToPinState`, `addRef`, and `removeRef`.

Every existing `FloatingCard` and `FloatingCardProvider` prop keeps its
behavior, so applications that do not read `api` need no code changes.

New:

- `FloatingCardProvider` accepts a `bounds` prop of `'provider'` (default) or
  `'viewport'`, controlling the region cards are confined to while dragging and
  resizing.

Behavior notes:

- Cards can be resized from any edge or corner. Pinning a card continues to
  freeze dragging and now also freezes resizing.
