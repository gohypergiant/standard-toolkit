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

/**
 * Create a logger instance with optional prefix, log level, and enabled condition.
 *
 * @param prefix - Optional prefix for log messages (e.g., '[Map]', '[VRT:Static]')
 * @param level - Log level to use (defaults to 'error')
 * @param enabled - Custom enabled condition (defaults to NODE_ENV !== 'production')
 * @returns A logger instance configured with the specified settings
 *
 * @example
 * ```typescript
 * import { createLogger } from '~/utils/logger';
 *
 * // Simple logger with prefix (error level by default)
 * const mapLogger = createLogger('[Map]');
 * mapLogger.error('Map failed to load');
 *
 * // Debug logger with prefix
 * const testLogger = createLogger('[VRT:Static]', 'debug');
 * testLogger.debug('Test started');
 *
 * // Conditionally enabled logger
 * const memlabLogger = createLogger('[MemLab]', 'debug', !!process.env.DEBUG_MEMLAB);
 * memlabLogger.debug('Memory snapshot taken');
 *
 * // Base logger without prefix
 * const logger = createLogger();
 * logger.info('Application started');
 * ```
 */
export function createLogger(
  prefix?: string,
  level: LogLevel = 'error',
  enabled: boolean = process.env.NODE_ENV !== 'production',
) {
  return getLogger({
    enabled,
    level,
    pretty: true,
    ...(prefix && { prefix }),
  });
}
