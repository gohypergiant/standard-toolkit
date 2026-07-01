---
title: getLogger
description: Returns a singleton LogLayer logger instance with automatic configuration
source: default/index.ts
source_sha: 5d8f26d3627b503804e9b8a7cdeb0a9590b09439
doc_sha: f6c45d5bec118b5874c81dd6a7fb0d06ac4d98f7
deprecated: false
updated: 2026-05-28
---

# getLogger

Returns a singleton LogLayer logger instance.

## Usage

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  env: process.env.NODE_ENV as 'production' | 'development',
  level: 'info',
  prefix: '[MyApp]',
});

logger.info('Application started');
logger.withMetadata({ userId: 123 }).warn('Token expiring soon');
```

## Reference

```typescript
function getLogger(opts: LoggerOptions): LogLayer
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `opts` | `LoggerOptions` | Logger configuration options |
| `opts.enabled` | `boolean` | Whether logging is active; `false` makes all calls no-ops |
| `opts.level` | `LogLevelType` | Minimum log level to output (default: `'debug'`) |
| `opts.env` | `'production' \| 'development'` | Runtime environment; controls server detection (default: `'development'`) |
| `opts.pretty` | `boolean` | Use pretty console output; `false` emits structured JSON (default: `true`) |
| `opts.prefix` | `string` | String prepended to all log messages (default: `''`) |
| `opts.plugins` | `LogLayerPlugin[]` | Additional plugins applied after the built-in ones |
| `opts.transports` | `LogLayerTransport[]` | Custom transports that replace the default console transport |
| `opts.groups` | `LogGroupsConfig` | Named group configuration for conditional group logging |

### Returns

Returns a configured LogLayer instance. The first call creates and configures the logger. Subsequent calls return the same instance, ignoring any new options.

## Examples

### Example: Basic setup

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  level: 'info',
  env: process.env.NODE_ENV as 'production' | 'development',
});

logger.info('User logged in', { userId: 'u-123' });
logger.error('Failed to load config', { error });
```

### Example: Development vs production configuration

```typescript
import { getLogger } from '@accelint/logger';

const isDev = process.env.NODE_ENV === 'development';

const logger = getLogger({
  enabled: true,
  level: isDev ? 'debug' : 'warn',
  pretty: isDev,
  env: isDev ? 'development' : 'production',
  prefix: isDev ? '[Dev]' : '',
});

logger.debug('This only shows in development');
logger.warn('This shows in all environments');
```

### Example: Using metadata

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({ enabled: true });

// Add context to a single log call
logger.withMetadata({ requestId: 'req-123' }).info('Processing request');

// Create a child logger with persistent metadata
const requestLogger = logger.withMetadata({ requestId: 'req-123' });
requestLogger.info('Started processing');
requestLogger.info('Completed processing');
```

### Example: Named log groups

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  groups: {
    database: { enabled: true },
    network: { enabled: false },
  },
});

// Database logs will output
logger.withGroup('database').info('Query executed', { duration: 42 });

// Network logs are disabled
logger.withGroup('network').info('Request sent'); // No output
```

### Example: Custom plugins

```typescript
import { getLogger } from '@accelint/logger';
import type { LogLayerPlugin } from '@loglayer/plugin';

const timestampPlugin: LogLayerPlugin = {
  id: 'timestamp',
  onBeforeDataOut({ data = {} }) {
    return {
      ...data,
      timestamp: Date.now(),
    };
  },
};

const logger = getLogger({
  enabled: true,
  plugins: [timestampPlugin],
});

logger.info('Message with timestamp');
```

> **Good to know:** The logger is automatically configured with callsite tracking and environment detection plugins. Error serialization is handled via serialize-error. The singleton pattern ensures consistent configuration across your application—the first call to `getLogger` sets the configuration for all subsequent calls.

## Related

- [bootstrap](./bootstrap.md) - Direct logger initialization bypassing singleton
- [callsitePlugin](../plugins/callsite.md) - Source location tracking plugin
- [environmentPlugin](../plugins/environment.md) - Environment context plugin
- [prettyTransport](../transports/pretty.md) - Pretty-printed console output
- [structuredTransport](../transports/structured.md) - JSON log output
