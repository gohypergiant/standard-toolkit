---
'@accelint/design-toolkit': patch
---

Fix four `NoticeList` bugs:

- "Clear All" no longer throws (`queue.clear` was passed unbound, so `this` was `undefined` and clicking the button raised a TypeError without clearing anything).
- Per-notice `timeout` and `color` now take precedence over the list-level `defaultTimeout`/`defaultColor`, matching the documented behavior ("defaults for notices without explicit timeout/color"). Previously the list-level values silently overrode every notice.
- A `NoticeList` without an `id` no longer consumes notices that were explicitly targeted at another list, which previously caused targeted notices to render twice (once in the targeted list and once in every untargeted list).
- The internal queue subscription is now registered once with proper cleanup. Previously a new subscription was added on every render and never removed, leaking listeners for the life of the page.
