---
title: prettyTransport
description: Creates a pretty-printed console transport for log output
source: transports/pretty.ts
source_sha: b10bcd365cf46b823f3374af702cca7f13c5698f
doc_sha: c65f32eab42935f4351b5ca8ea924419c8a0a2b9
deprecated: false
updated: 2026-05-28
---

# prettyTransport

Creates a pretty-printed console transport for log output.

## Usage

```typescript
import { prettyTransport } from '@accelint/logger/transports/pretty';

const transport = prettyTransport({ level: 'debug' });
```

## Reference

```typescript
function prettyTransport(options: { level: LogLevel }): Transport
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `{ level: LogLevel }` | Transport configuration options |
| `options.level` | `LogLevel` | Minimum log level to output (`'trace' \| 'debug' \| 'info' \| 'warn' \| 'error' \| 'fatal'`) |

### Returns

Returns a configured LogLayer transport instance using the simple pretty terminal format with message-only view mode and browser runtime settings.

## Examples

### Example: Basic usage

```typescript
import { LogLayer } from 'loglayer';
import { prettyTransport } from '@accelint/logger/transports/pretty';

const logger = new LogLayer({
  transport: prettyTransport({ level: 'debug' }),
});

logger.info('User logged in', { userId: 'u-123' });
// Output: User logged in { userId: 'u-123' }
```

### Example: Multiple transports

```typescript
import { bootstrap, prettyTransport, structuredTransport } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  transports: [
    prettyTransport({ level: 'debug' }), // Human-readable console
    structuredTransport({ level: 'info' }), // JSON for log aggregation
  ],
});

logger.debug('Detailed debug info'); // Only in pretty transport
logger.info('Important event'); // In both transports
```

### Example: Development-only pretty logging

```typescript
import { bootstrap, prettyTransport, structuredTransport } from '@accelint/logger';

const isDev = process.env.NODE_ENV === 'development';

const logger = bootstrap({
  enabled: true,
  transports: isDev
    ? [prettyTransport({ level: 'debug' })]
    : [structuredTransport({ level: 'warn' })],
});
```

### Example: Custom log level filtering

```typescript
import { prettyTransport } from '@accelint/logger/transports/pretty';
import { LogLayer } from 'loglayer';

// Only show warnings and errors
const logger = new LogLayer({
  transport: prettyTransport({ level: 'warn' }),
});

logger.debug('Not shown'); // No output
logger.info('Not shown'); // No output
logger.warn('Shown'); // Output: Shown
logger.error('Shown'); // Output: Shown
```

> **Good to know:** The transport is configured with `viewMode: 'message-only'` for clean console output and `runtime: 'browser'` for consistent formatting across server and client contexts. The `includeDataInBrowserConsole` option is enabled to ensure metadata appears in browser developer tools.

## Related

- [structuredTransport](./structured.md) - JSON log output for production
- [bootstrap](../default/bootstrap.md) - Uses pretty transport by default
- [getLogger](../default/index.md) - Singleton logger configuration
