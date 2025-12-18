---
"@accelint/design-toolkit": major
---

Remove /styles export. Convert utility class usage in src to css modules.

Breaking Changes:
* `/styles` export has been removed 
  * because all component styles are in css modules and global classes live in design-foundation, there is no longer anything global for the design toolkit to export 

Migration Guide:
* [Visit the v9 migration guide](https://design-toolkit.accelint.io/?path=/docs/upgrade-guides--playground) for detailed information about migration
