---
"@accelint/design-foundation": major
"@accelint/design-toolkit": major
---

Build with tsdown

Breaking Changes:
* `/index` has been removed from the end of deep import paths
  * e.g. `import { designTokens } from '@accelint/design-foundation/tokens/index';` is now `import { designTokens } from '@accelint/design-foundation/tokens'`; 

Migration Guide:
* [Visit the v9 migration guide](https://design-toolkit.accelint.io/?path=/docs/upgrade-guides--playground) for detailed information about migration
