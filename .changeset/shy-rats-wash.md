---
"@accelint/design-toolkit": minor
---

Refactors existing implementation of DrawerClose event to now emit a new event tied to an ID, to allow for listening to bus for Drawer Open and Close. Previously, the viewstack would be cleared without emitting an event with a given id.
