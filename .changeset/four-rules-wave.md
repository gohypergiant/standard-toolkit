---
'@accelint/design-toolkit': major
'@apps/next': patch
---

Refactored the DesignToolkit so that it does not use the dot syntax anymore. As an example, `Drawer.Header` is now `DrawerHeader` and so on. This change is required to avoid RSC throwing `undefined` errors in some cases when rendering.

This is a breaking change and will require removing the dot notation from components currently in use in your code base.
