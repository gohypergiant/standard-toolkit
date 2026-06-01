---
title: Logger
description: Structured logging with LogLayer, pre-configured with callsite tracking, environment detection, and error serialization.
source: packages/logger/src/index.ts
source_sha: 6590120cecd2a4cd41b06ceb0e316216a25867a5
doc_sha: bd5410e4149a01daf78b4ef1976c4d5c711ef519
deprecated: false
updated: 2026-05-28
---

# Logger

Structured logging with LogLayer, pre-configured with callsite tracking, environment detection, and error serialization.

## getLogger

Returns a singleton LogLayer logger instance with automatic callsite tracking and environment detection.

### Usage

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

### Reference

```typescript
function getLogger(opts: LoggerOptions): LogLayer
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `opts` | `LoggerOptions` | Logger configuration options |
| `opts.enabled` | `boolean` | Whether logging is active; `false` makes all calls no-ops |
| `opts.level` | `LogLevel` | Minimum log level to output (default: `'debug'`) |
| `opts.env` | `'production' \| 'development'` | Runtime environment (default: `'development'`) |
| `opts.pretty` | `boolean` | Use pretty console output; `false` emits structured JSON (default: `true`) |
| `opts.prefix` | `string` | String prepended to all log messages (default: `''`) |
| `opts.plugins` | `LogLayerPlugin[]` | Additional plugins applied after built-in ones |
| `opts.transports` | `LogLayerTransport[]` | Custom transports replacing default; include `prettyTransport` or `structuredTransport` to keep console output |
| `opts.groups` | `LogGroupsConfig` | Named group configuration for conditional logging |

#### Returns

Returns a configured LogLayer instance. The first call creates the logger; subsequent calls return the same instance.

### Examples

#### Example: Production logging with structured output

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  env: 'production',
  level: 'warn',
  pretty: false, // Structured JSON for log aggregation
});

logger.error('Database connection failed', { host: 'db.example.com' });
```

#### Example: Development logging with metadata

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  env: 'development',
  prefix: '[API]',
});

logger
  .withMetadata({ requestId: 'req-123', userId: 'u-456' })
  .info('Request processed successfully');
```

#### Example: Group-based logging

```typescript
import { getLogger } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  groups: {
    auth: true,
    database: false, // Disable database group logs
  },
});

logger.withGroup('auth').info('User authenticated');
logger.withGroup('database').debug('Query executed'); // Won't log
```

> **Good to know:** The logger is a singleton. The first call to `getLogger()` creates and configures the instance; subsequent calls return the same instance and ignore new options. Use `bootstrap()` if you need multiple independent logger instances.

---

## bootstrap

Initializes and configures a LogLayer instance with default plugins and transports.

### Usage

```typescript
import { bootstrap } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  level: 'warn',
  env: process.env.NODE_ENV as 'production' | 'development',
  prefix: '[MyApp]',
});

logger.warn('Custom logger instance created');
```

### Reference

```typescript
function bootstrap(options: LoggerOptions): LogLayer
```

#### Parameters

Same as `getLogger()`. See parameter table above.

#### Returns

Returns a new configured LogLayer instance with:
- Callsite tracking plugin (adds source location to log data)
- Environment plugin (adds server/browser context)
- Error serialization via serialize-error
- One-way log level manager (level can only be raised, never lowered)

### Examples

#### Example: Module-specific logger

```typescript
import { bootstrap } from '@accelint/logger';

// Create a dedicated logger for a specific module (bypasses singleton)
const authLogger = bootstrap({
  enabled: true,
  level: 'debug',
  prefix: '[Auth]',
});

const dbLogger = bootstrap({
  enabled: true,
  level: 'warn',
  prefix: '[DB]',
});

authLogger.debug('Password validation started');
dbLogger.warn('Connection pool exhausted');
```

#### Example: Custom transports

```typescript
import { bootstrap, prettyTransport } from '@accelint/logger';
import { createCustomTransport } from './custom-transport';

const logger = bootstrap({
  enabled: true,
  transports: [
    prettyTransport({ level: 'debug' }), // Keep console output
    createCustomTransport(), // Add custom transport
  ],
});
```

> **Good to know:** Unlike `getLogger()`, `bootstrap()` always creates a new logger instance. Use this when you need multiple independent loggers with different configurations.

---

## Log Level Constants

Pre-defined log level constants for configuring logger severity thresholds.

### Usage

```typescript
import { getLogger, INFO, WARN, ERROR } from '@accelint/logger';

const logger = getLogger({ level: INFO, enabled: true });
```

### Reference

```typescript
const TRACE: 'trace'
const DEBUG: 'debug'
const INFO: 'info'
const WARN: 'warn'
const ERROR: 'error'
const FATAL: 'fatal'
```

### Log Level Hierarchy

From most verbose to least verbose:
1. `TRACE` - Fine-grained debugging, more verbose than debug
2. `DEBUG` - Detailed diagnostic information for development
3. `INFO` - General informational messages about application progress
4. `WARN` - Potentially harmful situations that don't prevent execution
5. `ERROR` - Critical errors requiring immediate attention
6. `FATAL` - Severe errors that may cause application termination

### Examples

#### Example: Setting log level threshold

```typescript
import { getLogger, WARN } from '@accelint/logger';

// Only WARN, ERROR, and FATAL will be logged
const logger = getLogger({
  enabled: true,
  level: WARN,
});

logger.debug('This will not log');
logger.info('This will not log');
logger.warn('This will log');
logger.error('This will log');
```

#### Example: Environment-based log levels

```typescript
import { getLogger, INFO, DEBUG } from '@accelint/logger';

const logger = getLogger({
  enabled: true,
  level: process.env.NODE_ENV === 'production' ? INFO : DEBUG,
});
```

---

## callsitePlugin

Enriches log entries with source file location information.

### Usage

```typescript
import { bootstrap, callsitePlugin } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  plugins: [
    callsitePlugin({ isProductionEnv: false }),
  ],
});

logger.info('Log includes file/line info');
```

### Reference

```typescript
function callsitePlugin(options: CallsitePluginOptions): LogLayerPlugin
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.isProductionEnv` | `boolean` | Whether running in production; affects callsite detail |

> **Good to know:** This plugin is automatically included by `getLogger()` and `bootstrap()`. You only need to import it if building a custom logger configuration.

---

## environmentPlugin

Enriches log entries with runtime environment context (server/browser detection).

### Usage

```typescript
import { bootstrap, environmentPlugin } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  plugins: [
    environmentPlugin({ isProductionEnv: false, isServer: true }),
  ],
});
```

### Reference

```typescript
function environmentPlugin(options: EnvironmentPluginOptions): LogLayerPlugin
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.isProductionEnv` | `boolean` | Whether running in production |
| `options.isServer` | `boolean` | Whether running in server context |

> **Good to know:** This plugin is automatically included by `getLogger()` and `bootstrap()`. Manual usage is only needed for custom configurations.

---

## prettyTransport

Creates a human-readable console transport with color-coded log levels.

### Usage

```typescript
import { bootstrap, prettyTransport } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  transports: [
    prettyTransport({ level: 'debug' }),
  ],
});
```

### Reference

```typescript
function prettyTransport(options: { level: LogLevelType }): LogLayerTransport
```

> **Good to know:** This is the default transport when `pretty: true` (default). Use for development environments where human readability is preferred.

---

## structuredTransport

Creates a structured JSON console transport for log aggregation systems.

### Usage

```typescript
import { bootstrap, structuredTransport } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  transports: [
    structuredTransport({ level: 'info' }),
  ],
});
```

### Reference

```typescript
function structuredTransport(options: { level: LogLevelType }): LogLayerTransport
```

> **Good to know:** Use in production for log aggregation services (Datadog, Splunk, etc.). This is the default when `pretty: false`.

---

## Related

- [LogLayer Documentation](https://loglayer.dev) - Upstream library documentation
- [serialize-error](https://github.com/sindresorhus/serialize-error) - Error serialization
