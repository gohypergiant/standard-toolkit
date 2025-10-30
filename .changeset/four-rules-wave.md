---
'@accelint/design-toolkit': major
'@apps/next': patch
---

Refactored the DesignToolkit so that it does not use the dot syntax anymore. As an example, `Drawer.Header` is now `DrawerHeader` and so on. This change is required to avoid RSC throwing `undefined` errors in some cases when rendering.

This is a breaking change and will require removing the dot notation from components currently in use in your code base.

This change also updates the import/export paths for the components. If you are not importing from the root `@accelint/design-toolkit` path, then you will need to update your imports as follows:
- `RootComponent` goes from `@accelint/design-toolkit/root-component` to `@accelint/design-toolkit/components/root-component/index`
- `RootComponentHeader` goes from `@accelint/design-toolkit/root-component` to `@accelint/design-toolkit/components/root-component/header`
