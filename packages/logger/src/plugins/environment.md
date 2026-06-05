---
title: environmentPlugin
description: Creates a LogLayer plugin that injects environment context into log data
source: plugins/environment.ts
source_sha: c50b933870c4c7e1eae79048fb135ccf7faf9166
doc_sha: d7a57d0ca7c2c9b9f349780989ac3a455094e0e2
deprecated: false
updated: 2026-05-28
---

# environmentPlugin

Creates a LogLayer plugin that injects environment context into log data.

## Usage

```typescript
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const plugin = environmentPlugin({
  isServer: typeof window === 'undefined',
  isProductionEnv: false,
});
// Log output will include: server: true (or false in browser)
```

## Reference

```typescript
function environmentPlugin(options: EnvironmentPluginOptions): LogLayerPlugin
```

```typescript
type EnvironmentPluginOptions = LogLayerPluginParams & {
  isServer: boolean;
  isProductionEnv: boolean;
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `EnvironmentPluginOptions` | Plugin configuration options |
| `options.isServer` | `boolean` | True when running in a Node.js environment (`typeof window === 'undefined'`) |
| `options.isProductionEnv` | `boolean` | Reserved for future use; currently has no effect |
| `options.id` | `string` | Optional plugin identifier |
| `options.disabled` | `boolean` | Optional flag to disable the plugin |

### Returns

Returns a LogLayer plugin instance that adds a `server` boolean property to all log output, indicating whether the log originated from a server or browser context.

## Examples

### Example: Manual plugin registration

```typescript
import { LogLayer } from 'loglayer';
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const logger = new LogLayer({
  plugins: [
    environmentPlugin({
      isServer: typeof window === 'undefined',
      isProductionEnv: false,
    }),
  ],
  transport: console,
});

logger.info('Environment detected');
// Output includes: { server: true, message: "Environment detected" }
```

### Example: Universal logging in Next.js

```typescript
import { environmentPlugin } from '@accelint/logger/plugins/environment';
import { LogLayer } from 'loglayer';

// Works in both server and client components
const isServer = typeof window === 'undefined';

const logger = new LogLayer({
  plugins: [
    environmentPlugin({
      isServer,
      isProductionEnv: process.env.NODE_ENV === 'production',
    }),
  ],
  transport: console,
});

// Server logs: { server: true, message: "..." }
// Client logs: { server: false, message: "..." }
logger.info('Request processed');
```

### Example: Filtering logs by environment

```typescript
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const plugin = environmentPlugin({
  isServer: typeof window === 'undefined',
  isProductionEnv: process.env.NODE_ENV === 'production',
});

// Use in log aggregation pipeline to filter server vs client logs
// Example: filter logs where server === true for backend monitoring
```

### Example: Combined with callsite tracking

```typescript
import { LogLayer } from 'loglayer';
import { callsitePlugin } from '@accelint/logger/plugins/callsite';
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const logger = new LogLayer({
  plugins: [
    callsitePlugin({ isProductionEnv: false }),
    environmentPlugin({
      isServer: typeof window === 'undefined',
      isProductionEnv: false,
    }),
  ],
  transport: console,
});

logger.info('Full context logging');
// Output: { callSite: "...", server: true, message: "Full context logging" }
```

> **Good to know:** This plugin is automatically included in both `getLogger` and `bootstrap` configurations. The `isServer` flag is determined at logger initialization time using `typeof window === 'undefined'`, making it reliable for universal JavaScript applications that run in both Node.js and browser environments.

## Related

- [callsitePlugin](./callsite.md) - Source location tracking plugin
- [bootstrap](../default/bootstrap.md) - Automatically includes this plugin
- [getLogger](../default/index.md) - Singleton logger with built-in plugins
