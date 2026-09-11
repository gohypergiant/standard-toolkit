---
"@accelint/temporal": patch
---

Fix clock-aligned timer cleanup behavior in `@accelint/temporal`.

- prevent `setClockInterval` from scheduling another tick when cleanup is called during the callback
- prevent `setClockTimeout` from firing after cleanup when cancelled before the next-second alignment
- update `callNextSecond` documentation to reflect its cancel function return value
- add regression tests covering early cancellation and idempotent cancellation
