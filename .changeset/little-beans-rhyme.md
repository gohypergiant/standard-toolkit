---
"@accelint/logger": minor
---

Change transports behavior to no longer be additive, it now replaces default / implicit stdout transports. By default, the logger writes to a single console transport (pretty-printed in development, structured
JSON when pretty: false). Now, passing a non-empty transports array replaces the default - only the
transports you provide are used.
