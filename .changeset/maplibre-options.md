---
"@accelint/map-toolkit": minor
---

Adds a `mapLibreOptions` prop to `BaseMap` that forwards additional MapLibre `MapOptions` (e.g. `transformRequest`, `maxBounds`, `minZoom`/`maxZoom`, `locale`, `interactive`, `cooperativeGestures`) to the underlying map instance.

The most common use is `transformRequest` for rewriting tile URLs through a proxy, adding auth headers, or resolving `mapbox://` URIs against a self-hosted Mapbox-compatible service.

```tsx
<BaseMap
  id={MAIN_MAP_ID}
  styleUrl={MAPBOX_STYLE_URL}
  mapLibreOptions={{
    transformRequest: (url) =>
      url.startsWith('mapbox://')
        ? { url: url.replace('mapbox://', 'https://tiles.internal.example.com/') }
        : { url },
    maxBounds: [[-130, 20], [-60, 55]],
    cooperativeGestures: true,
  }}
/>
```

Keys BaseMap manages internally are silently stripped before being applied: camera/view state (`container`, `center`, `bounds`, `fitBoundsOptions`, `zoom`, `pitch`, `bearing`, `projection`, `maxPitch`), gestures reserved for Deck.gl picking and the camera state machine (`doubleClickZoom`, `dragRotate`, `pitchWithRotate`, `rollEnabled`), the WebGL context (`canvasContextAttributes`), and keys already exposed as dedicated BaseMap props (`boxZoom`, `style`).
