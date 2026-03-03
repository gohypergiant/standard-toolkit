/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { bootstrap } from './bootstrap';
import type { LogLayer } from 'loglayer';
import type { LoggerOptions } from '../definitions';

let logInstance: LogLayer | undefined;

/**
 * Returns a singleton LogLayer logger instance.
 *
 * The first call creates and configures the logger with the provided options.
 * Subsequent calls return the same instance, ignoring any new options.
 *
 * The logger is automatically configured with:
 * - Callsite tracking plugin (adds source location to log data)
 * - Environment plugin (adds server/browser context to log data)
 * - Error serialization via serialize-error
 *
 * @param opts - Logger configuration options
 * @param opts.enabled - Whether logging is active; `false` makes all calls no-ops
 * @param opts.level - Minimum log level to output (default: `'debug'`)
 * @param opts.env - Runtime environment; controls server detection (default: `'development'`)
 * @param opts.pretty - Use pretty console output; `false` emits structured JSON (default: `true`)
 * @param opts.prefix - String prepended to all log messages (default: `''`)
 * @param opts.plugins - Additional plugins applied after the built-in ones
 * @param opts.transports - Additional transports applied alongside the console transport
 * @param opts.groups - Named group configuration for conditional group logging
 * @returns A configured LogLayer instance
 *
 * @example
 * ```typescript
 * const logger = getLogger({
 *   enabled: true,
 *   env: process.env.NODE_ENV as 'production' | 'development',
 *   level: 'warn',
 *   prefix: '[MyApp]',
 * });
 *
 * logger.withMetadata({ userId: 123 }).info('User logged in');
 * ```
 */
export function getLogger(opts: LoggerOptions) {
  if (!logInstance) {
    logInstance = bootstrap(opts);
  }

  return logInstance;
}
