---
title: structuredTransport
description: Creates a structured JSON log transport for log output
source: transports/structured.ts
source_sha: b987461bdab33a6d2c5563c2936d4b0dba79b026
doc_sha: 1e55c9476f8a17c47a2fab878bde6504738add78
deprecated: false
updated: 2026-05-28
---

# structuredTransport

Creates a structured JSON log transport for log output.

## Usage

```typescript
import { structuredTransport } from '@accelint/logger/transports/structured';

const transport = structuredTransport({ level: 'info' });
```

## Reference

```typescript
function structuredTransport(options: { level: LogLevel }): StructuredTransport
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | `{ level: LogLevel }` | Transport configuration options |
| `options.level` | `LogLevel` | Minimum log level to output (`'trace' \| 'debug' \| 'info' \| 'warn' \| 'error' \| 'fatal'`) |

### Returns

Returns a configured LogLayer StructuredTransport that emits JSON-formatted log entries to `console`. Use when machine-readable log output is needed for production log aggregation pipelines.

## Examples

### Example: Production logging

```typescript
import { bootstrap, structuredTransport } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  transports: [structuredTransport({ level: 'info' })],
});

logger.info('User created', { userId: 'u-123', email: 'user@example.com' });
// Output: {"level":"info","message":"User created","userId":"u-123","email":"user@example.com"}
```

### Example: Environment-based transport selection

```typescript
import { bootstrap, prettyTransport, structuredTransport } from '@accelint/logger';

const isProd = process.env.NODE_ENV === 'production';

const logger = bootstrap({
  enabled: true,
  transports: isProd
    ? [structuredTransport({ level: 'warn' })]
    : [prettyTransport({ level: 'debug' })],
});

// Development: pretty console output
// Production: JSON for log aggregation
logger.info('Application started');
```

### Example: Dual transport for debugging

```typescript
import { bootstrap, prettyTransport, structuredTransport } from '@accelint/logger';

const logger = bootstrap({
  enabled: true,
  transports: [
    prettyTransport({ level: 'debug' }), // Human-readable
    structuredTransport({ level: 'error' }), // JSON errors only
  ],
});

logger.debug('Detailed debug'); // Pretty output only
logger.error('Critical error'); // Both pretty and JSON output
```

### Example: Log aggregation pipeline

```typescript
import { structuredTransport } from '@accelint/logger/transports/structured';
import { LogLayer } from 'loglayer';

const logger = new LogLayer({
  transport: structuredTransport({ level: 'info' }),
});

// JSON output suitable for:
// - CloudWatch Logs
// - Datadog
// - Elasticsearch
// - Splunk
logger.info('Request processed', {
  requestId: 'req-123',
  duration: 42,
  statusCode: 200,
});
// {"level":"info","message":"Request processed","requestId":"req-123","duration":42,"statusCode":200}
```

### Example: Custom log level filtering

```typescript
import { structuredTransport } from '@accelint/logger/transports/structured';
import { LogLayer } from 'loglayer';

// Only warnings and above
const logger = new LogLayer({
  transport: structuredTransport({ level: 'warn' }),
});

logger.info('Not shown'); // No output
logger.warn('Warning message'); // JSON output
logger.error('Error message'); // JSON output
```

> **Good to know:** The transport uses LogLayer's StructuredTransport configured to emit to `console` for seamless integration with containerized environments and cloud logging services. All log metadata, including custom properties added via `withMetadata()`, is serialized to JSON.

## Related

- [prettyTransport](./pretty.md) - Human-readable console output
- [bootstrap](../default/bootstrap.md) - Configurable transport selection
- [getLogger](../default/index.md) - Singleton logger configuration
