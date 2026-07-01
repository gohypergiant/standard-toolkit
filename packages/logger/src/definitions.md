---
title: Log Level Constants
description: Standard log level constants for logger configuration
source: definitions.ts
source_sha: 8c730bafc8068e25285e695c913ebefcfa3c344d
doc_sha: b5d57cff347c725cd461ce346d213e1308798cf4
deprecated: false
updated: 2026-05-28
---

# Log Level Constants

Standard log level constants for logger configuration.

## Usage

```typescript
import { getLogger, INFO, WARN, ERROR } from '@accelint/logger';

const logger = getLogger({ 
  level: process.env.NODE_ENV === 'production' ? WARN : INFO,
  enabled: true 
});
```

## Reference

```typescript
const TRACE: 'trace';
const DEBUG: 'debug';
const INFO: 'info';
const WARN: 'warn';
const ERROR: 'error';
const FATAL: 'fatal';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
```

### Available Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `TRACE` | `'trace'` | Fine-grained debugging information, more verbose than debug |
| `DEBUG` | `'debug'` | Detailed diagnostic information useful during development |
| `INFO` | `'info'` | General informational messages about application progress |
| `WARN` | `'warn'` | Potentially harmful situations that don't prevent execution |
| `ERROR` | `'error'` | Critical errors that require immediate attention |
| `FATAL` | `'fatal'` | Severe errors that may cause the application to terminate |

### Log Level Hierarchy

Log levels follow this hierarchy (most to least verbose):

```
TRACE > DEBUG > INFO > WARN > ERROR > FATAL
```

When you set a minimum log level, all levels at that severity and higher are output. For example, setting `level: WARN` outputs WARN, ERROR, and FATAL, but suppresses TRACE, DEBUG, and INFO.

## Examples

### Example: Environment-based log levels

```typescript
import { getLogger, DEBUG, INFO, WARN } from '@accelint/logger';

const getLogLevel = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return DEBUG;
    case 'staging':
      return INFO;
    case 'production':
      return WARN;
    default:
      return INFO;
  }
};

const logger = getLogger({
  enabled: true,
  level: getLogLevel(),
});

logger.debug('Detailed debugging'); // Only in development
logger.info('General information'); // Development and staging
logger.warn('Warning message'); // All environments
```

### Example: Feature flag debugging

```typescript
import { getLogger, DEBUG, INFO } from '@accelint/logger';

const debugEnabled = process.env.DEBUG === 'true';

const logger = getLogger({
  enabled: true,
  level: debugEnabled ? DEBUG : INFO,
});

logger.debug('This only appears when DEBUG=true');
logger.info('This always appears');
```

### Example: Module-specific log levels

```typescript
import { bootstrap, DEBUG, ERROR, INFO } from '@accelint/logger';

// Quiet logger for stable modules
const coreLogger = bootstrap({
  enabled: true,
  level: ERROR,
  prefix: '[Core]',
});

// Verbose logger for new features
const experimentalLogger = bootstrap({
  enabled: true,
  level: DEBUG,
  prefix: '[Experimental]',
});

coreLogger.debug('Not shown'); // Below ERROR threshold
experimentalLogger.debug('Shown'); // At DEBUG threshold
```

### Example: Using all log levels

```typescript
import { getLogger, DEBUG } from '@accelint/logger';

const logger = getLogger({ enabled: true, level: DEBUG });

logger.trace('Very detailed trace information');
logger.debug('Debug information for developers');
logger.info('General informational message');
logger.warn('Warning: potential issue detected');
logger.error('Error: operation failed', { error });
logger.fatal('Fatal: critical system failure');
```

### Example: Type-safe log level configuration

```typescript
import type { LogLevel } from '@accelint/logger';
import { getLogger } from '@accelint/logger';

function createLogger(level: LogLevel) {
  return getLogger({
    enabled: true,
    level, // Type-safe: only accepts valid log level strings
  });
}

const logger = createLogger('info'); // ✓ Valid
// const invalid = createLogger('verbose'); // ✗ Type error
```

### Example: Conditional logging with constants

```typescript
import { getLogger, TRACE, DEBUG } from '@accelint/logger';

const verbose = process.env.VERBOSE === 'true';

const logger = getLogger({
  enabled: true,
  level: verbose ? TRACE : DEBUG,
});

// Trace logs only when VERBOSE=true
logger.trace('Entering function', { params });
```

> **Good to know:** Log level constants are exported as typed string literals for type safety. The default log level is `DEBUG` if not specified. Using these constants instead of raw strings provides autocomplete support and prevents typos in log level configuration.

## Related

- [getLogger](./default/index.md) - Singleton logger factory
- [bootstrap](./default/bootstrap.md) - Direct logger initialization
