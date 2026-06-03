---
"@accelint/design-toolkit": patch
---

Fix checkbox and switch scroll-into-view behavior. Prevents browser from automatically scrolling when clicking checkboxes or switches by overriding focus() to use preventScroll option.
