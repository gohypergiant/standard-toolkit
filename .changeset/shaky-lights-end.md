---
"@accelint/map-toolkit": patch
---

Fixed error handling in `useCursorCoordinates` hook for coordinates outside UTM/MGRS valid range. UTM and MGRS coordinate systems are only valid between 80°S and 84°N. The hook now returns the default placeholder (`--, --`) when attempting to format polar coordinates in these formats.
