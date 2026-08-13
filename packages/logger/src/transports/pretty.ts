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

import { getSimplePrettyTerminal } from '@loglayer/transport-simple-pretty-terminal';
import type { LogLevel } from '../definitions';

/** Configuration props for {@link prettyTransport}. */
type PrettyTransportProps = {
  level: LogLevel;
};

/**
 * Creates a pretty-printed console transport for log output.
 *
 * Configures the simple pretty terminal transport with `message-only` view mode
 * and browser runtime for consistent output across server and client contexts.
 *
 * @param options - Transport configuration options
 * @param options.level - Minimum log level to output
 * @returns A configured LogLayer transport instance
 *
 * @example
 * ```typescript
 * import { prettyTransport } from '@accelint/logger/transports/pretty';
 *
 * const transport = prettyTransport({ level: 'debug' });
 * ```
 */
export function prettyTransport({ level }: PrettyTransportProps) {
  return getSimplePrettyTerminal({
    viewMode: 'message-only',
    level,
    // NOTE: this gives us a nice balance even on the server
    runtime: 'browser',
    includeDataInBrowserConsole: true,
  });
}
