---
"@accelint/map-toolkit": patch
---

With the changeset to the basemap we now are explicitly rendering a `<MapLibre>` component and attaching a ref manually as opposed to calling the previous hook. The underlying api changes so we have to account for that in the MapControls component
