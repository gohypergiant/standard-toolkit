---
title: bootstrap
description: Initializes and configures a LogLayer instance with default plugins and transports
source: default/bootstrap.ts
source_sha: 6b82165aa9393f8001b3830d745495efe20f7cfa
doc_sha: 54886955cc187e2d01f85fed9edf7b89fb5815df
deprecated: false
updated: 2026-05-28
---

# bootstrap

Initializes and configures a LogLayer instance with default plugins and transports.

## Usage

```typescript
import { bootstrap } from '@accelint/logger';

// Create a logger for a specific module (bypasses the singleton)
const logger = bootstrap({
  enabled: true,
  level: 'warn',
  env: process.env.NODE_ENV as 'production' | 'development',
  prefix: '[MyModule]',
});

logger.withMetadata({ userId: 'u-123' }).warn('Token expiring soon');
```

## Reference

```typescript
function bootstrap(options: LoggerOptions): LogLayer
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `LoggerOptions` | Logger configuration options |
| `options.enabled` | `boolean` | Whether logging is active; `false` makes all calls no-ops |
| `options.level` | `LogLevelType` | Minimum log level to output (default: `'debug'`) |
| `options.env` | `'production' \| 'development'` | Runtime environment; controls server detection (default: `'development'`) |
| `options.pretty` | `boolean` | Use pretty console output; `false` emits structured JSON (default: `true`) |
| `options.prefix` | `string` | String prepended to all log messages (default: `''`) |
| `options.plugins` | `LogLayerPlugin[]` | Additional plugins applied after the built-in ones |
| `options.transports` | `LogLayerTransport[]` | Custom transports that replace the default console transport |
| `options.groups` | `LogGroupsConfig` | Named group configuration for conditional group logging |

### Returns

Returns a configured LogLayer instance with pre-configured callsite tracking, environment detection, and error serialization.

## Examples

### Example: Module-specific logger

```typescript
import { bootstrap } from '@accelint/logger';

// Create separate loggers for different modules
const authLogger = bootstrap({
  enabled: true,
  prefix: '[Auth]',
  level: 'info',
  env: process.env.NODE_ENV as 'production' | 'development',
});

const dbLogger = bootstrap({
  enabled: true,
  prefix: '[Database]',
  level: 'warn',
  env: process.env.NODE_ENV as 'production' | 'development',
});

authLogger.info('User authenticated');
dbLogger.warn('Query slow', { duration: 5000 });
```

### Example: Custom transports

```typescript
import { bootstrap, prettyTransport, structuredTransport } from '@accelint/logger';

// Use both pretty and structured output
const logger = bootstrap({
  enabled: true,
  transports: [
    prettyTransport({ level: 'debug' }),
    structuredTransport({ level: 'info' }),
  ],
});

logger.info('Logged to both transports');
```

### Example: Production configuration

```typescript
import { bootstrap } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  env: 'production',
  pretty: false, // Use structured JSON
  level: 'warn', // Only warnings and errors
});

logger.debug('Not shown in production'); // No output
logger.error('Critical error', { error }); // JSON output
```

### Example: Testing with disabled logging

```typescript
import { bootstrap } from '@accelint/logger';
import { describe, test } from 'vitest';

describe('UserService', () => {
  test('creates user', () => {
    // Disable logging in tests
    const logger = bootstrap({ enabled: false });
    
    const service = new UserService(logger);
    // All log calls are no-ops
  });
});
```

### Example: Custom plugin integration

```typescript
import { bootstrap } from '@accelint/logger';
import type { LogLayerPlugin } from '@loglayer/plugin';

const correlationPlugin: LogLayerPlugin = {
  id: 'correlation',
  onBeforeDataOut({ data = {} }) {
    return {
      ...data,
      correlationId: crypto.randomUUID(),
    };
  },
};

const logger = bootstrap({
  enabled: true,
  plugins: [correlationPlugin],
});

logger.info('Request processed'); // Includes correlationId
```

> **Good to know:** Built-in plugins are applied in this order before any user-supplied plugins: (1) `callsitePlugin` injects source file location, (2) `environmentPlugin` injects server/browser context. The returned instance uses a one-way log level manager: the level can only be raised (made more restrictive) after initialization, never lowered.

## Related

- [getLogger](./index.md) - Singleton logger factory
- [callsitePlugin](../plugins/callsite.md) - Source location tracking plugin
- [environmentPlugin](../plugins/environment.md) - Environment context plugin
- [prettyTransport](../transports/pretty.md) - Pretty-printed console output
- [structuredTransport](../transports/structured.md) - JSON log output
