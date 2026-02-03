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

import { getLogger } from '@accelint/logger';
import type { LogLevel } from '@accelint/logger';

const baseLogger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'error',
  pretty: true,
});

/**
 * Get a logger instance with an optional prefix.
 * Without a prefix, returns the base shared logger.
 * With a prefix, returns a child logger with that prefix.
 *
 * @param prefix - Optional prefix for log messages (e.g., '[Map]')
 * @returns A logger instance
 *
 * @example
 * ```typescript
 * import { logger } from '~/utils/logger';
 *
 * // Use base logger
 * logger().info('Application started');
 *
 * // Create domain-specific logger
 * const mapLogger = logger('[Map]');
 * mapLogger.info('Map initialized');
 * ```
 */
export function logger(prefix?: string) {
  if (!prefix) {
    return baseLogger;
  }
  return getLogger({
    enabled: process.env.NODE_ENV !== 'production',
    level: 'error',
    pretty: true,
    prefix,
  });
}

/**
 * Create a logger with a custom log level, optional prefix, and optional enabled condition.
 * Useful for test files that need debug or warn levels, or conditional logging.
 *
 * @param level - The log level to use
 * @param prefix - Optional prefix for log messages (e.g., '[Test]')
 * @param enabled - Optional custom enabled condition (defaults to NODE_ENV !== 'production')
 * @returns A logger instance configured with the specified settings
 *
 * @example
 * ```typescript
 * import { createLogger } from '~/utils/logger';
 *
 * // Debug logger with prefix
 * const logger = createLogger('debug', '[VRT:Static]');
 * logger.debug('Test started');
 *
 * // Conditionally enabled logger with prefix
 * const memlabLogger = createLogger('debug', '[MemLab]', !!process.env.DEBUG_MEMLAB);
 * ```
 */
export function createLogger(
  level: LogLevel = 'error',
  prefix?: string,
  enabled: boolean = process.env.NODE_ENV !== 'production',
) {
  return getLogger({
    enabled,
    level,
    pretty: true,
    ...(prefix && { prefix }),
  });
}
