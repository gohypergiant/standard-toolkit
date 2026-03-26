---
"@accelint/map-toolkit": minor
---

Added `HtmlOverlayWidget` for rendering projected React elements as HTML overlays on DeckGL maps.

- `HtmlOverlayWidget` — a DeckGL widget that projects React children onto the map viewport using geographic coordinates, with configurable overflow margin, z-index, and support for custom overlay rendering via `onCreateOverlay`/`onRenderOverlay` callbacks.
- `HtmlOverlayItem` — a positioning component that uses CSS `transform: translate()` for smooth, jitter-free overlay placement during zoom.
- `useHtmlOverlay` — a React hook that manages widget lifecycle and renders overlay content through a React portal, keeping React's reconciliation in control of the overlay DOM.
- Pass `widgets` prop through `BaseMap` to DeckGL.
