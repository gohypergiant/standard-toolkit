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

import {
  type LogLayerPlugin,
  type LogLayerTransport,
  LogLevel as LogLevelEnum,
} from 'loglayer';

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

export const LOG_LEVEL = LogLevelEnum;
export type LogLevel = LogLevelEnum | `${keyof typeof LogLevelEnum}`;

export const ERROR: LogLevel = 'error';
export const WARN: LogLevel = 'warn';
export const INFO: LogLevel = 'info';
export const DEBUG: LogLevel = 'debug';
export const TRACE: LogLevel = 'trace';
export const FATAL: LogLevel = 'fatal';
