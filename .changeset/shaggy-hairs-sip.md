---
"@accelint/design-toolkit": major
---

Changed to new naming system for fontsource.

Breaking change: This will require changing packages downstream according to the [v5 migration blog](https://fontsource.org/docs/getting-started/migrate-v5) on fontsource.

Example:

From this:

```json
    "@fontsource/roboto-flex": "^5.2.8",
    "@fontsource/roboto-mono": "^5.2.8",
```

To:

```json
    "@fontsource-variable/roboto-flex": "^5.2.8",
    "@fontsource-variable/roboto-mono": "^5.2.8",
```
