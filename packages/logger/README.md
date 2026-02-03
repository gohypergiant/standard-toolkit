# @accelint/logger

A logging utility built on [LogLayer](https://loglayer.dev/) with automatic callsite tracking and environment detection. Defaults to `stdout` for log transport to accommodate our most common scenario across products.

## Installation

```sh
npm install @accelint/logger
# or
pnpm install @accelint/logger
```

## Quick Start

Create a single logger instance in `~/utils/logger/index.ts` and import it throughout your application:

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger';

export const logger = getLogger({
  enabled: true, // could disable based on NODE_ENV
  level: 'info', 
  prefix: '[MyApp]',
  env: process.env.NODE_ENV as 'production' | 'development',
});
```

```ts
// ~/data-access/auth/server.ts
import { logger } from '~/utils/logger';

export function login(credentials: Credentials) {
  // All log methods accept multiple parameters, which can be strings, booleans, numbers, null, or undefined
  logger.info('User login attempt');
  // Login logic...
}
```

This approach:

- Centralizes logging configuration in one place
- Prevents accidental reconfiguration throughout the codebase
- Makes it easy to add transports and plugins globally
- Allows child loggers to inherit consistent settings

Avoid calling `getLogger()` in multiple files. Instead, import the configured logger instance.


## Configuration Options

| Option       | Type                                                         | Default         | Description                       |
| ------------ | ------------------------------------------------------------ | --------------- | --------------------------------- |
| `enabled` | `boolean` | required | Enable or disable logging output |
| `level` | `'debug' \| 'info' \| 'warn' \| 'error' \| 'trace' \| 'fatal'` | `'debug'` | Minimum log level to output |
| `prefix` | `string` | `''` | Prefix prepended to all log messages |
| `pretty` | `boolean` | `true` | Use pretty-printed console output |
| `env` | `'production' \| 'development' \| 'test'` | `'development'` | Environment context |
| `plugins` | `LogLayerPlugin[]` | `[]` | Additional LogLayer plugins |
| `transports` | `LogLayerTransport[]` | `[]` | Additional log transports |

## Log Levels

The following log levels are available, in order of severity:

| Level   | Method           | Use Case               |
| ------- | ---------------- | ---------------------- |
| `trace` | `logger.trace()` | Fine-grained debugging |
| `debug` | `logger.debug()` | Development debugging |
| `info` | `logger.info()` | General information |
| `warn` | `logger.warn()` | Warning conditions |
| `error` | `logger.error()` | Error conditions |
| `fatal` | `logger.fatal()` | Critical failures |

## Working with Metadata and Context

### Adding Context Data

Context data persists across all subsequent log calls. Use it for request-scoped or execution-scoped data.

```ts
import { logger } from '~/utils/logger';

export async function handleRequest(req: Request) {
  // Add request ID to all logs within this function
  const requestLogger = logger.withContext({
    requestId: req.id,
    path: req.path,
    method: req.method
  });

  requestLogger.info('Request received');
  await processRequest(req);
  requestLogger.info('Request completed');
}
```

### Adding Metadata

Metadata is specific to individual log entries. Use it for data that changes with each log.

```ts
import { logger } from '~/utils/logger';

export function processPayment(payment: Payment) {
  logger.withMetadata({
    amount: payment.amount,
    currency: payment.currency,
    paymentMethod: payment.method
  }).info('Processing payment');
}
```

### Combining Context and Metadata

```ts
// Context persists across logs
const orderLogger = logger.withContext({
  orderId: '12345',
  userId: 'user_789'
});

// Metadata is specific to each log entry
orderLogger.withMetadata({ step: 'validation' }).info('Validating order');
orderLogger.withMetadata({ step: 'payment' }).info('Processing payment');
orderLogger.withMetadata({ step: 'fulfillment' }).info('Order fulfilled');
```

## Error Handling

Errors are automatically serialized with full stack traces.

### Basic Error Logging

```ts
import { logger } from '~/utils/logger';

try {
  await riskyOperation();
} catch (error) {
  logger.withError(error).error('Operation failed');
}
```

### Error Logging with Context

```ts
import { logger } from '~/utils/logger';

async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
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
    .error('React error boundary caught error')
}

function Fallback() {
  return <div>Error</div>;
}

export function ErrorComponent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <ErrorBoundary fallback={<Fallback />} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}
```

## Child Loggers

Child loggers inherit configuration from the parent but maintain independent context. Use them to add module-specific metadata without affecting the parent logger.

```ts
// ~/data-access/users/server.ts
import { logger } from '~/utils/logger';

// Create a child logger with persistent context for API operations
const apiLogger = logger.child().withContext({
  module: 'data-access',
  domain: 'users'
});

export async function fetchUser(id: string) {
  // Logs include module: 'api' and service: 'user' automatically
  apiLogger.info('Fetching user', id);

  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    apiLogger.info('User fetched successfully');
    return user;
  } catch (error) {
    apiLogger.withError(error).error('Failed to fetch user');
    throw error;
  }
}
```

Each child logger has isolated context. Adding context to `apiLogger` doesn't affect the parent `logger`.

## Built-in Features

### Automatic Callsite Tracking

Every log entry automatically includes the source location where the log was called:

```ts
logger.warn('Something happened');
// Output includes: callSite: "src/data-access/users/server.ts:42:5"
```

### Environment Detection

Logs automatically include whether code is running in a server or browser context:

```ts
logger.info('Request received');
// Output includes: server: true (or false in browser)
```

### Pretty Printing

By default, logs are formatted for readability. Disable for structured JSON output:

```ts
// Pretty output (default)
const logger = getLogger({ enabled: true, pretty: true });

// Structured JSON output
const logger = getLogger({ enabled: true, pretty: false });
```

## Custom Transports

Add custom transports to send logs to external services or custom destinations.

### Using Built-in Transports

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger';
import { ConsoleTransport } from 'loglayer';

// Add a separate error-only transport
const errorTransport = new ConsoleTransport({
  level: 'error',
  logger: console,
});

export const logger = getLogger({
  enabled: true,
  level: 'info',
  transports: [errorTransport],
});
```

### OpenTelemetry Transport

Send logs to OpenTelemetry-compatible observability platforms:

```bash
npm install @loglayer/transport-opentelemetry
# or
pnpm install @loglayer/transport-opentelemetry
```

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger';
import { OpenTelemetryTransport } from '@loglayer/transport-opentelemetry';

export const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'test',
  level: 'info',
  transports: [
    new OpenTelemetryTransport({
      level: 'info',
      enabled: process.env.NODE_ENV === 'production',
      onError: (error) => console.error('OpenTelemetry error:', error),
      consoleDebug: process.env.DEBUG === 'true',
    }),
  ],
});
```

The OpenTelemetry transport integrates with the OpenTelemetry Logs SDK and automatically includes trace IDs and span IDs when used with OpenTelemetry instrumentation.

## Custom Plugins

Create plugins to transform, enrich, or filter logs.

### Creating Custom Plugins

Create a plugin to add timestamps to messages:

```ts
// ~/utils/logger/plugins/timestamp.ts
import type { LogLayerPlugin, PluginBeforeMessageOutParams } from 'loglayer';

export interface TimestampPluginOptions {
  format?: 'iso' | 'locale';
}

export function timestampPlugin(
  options: TimestampPluginOptions = {}
): LogLayerPlugin {
  return {
    onBeforeMessageOut({ messages }: PluginBeforeMessageOutParams) {
      const timestamp =
        options.format === 'locale'
          ? new Date().toLocaleString()
          : new Date().toISOString();

      return messages.map((msg) => `[${timestamp}] ${msg}`);
    },
  };
}
```

```ts
// ~/utils/logger/index.ts
import { getLogger } from '@accelint/logger/default';
import { timestampPlugin } from './plugins/timestamp';

export const logger = getLogger({
  enabled: true,
  level: 'info',
  plugins: [timestampPlugin({ format: 'iso' })],
});
```

---

## Additional Resources

- [LogLayer Documentation](https://loglayer.dev/)
