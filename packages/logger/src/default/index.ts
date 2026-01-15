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
import type { LogLayer, LogLevel } from 'loglayer';
import type { LoggerOptions } from '../definitions';

let logInstance: LogLayer;

type LogLevelType = LogLevel | `${LogLevel}`;

export type { LogLevel, LogLevelType };

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
 * @param opts - Configuration options for the logger
 * @returns A configured LogLayer instance
 *
 * @example
 * ```ts
 * const logger = getLogger({
 *   enabled: process.env.NODE_ENV !== 'test',
 *   level: 'warn',
 *   prefix: '[MyApp]',
 * });
 *
 * logger.info('User logged in', { userId: 123 });
 * ```
 */
export function getLogger(opts: LoggerOptions): LogLayer {
  if (!logInstance) {
    logInstance = bootstrap(opts);
  }

  return logInstance;
}
