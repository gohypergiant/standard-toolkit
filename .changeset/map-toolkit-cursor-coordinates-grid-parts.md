---
"@accelint/map-toolkit": patch
---

`cursor-coordinates` now renders MGRS and UTM strings from `@accelint/geo`'s grid-parts API (`toMgrsParts`/`toUtmParts`) instead of round-tripping through a `createCoordinate(...)` string conversion. Output for in-band coordinates is unchanged, and out-of-range latitudes still show the `--- -- ---- ----` sentinel. As a result of aligning with geo's inclusive boundary, `80°S` (`-80`) latitude is now treated as valid for MGRS/UTM rather than being rejected.
