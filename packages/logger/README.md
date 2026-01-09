# @accelint/logger

A flexible and extensible logging utility built on [LogLayer](https://loglayer.dev/), with automatic callsite tracking and environment-aware capabilities.

## Installation

```sh
npm install @accelint/logger
```

## Usage

### Basic Setup

```ts
import { getLogger } from '@accelint/logger/default';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'test',
  level: 'warn',
  prefix: '[MyApp]',
  env: process.env.NODE_ENV as 'production' | 'development' | 'test',
});

// Log messages
logger.debug('Debug information', { userId: 123 });
logger.info('User logged in', { userId: 123 });
logger.warn('Rate limit approaching', { current: 95, max: 100 });
logger.error('Failed to connect', { service: 'database' });
```

### Configuration Options

| Option       | Type                                                         | Default         | Description                       |
| ------------ | ------------------------------------------------------------ | --------------- | --------------------------------- |
| `enabled` | `boolean` | required | Enable or disable logging output |
| `level` | `'debug' \| 'info' \| 'warn' \| 'error' \| 'trace' \| 'fatal'` | `'debug'` | Minimum log level to output |
| `prefix` | `string` | `''` | Prefix prepended to all log messages |
| `pretty` | `boolean` | `true` | Use pretty-printed console output |
| `env` | `'production' \| 'development' \| 'test'` | `'development'` | Environment context |
| `plugins` | `LogLayerPlugin[]` | `[]` | Additional LogLayer plugins |
| `transports` | `LogLayerTransport[]` | `[]` | Additional log transports |

### Singleton Pattern

The logger uses a singleton pattern. The first call to `getLogger()` creates the instance; subsequent calls return the same instance:

```ts
// First call creates the logger
const logger1 = getLogger({ enabled: true, level: 'debug' });

// Second call returns the same instance (options are ignored)
const logger2 = getLogger({ enabled: false, level: 'error' });

console.log(logger1 === logger2); // true
```

## Features

### Automatic Callsite Tracking

Every log entry automatically includes the source location where the log was called:

```ts
logger.warn('Something happened');
// Output includes: callSite: "src/services/user.ts:42:5"
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

### Error Serialization

Errors are automatically serialized with full stack traces:

```ts
try {
  throw new Error('Something went wrong');
} catch (error) {
  logger.error('Operation failed', { error });
}
```

## Plugins

### Callsite Plugin

Tracks and injects source code location into log data.

```ts
import { callsitePlugin } from '@accelint/logger/plugins/callsite';

const plugin = callsitePlugin({ isProductionEnv: false });
```

### Environment Plugin

Injects server/browser context into log data.

```ts
import { environmentPlugin } from '@accelint/logger/plugins/environment';

const plugin = environmentPlugin({
  isServer: typeof window === 'undefined',
  isProductionEnv: false,
});
```

## Custom Transports

Add custom transports for additional log destinations:

```ts
import { getLogger } from '@accelint/logger/default';
import { ConsoleTransport } from 'loglayer';

const customTransport = new ConsoleTransport({
  level: 'error',
  logger: console,
});

const logger = getLogger({
  enabled: true,
  transports: [customTransport],
});
```

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

## API Reference

### `getLogger(options: LoggerOptions): ILogLayer`

Returns a singleton LogLayer instance configured with the provided options.

### `callsitePlugin(options: CallsitePluginOptions): LogLayerPlugin`

Creates a plugin that tracks callsite information.

**Options:**

- `isProductionEnv: boolean` - Reserved for future use

### `environmentPlugin(options: EnvironmentPluginOptions): LogLayerPlugin`

Creates a plugin that tracks execution environment.

**Options:**

- `isServer: boolean` - Whether running in server context
- `isProductionEnv: boolean` - Reserved for future use

## Exports

The package provides multiple entry points:

```ts
// Main entry (re-exports all)
import { ... } from '@accelint/logger';

// Default logger factory
import { getLogger } from '@accelint/logger/default';

// Individual plugins
import { callsitePlugin } from '@accelint/logger/plugins/callsite';
import { environmentPlugin } from '@accelint/logger/plugins/environment';
```
