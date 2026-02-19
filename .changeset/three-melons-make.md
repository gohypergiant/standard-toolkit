---
"@accelint/logger": major
---

1. Added in https://loglayer.dev/log-level-managers/one-way.html to facilitate unique child logger levels
2. Updated tests to verify a few assertions we had with regards to getLogger() singleton pattern (and more)
3. Updated documentation to showcase some additional patterns
4. Updated all dependencies to latest
5. Added support for Groups feature https://loglayer.dev/logging-api/groups.html
6. Swap to structured logger when in production mode
7. Remove type export `LOG_LEVEL` (breaking change), this was just a re-export from `loglayer` and was technically a TS enum which we try and avoid. Since we already export each individual log level as a const this felt a little redundant.
