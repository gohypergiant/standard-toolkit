---
"@accelint/design-foundation": patch
"@accelint/design-toolkit": patch
"@apps/next": patch
---

- Added comprehensive test suite (15 tests, 100% coverage) for CSS module hashing logic
- Added automated build verification for CSS module file copying (prevents silent failures)
- Added typecheck script to design-toolkit package.json
- Expanded migration guide with practical troubleshooting checklist of 5 common migration mistakes + solutions
- Added detailed JSDoc documentation explaining hash collision probability (~0.0008% for typical projects)
- Added Next.js 15.x compatibility notes to webpack configuration
