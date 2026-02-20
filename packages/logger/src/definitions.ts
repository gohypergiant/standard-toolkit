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

import type {
  LogGroupsConfig,
  LogLayerPlugin,
  LogLayerTransport,
  LogLevelType,
} from '@loglayer/shared';

/**
 * Configuration options for the logger.
 */
export type LoggerOptions = {
  /**
   * Whether logging is enabled. When false, all log calls are no-ops.
   * Reference: https://loglayer.dev/configuration.html#logging-control
   */
  enabled: boolean;
  /**
   * Additional LogLayer plugins to apply.
   * These are applied after the default callsite and environment plugins.
   * Reference: https://loglayer.dev/configuration.html#plugin-system
   */
  plugins?: LogLayerPlugin[];
  /**
   * Additional log transports for custom log destinations.
   * These are applied alongside the default console transport.
   * Reference: https://loglayer.dev/configuration.html#transport-configuration
   */
  transports?: LogLayerTransport[];

  /**
   * Named log groups configuration for conditional group-level logging.
   * Allows enabling or disabling entire categories of log calls by name.
   * Reference: https://loglayer.dev/logging-api/groups.html
   */
  groups?: LogGroupsConfig;
  /**
   * Minimum log level to output.
   * Reference: https://loglayer.dev/logging-api/adjusting-log-levels.html
   * @default 'debug'
   */
  level?: LogLevelType;
  /**
   * Whether to use pretty-printed console output.
   * When false, outputs structured JSON.
   * @default true
   */
  pretty?: boolean;
  /**
   * Prefix string prepended to all log messages.
   * Reference: https://loglayer.dev/configuration.html#message-prefixing
   * @default ''
   */
  prefix?: string;
  /**
   * Environment context for the logger. Should reference process.env.NODE_ENV.
   * @default 'development'
   */
  env?: 'production' | 'development';
};

/**
 * The log level type accepted by logger configuration.
 * One of: `'trace'`, `'debug'`, `'info'`, `'warn'`, `'error'`, `'fatal'`.
 */
export type { LogLevelType as LogLevel };

/**
 * Log level constant for error messages.
 *
 * Use for critical errors that require immediate attention.
 *
 * @example
 * ```typescript
 * import { getLogger, ERROR } from '@accelint/logger';
 *
 * const logger = getLogger({ level: ERROR, enabled: true });
 * ```
 */
export const ERROR: LogLevelType = 'error';

/**
 * Log level constant for warning messages.
 *
 * Use for potentially harmful situations that don't prevent execution.
 *
 * @example
 * ```typescript
 * import { getLogger, WARN } from '@accelint/logger';
 *
 * const logger = getLogger({ level: WARN, enabled: true });
 * ```
 */
export const WARN: LogLevelType = 'warn';

/**
 * Log level constant for informational messages.
 *
 * Use for general informational messages about application progress.
 *
 * @example
 * ```typescript
 * import { getLogger, INFO } from '@accelint/logger';
 *
 * const logger = getLogger({ level: INFO, enabled: true });
 * ```
 */
export const INFO: LogLevelType = 'info';

/**
 * Log level constant for debug messages.
 *
 * Use for detailed diagnostic information useful during development.
 *
 * @example
 * ```typescript
 * import { getLogger, DEBUG } from '@accelint/logger';
 *
 * const logger = getLogger({ level: DEBUG, enabled: true });
 * ```
 */
export const DEBUG: LogLevelType = 'debug';

/**
 * Log level constant for trace messages.
 *
 * Use for fine-grained debugging information, more verbose than debug.
 *
 * @example
 * ```typescript
 * import { getLogger, TRACE } from '@accelint/logger';
 *
 * const logger = getLogger({ level: TRACE, enabled: true });
 * ```
 */
export const TRACE: LogLevelType = 'trace';

/**
 * Log level constant for fatal error messages.
 *
 * Use for severe errors that may cause the application to terminate.
 *
 * @example
 * ```typescript
 * import { getLogger, FATAL } from '@accelint/logger';
 *
 * const logger = getLogger({ level: FATAL, enabled: true });
 * ```
 */
export const FATAL: LogLevelType = 'fatal';
