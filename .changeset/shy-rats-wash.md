---
"@accelint/design-toolkit": minor
---

Refactors existing implementation of DrawerClose event to now emit a new event tied to an ID, to allow for listening to bus for Drawer Open and Close. Previously, the viewstack would be cleared without emitting an event with a given id.

### Breaking Changes ###
- `DrawerTrigger` components using `for='close'` will now need to specify a given drawer id, or use another `ViewStack` event such as `reset` or `clear.`
- `DrawerClose` components will now require a new prop, `for`, which will take the `UniqueId` of a given View to emit a specific `close` event to the event bus.
