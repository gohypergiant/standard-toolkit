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
import type { LoggerOptions } from '@accelint/logger';

const logger = getLogger({
  level: process.env.NODE_ENV === 'production'
  ? 'error'
  : 'debug',
  enabled: true,
});

/**
 * Creates a child logger with module-specific context for organized log output.
 *
 * Each child logger can have its own log level threshold while sharing a single
 * underlying logger instance. This allows fine-grained verbosity control per
 * module without duplicating transport connections.
 *
 * @param module - Module identifier prepended to all log messages for filtering and debugging
 * @param level - Optional log level threshold; only messages at this level or higher are output
 * @returns Logger instance with standard logging methods (trace, debug, info, warn, error, fatal)
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
export function createLogger(module: string, level?: LoggerOptions['level']) {
  const child = logger.child();

  if (level) {
    child.setLevel(level);
  }

  return child.withContext({ source: module });
}
