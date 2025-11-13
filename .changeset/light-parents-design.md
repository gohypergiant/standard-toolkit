---
"@accelint/design-toolkit": major
"@accelint/design-foundation": minor
"@accelint/map-toolkit": patch
"@apps/next": patch
---

BREAKING CHANGES:
Design Toolkit no longer exports `tv`, this is now available from Design Foundation

Created new package @accelint/design-foundation that houses all of the Tailwind tokens, variants, base styles and utilities for easier reuse without having a dependency on the larger Design Toolkit

Updated Map Toolkit Storybook and NextJS demo app styles to import the new Design Foundation
