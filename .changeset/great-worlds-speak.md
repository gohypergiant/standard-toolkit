---
"@accelint/map-toolkit": patch
---

With the changest to the basemap we now are explicitly rendering a `<MapLibre>` component and attatching a ref manually as opposed to calling the previous hook. The underlying api changes so we have to account for that in the MapControls component
