---
"@accelint/bus": major
---

BREAKING CHANGE:
Due to overwhelming feedback, the default behavior of the bus has been changed. Previously, all events were emitted to all connected bus instances. This is no longer the case by default.

Events emitted are now targeted at the instance from which they originate. This can still be overridden globally, or per event, or per emit using the emit options target property.

New Feature:
For when it is necessary to emit events to other bus instances, there's now a helper property on the bus instance to find the ids of the other instances.

`bus.connected` provides a `Set` of instance ids that it is currently connected to. The bus does it's best to maintain an accurate registry of active connections. However, due to the complexity of browser tab unloading, there's possibility of having ids for instances that have since disconnected. If it's critical to have higher confidence in accuracy, calling `bus.ping()` which recheck these connections, but note that this is not synchronous nor is it possible to `async / await`
