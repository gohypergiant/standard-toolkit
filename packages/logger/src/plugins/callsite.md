---
title: callsitePlugin
description: Creates a LogLayer plugin that tracks and injects source code location into log data
source: plugins/callsite.ts
source_sha: 2c791d5f027d5dd85ede507bd567d7324c87793d
doc_sha: c04b0c7b0d9117d6a0d791fdc5dd5496cbb54e4b
deprecated: false
updated: 2026-05-28
---

# callsitePlugin

Creates a LogLayer plugin that tracks and injects source code location into log data.

## Usage

```typescript
import { callsitePlugin } from '@accelint/logger/plugins/callsite';

const plugin = callsitePlugin({ isProductionEnv: false });
// Log output will include: callSite: "src/services/user.ts:42:5"
```

## Reference

```typescript
function callsitePlugin(options: CallsitePluginOptions): LogLayerPlugin
```

```typescript
type CallsitePluginOptions = LogLayerPluginParams & {
  isProductionEnv: boolean;
}
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `CallsitePluginOptions` | Plugin configuration options |
| `options.isProductionEnv` | `boolean` | Reserved for future use; currently has no effect |
| `options.id` | `string` | Optional plugin identifier |
| `options.disabled` | `boolean` | Optional flag to disable the plugin |

### Returns

Returns a LogLayer plugin instance that automatically captures the file, line number, and column where each log call originates, adding a `callSite` property to the log data.

## Examples

### Example: Manual plugin registration

```typescript
import { LogLayer } from 'loglayer';
import { callsitePlugin } from '@accelint/logger/plugins/callsite';

const logger = new LogLayer({
  plugins: [
    callsitePlugin({ isProductionEnv: false }),
  ],
  transport: console,
});

logger.info('User created');
// Output includes: { callSite: "src/user-service.ts:15:8", message: "User created" }
```

### Example: Combined with environment plugin

```typescript
import { LogLayer } from 'loglayer';
import { callsitePlugin } from '@accelint/logger/plugins/callsite';
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const logger = new LogLayer({
  plugins: [
    callsitePlugin({ isProductionEnv: false }),
    environmentPlugin({ 
      isProductionEnv: false,
      isServer: typeof window === 'undefined'
    }),
  ],
  transport: console,
});

logger.info('Request received');
// Output includes: { callSite: "...", server: true, message: "Request received" }
```

### Example: Conditional callsite tracking

```typescript
import { callsitePlugin } from '@accelint/logger/plugins/callsite';

const isProd = process.env.NODE_ENV === 'production';

const plugin = callsitePlugin({
  isProductionEnv: isProd,
  // Disable in production to reduce overhead
  disabled: isProd,
});
```

> **Good to know:** The plugin searches the call stack for the nearest log level method frame (info, warn, error, etc.) to identify the actual calling location. In bundler environments using eval() during development builds, the plugin uses `getEvalOrigin()` for accurate source mapping. The callsite detection works across server and browser contexts.

## Related

- [environmentPlugin](./environment.md) - Environment context plugin
- [bootstrap](../default/bootstrap.md) - Automatically includes this plugin
- [getLogger](../default/index.md) - Singleton logger with built-in plugins
