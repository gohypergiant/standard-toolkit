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

import type { LogLayerPlugin, LogLayerTransport } from 'loglayer';

/**
 * Configuration options for the logger.
 */
export type LoggerOptions = {
  /**
   * Whether logging is enabled. When false, all log calls are no-ops.
   */
  enabled: boolean;
  /**
   * Additional LogLayer plugins to apply.
   * These are applied after the default callsite and environment plugins.
   */
  plugins?: LogLayerPlugin[];
  /**
   * Additional log transports for custom log destinations.
   * These are applied alongside the default console transport.
   */
  transports?: LogLayerTransport[];
  /**
   * Minimum log level to output.
   * @default 'debug'
   */
  level?: LogLevel;
  /**
   * Whether to use pretty-printed console output.
   * When false, outputs structured JSON.
   * @default true
   */
  pretty?: boolean;
  /**
   * Prefix string prepended to all log messages.
   * @default ''
   */
  prefix?: string;
  /**
   * Environment context for the logger.
   * @default 'development'
   */
  env?: 'production' | 'development' | 'test';
};

export const LOG_LEVEL = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  trace: 'trace',
  fatal: 'fatal',
} as const;

export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export const ERROR = LOG_LEVEL.error;
export const WARN = LOG_LEVEL.warn;
export const INFO = LOG_LEVEL.info;
export const DEBUG = LOG_LEVEL.debug;
export const TRACE = LOG_LEVEL.trace;
export const FATAL = LOG_LEVEL.fatal;

export const ALL_LOG_LEVELS = [ERROR, WARN, INFO, DEBUG, TRACE, FATAL];
