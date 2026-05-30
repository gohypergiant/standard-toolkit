---
"@accelint/design-toolkit": patch
---

Fix checkbox scroll-into-view behavior. Prevents browser from automatically scrolling when clicking checkboxes by overriding focus() to use preventScroll option.
