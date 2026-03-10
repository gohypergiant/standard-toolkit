# @accelint/logger

Structured logging built on [LogLayer](https://loglayer.dev/) with automatic callsite tracking and environment detection.

## What is @accelint/logger?

`@accelint/logger` is a thin wrapper around [LogLayer](https://loglayer.dev/) that bakes in sensible defaults for Accelint projects. Out of the box you get:

- **Callsite tracking** — every log entry includes the file and line where it was called
- **Environment detection** — logs note whether they came from the browser or server
- **Pretty-printed output** — readable in development, switchable to structured JSON for production pipelines
- **Error serialization** — errors include full stack traces via `serialize-error`
- **Singleton pattern** — configure once at startup, import everywhere else

It doesn't change LogLayer's API. Anything in the [LogLayer docs](https://loglayer.dev/) applies here.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Options](#configuration-options)
- [Log Levels](#log-levels)
- [API](#api)
  - [getLogger](#getlogger)
  - [Log Level Constants](#log-level-constants)
- [Examples](#examples)
  - [Adding Context and Metadata](#adding-context-and-metadata)
  - [Error Handling](#error-handling)
  - [Domain Loggers](#domain-loggers)
  - [Child Loggers](#child-loggers)
  - [React Error Boundaries](#react-error-boundaries)
  - [Custom Transports](#custom-transports)
  - [Custom Plugins](#custom-plugins)
  - [Testing](#testing)
- [Built-in Features](#built-in-features)
- [Further Reading](#further-reading)

## Installation

```sh
pnpm add @accelint/logger
```

TypeScript types are included — no separate `@types` package needed.

## Quick Start

Create a single logger instance in your app and import it everywhere else:

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger';

export const logger = getLogger({
  enabled: true,
  level: 'info',
  prefix: '[MyApp]',
  env: process.env.NODE_ENV as 'production' | 'development',
});
```

```ts
// ~/data-access/auth/server.ts
import { logger } from '~/utils/logger';

export function login(credentials: Credentials) {
  logger.info('User login attempt');
  // ...
}
```

`getLogger` returns a singleton — call it once at startup to configure it, then import the result wherever you need it. Don't call it in multiple files with different options; only the first call's options take effect.

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | required | Enable or disable all logging output |
| `level` | `LogLevel` | `'debug'` | Minimum log level to output |
| `prefix` | `string` | `''` | String prepended to all log messages |
| `pretty` | `boolean` | `true` | Use pretty-printed console output. Set to `false` for structured JSON |
| `env` | `'production' \| 'development'` | `'development'` | Environment context; affects whether callsite and environment data is included |
| `plugins` | `LogLayerPlugin[]` | `[]` | Additional LogLayer plugins applied after the built-in ones |
| `transports` | `LogLayerTransport[]` | `[]` | Additional transports alongside the default console output |
| `groups` | `LogGroupsConfig` | `{}` | Group-based routing for sending logs to specific transports |

## Log Levels

| Level | Method | Use case |
| --- | --- | --- |
| `trace` | `logger.trace()` | Fine-grained debugging, very verbose |
| `debug` | `logger.debug()` | Development debugging |
| `info` | `logger.info()` | General information about what the app is doing |
| `warn` | `logger.warn()` | Something looks wrong but execution continues |
| `error` | `logger.error()` | An operation failed |
| `fatal` | `logger.fatal()` | Critical failure, app likely needs to stop |

## API

### `getLogger`

```ts
function getLogger(opts: LoggerOptions): LogLayer
```

Returns a singleton `LogLayer` instance. The first call initializes the logger with the provided options. Every call after that returns the same instance regardless of what options you pass.

```ts
import { getLogger } from '@accelint/logger';

export const logger = getLogger({
  enabled: true,
  level: 'info',
});
```

**Returns:** `LogLayer` — see the [LogLayer docs](https://loglayer.dev/) for the full instance API, including `withContext`, `withMetadata`, `withError`, `child`, `withPrefix`, and more.

---

### Log Level Constants

String constants for each log level, exported for use where you need to reference a level programmatically rather than with a string literal:

```ts
import { DEBUG, INFO, WARN, ERROR, TRACE, FATAL } from '@accelint/logger';
import type { LogLevel } from '@accelint/logger';

const logger = getLogger({ enabled: true, level: WARN });
```

| Constant | Value |
| --- | --- |
| `TRACE` | `'trace'` |
| `DEBUG` | `'debug'` |
| `INFO` | `'info'` |
| `WARN` | `'warn'` |
| `ERROR` | `'error'` |
| `FATAL` | `'fatal'` |

The `LogLevel` type is also exported and maps to `LogLevelType` from `@loglayer/shared`.

## Examples

### Adding Context and Metadata

Context persists across all logs on a logger instance. Metadata is scoped to a single log entry.

```ts
import { logger } from '~/utils/logger';

// Context: carried through all subsequent logs on this instance
const requestLogger = logger.withContext({
  requestId: req.id,
  path: req.path,
  method: req.method,
});

requestLogger.info('Request received');
await processRequest(req);
requestLogger.info('Request completed');

// Metadata: attached to this one log entry only
logger.withMetadata({ amount: payment.amount, currency: payment.currency }).info('Processing payment');
```

Combining both:

```ts
const orderLogger = logger.withContext({ orderId: '12345', userId: 'user_789' });

orderLogger.withMetadata({ step: 'validation' }).info('Validating order');
orderLogger.withMetadata({ step: 'payment' }).info('Processing payment');
orderLogger.withMetadata({ step: 'fulfillment' }).info('Order fulfilled');
```

---

### Error Handling

Pass errors via `withError()` before the log level call. They're serialized with full stack traces automatically.

```ts
import { logger } from '~/utils/logger';

try {
  await riskyOperation();
} catch (error) {
  logger.withError(error).error('Operation failed');
}
```

With context:

```ts
async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    return await response.json();
  } catch (error) {
    logger
      .withContext({ userId, endpoint: '/api/users' })
      .withError(error)
      .error('User fetch failed');
    throw error;
  }
}
```

---

### Domain Loggers

For larger apps, it's useful to give each module its own prefixed logger so you can tell at a glance which part of the codebase a log came from. `withPrefix()` returns a child logger with the prefix pre-applied — you don't need to manage separate instances or thread loggers through function arguments.

Create a small utility for this:

```ts
// ~/utils/logger/domain.ts
import { logger } from '~/utils/logger';
import type { LogLevel } from '@accelint/logger';

export function createLoggerDomain(prefix: string, level?: LogLevel) {
  const child = logger.withPrefix(prefix);

  if (level) {
    child.setLevel(level);
  }

  return child;
}
```

Then use it per module:

```ts
// ~/data-access/payments/server.ts
import { createLoggerDomain } from '~/utils/logger/domain';

const log = createLoggerDomain('[Payments]');

export async function processPayment(payment: Payment) {
  log.info('Processing payment', payment.id);
  // Output: [Payments] Processing payment abc123
}
```

You can suppress noisy log levels in specific modules by passing a level:

```ts
// ~/data-access/auth/server.ts
import { createLoggerDomain } from '~/utils/logger/domain';

const log = createLoggerDomain('[Auth]', 'warn'); // debug and info are suppressed

export async function login(credentials: Credentials) {
  log.debug('Login attempt'); // suppressed
  log.warn('Rate limit approaching for user', credentials.username);
}
```

Each domain logger is a child of the root logger. They inherit the root's context but have independent prefixes and level settings.

---

### Child Loggers

If you want module-specific context without a prefix, use `logger.child()`. Child loggers inherit the parent's configuration and any context set on the parent at the time `child()` is called, then maintain independent context after that.

```ts
// ~/data-access/users/server.ts
import { logger } from '~/utils/logger';

const userLogger = logger.child().withContext({
  module: 'data-access',
  domain: 'users',
});

export async function fetchUser(id: string) {
  userLogger.info('Fetching user', id);

  try {
    const user = await db.users.findOne(id);
    userLogger.info('User fetched successfully');
    return user;
  } catch (error) {
    userLogger.withError(error).error('Failed to fetch user');
    throw error;
  }
}
```

Adding context to `userLogger` won't affect the parent `logger`, and vice versa.

---

### React Error Boundaries

```tsx
'use client';
import 'client-only';
import { logger } from '~/utils/logger';
import { ErrorBoundary } from 'react-error-boundary';
import type { ErrorInfo, PropsWithChildren } from 'react';

function onError(err: Error, info: ErrorInfo) {
  logger
    .withContext({ componentStack: info.componentStack })
    .withError(err)
    .error('React error boundary caught error');
}

export function ErrorComponent({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary fallback={<div>Error</div>} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
```

---

### Custom Transports

Add transports to ship logs to external destinations alongside the default console output.

#### OpenTelemetry

```bash
pnpm add @loglayer/transport-opentelemetry
```

```ts
import { getLogger } from '@accelint/logger';
import { OpenTelemetryTransport } from '@loglayer/transport-opentelemetry';

export const logger = getLogger({
  enabled: true,
  level: 'info',
  transports: [
    new OpenTelemetryTransport({
      level: 'info',
      enabled: process.env.NODE_ENV === 'production',
      onError: (error) => console.error('OpenTelemetry error:', error),
    }),
  ],
});
```

When used alongside OpenTelemetry instrumentation, the transport automatically includes trace IDs and span IDs on each log entry.

---

### Custom Plugins

Plugins let you intercept and transform log data before it reaches a transport. This example prepends a timestamp to every message:

```ts
// ~/utils/logger/plugins/timestamp.ts
import type { LogLayerPlugin, PluginBeforeMessageOutParams } from 'loglayer';

export interface TimestampPluginOptions {
  format?: 'iso' | 'locale';
}

export function timestampPlugin(options: TimestampPluginOptions = {}): LogLayerPlugin {
  return {
    onBeforeMessageOut({ messages }: PluginBeforeMessageOutParams) {
      const timestamp =
        options.format === 'locale' ? new Date().toLocaleString() : new Date().toISOString();

      return messages.map((msg) => `[${timestamp}] ${msg}`);
    },
  };
}
```

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger';
import { timestampPlugin } from './plugins/timestamp';

export const logger = getLogger({
  enabled: true,
  level: 'info',
  plugins: [timestampPlugin({ format: 'iso' })],
});
```

See the [LogLayer plugin docs](https://loglayer.dev/plugins/) for available hooks and what each can intercept.

---

### Testing

LogLayer ships a `MockLogLayer` that matches the full logger API but does nothing. Use it in unit tests to silence log output and optionally assert log calls.

```ts
import { MockLogLayer } from 'loglayer';

vi.mock('~/utils/logger', () => ({
  logger: new MockLogLayer(),
}));
```

See the [LogLayer testing docs](https://loglayer.dev/test-logging.html) for the full `MockLogLayer` API.

## Built-in Features

### Callsite Tracking

Every log entry automatically includes the source file and line number:

```ts
logger.warn('Something happened');
// Output includes: callSite: "src/data-access/users/server.ts:42:5"
```

### Environment Detection

Logs include a `server` field showing where they came from:

```ts
logger.info('Request received');
// Output includes: server: true  (or false in the browser)
```

### Pretty Printing

Development output is formatted for readability. Switch to structured JSON for log aggregation:

```ts
// Pretty output (default)
const logger = getLogger({ enabled: true, pretty: true });

// Structured JSON
const logger = getLogger({ enabled: true, pretty: false });
```

## Further Reading

- [LogLayer Documentation](https://loglayer.dev/)
- [Available transports](https://loglayer.dev/transports/) — Pino, Winston, DataDog, AWS CloudWatch, and more
- [Plugin API](https://loglayer.dev/plugins/) — filter, redact, and enrich log data
- [Group-based routing](https://loglayer.dev/logging-api/groups.html) — route logs to different transports by tag
- [Child loggers](https://loglayer.dev/logging-api/child-loggers) — inherit configuration and context across modules
