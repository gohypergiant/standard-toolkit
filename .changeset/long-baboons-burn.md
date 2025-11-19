---
"@accelint/bus": major
"@accelint/design-toolkit": patch
"@accelint/map-toolkit": minor
---

Constrained the `Payload` type for `@acclelint/bus` to `StructuredCloneable`. This constraint is in line with the actual behavior of the Broadcast class, which only allows values that are serializable by the structured clone algorithm to be emitted. This is a breaking change and will require instances of `emit` to remove values that are not serializble by the structured clone algorithm from the payload.
