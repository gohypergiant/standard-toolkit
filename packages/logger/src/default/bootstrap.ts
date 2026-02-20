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

import { OneWayLogLevelManager } from '@loglayer/log-level-manager-one-way';
import { getSimplePrettyTerminal } from '@loglayer/transport-simple-pretty-terminal';
import { LogLayer, StructuredTransport } from 'loglayer';
import { serializeError } from 'serialize-error';
import { callsitePlugin } from '../plugins/callsite';
import { environmentPlugin } from '../plugins/environment';
import type { LoggerOptions } from '../definitions';

/**
 * Initializes and configures a LogLayer instance with default plugins and transports.
 *
 * Creates a logger with pre-configured callsite tracking, environment detection,
 * and error serialization. Supports both pretty-printed and structured JSON output.
 *
 * Built-in plugins are applied in this order before any user-supplied plugins:
 * 1. `callsitePlugin` — injects source file location into every log entry
 * 2. `environmentPlugin` — injects server/browser context into every log entry
 *
 * The returned instance uses a one-way log level manager: the level can only be
 * raised (made more restrictive) after initialization, never lowered.
 *
 * @param options - Logger configuration options
 * @param options.enabled - Whether logging is active; `false` makes all calls no-ops
 * @param options.level - Minimum log level to output (default: `'debug'`)
 * @param options.env - Runtime environment; controls server detection (default: `'development'`)
 * @param options.pretty - Use pretty console output; `false` emits structured JSON (default: `true`)
 * @param options.prefix - String prepended to all log messages (default: `''`)
 * @param options.plugins - Additional plugins applied after the built-in ones
 * @param options.transports - Additional transports applied alongside the console transport
 * @param options.groups - Named group configuration for conditional group logging
 * @returns A configured LogLayer instance
 *
 * @example
 * ```typescript
 * import { bootstrap } from '@accelint/logger';
 *
 * // Create a logger for a specific module (bypasses the singleton)
 * const logger = bootstrap({
 *   enabled: true,
 *   level: 'warn',
 *   env: process.env.NODE_ENV as 'production' | 'development',
 *   prefix: '[MyApp]',
 * });
 *
 * logger.withMetadata({ userId: 'u-123' }).warn('Token expiring soon');
 * ```
 */
export function bootstrap({
  enabled,
  plugins = [],
  transports = [],
  level = 'debug',
  env = 'development',
  groups = {},
  pretty = true,
  prefix = '',
}: LoggerOptions) {
  const isProductionEnv = env === 'production';
  const isServer = typeof window === 'undefined';

  const instance = new LogLayer({
    errorSerializer: serializeError,
    transport: [
      pretty
        ? getSimplePrettyTerminal({
            viewMode: 'message-only',
            level,
            // NOTE: this gives us a nice balance even on the server
            runtime: 'browser',
            includeDataInBrowserConsole: true,
          })
        : new StructuredTransport({
            level,
            logger: console,
          }),
      ...transports,
    ],
    plugins: [
      callsitePlugin({ isProductionEnv }),
      environmentPlugin({ isProductionEnv, isServer }),
      ...plugins,
    ],
    groups,
    enabled,
    prefix,
  });

  instance.withLogLevelManager(new OneWayLogLevelManager());

  return instance;
}
