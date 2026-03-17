/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { StructuredTransport } from 'loglayer';
import type { LogLevel } from '../definitions';

/** Configuration props for {@link structuredTransport}. */
type StructuredTransportProps = {
  level: LogLevel;
};

/**
 * Creates a structured JSON log transport for log output.
 *
 * Configures LogLayer's StructuredTransport to emit JSON-formatted log entries
 * to `console`. Use when machine-readable log output is needed (e.g., production
 * log aggregation pipelines).
 *
 * @param options - Transport configuration options
 * @param options.level - Minimum log level to output
 * @returns A configured LogLayer transport instance
 *
 * @example
 * ```typescript
 * import { structuredTransport } from '@accelint/logger/transports/structured';
 *
 * const transport = structuredTransport({ level: 'info' });
 * ```
 */
export function structuredTransport({
  level,
}: StructuredTransportProps): StructuredTransport {
  return new StructuredTransport({
    level,
    logger: console,
  });
}
