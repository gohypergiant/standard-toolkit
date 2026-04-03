---
"@accelint/map-toolkit": patch
---

fix: prevent DrawShapeLayer from breaking map viewport sync on mount

`setDrawDistanceUnit` was calling `drawStore.set()` on mount even when not
actively drawing. This triggered a re-render that raced with deck.gl's async
device initialization, causing `MapboxOverlay.setProps` to overwrite the
wrapped `onLoad` callback that registers `watchMapMove`. Without
`watchMapMove`, the deck viewport stayed frozen at the initial zoom and
pan/zoom picking coordinates were wrong.

The fix guards `setDrawDistanceUnit` to only update the store when a drawing
is active (`activeShapeType` is set).
