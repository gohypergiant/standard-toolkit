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
import { OneWayLogLevelManager } from '@loglayer/log-level-manager-one-way';
import type { LogLevel } from '@accelint/logger';

const logger = getLogger({
  level: 'error',
  enabled: process.env.NODE_ENV !== 'production',
}).withLogLevelManager(new OneWayLogLevelManager());

/**
 * Create a child logger with module-specific context and log level.
 *
 * All child loggers inherit from a single base logger instance configured with
 * OneWayLogLevelManager, allowing per-child log level control while maintaining
 * a single underlying logger instance (important for transports like Pino).
 *
 * @param module - Module identifier for log messages (e.g., '[VRT:Static]', '[MemLab:Filters]')
 * @param level - Log level for this module ('trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal')
 * @returns A child logger instance with isolated context and specified log level
 *
 * @example
 * ```typescript
 * import { createLogger } from '~/utils/logger';
 *
 * // Error-only logger for component error boundaries
 * const errorLogger = createLogger('[Accordion]', 'error');
 * errorLogger.error('Component failed to render');
 *
 * // Debug logger for test utilities
 * const testLogger = createLogger('[VRT:Static]', 'debug');
 * testLogger.debug('Test started');
 * testLogger.info('Rendering component');
 * testLogger.warn('Unexpected selector format');
 *
 * // Warning logger for visual regression tests
 * const vrtLogger = createLogger('[VRT:Interactive]', 'warn');
 * vrtLogger.warn('No focusable elements found');
 * ```
 */
export function createLogger(module: string, level: LogLevel) {
  return logger.child().setLevel(level).withContext({ source: module });
}
