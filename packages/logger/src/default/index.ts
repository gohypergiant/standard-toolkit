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

import { getSimplePrettyTerminal } from '@loglayer/transport-simple-pretty-terminal';
import { ConsoleTransport, LogLayer, type LogLevel } from 'loglayer';
import { serializeError } from 'serialize-error';
import { callsitePlugin } from '../plugins/callsite';
import { environmentPlugin } from '../plugins/environment';
import type { LogLayerPlugin } from '@loglayer/plugin';
import type { LogLayerTransport } from '@loglayer/transport';

let logInstance: LogLayer;

type LogLevelType = LogLevel | `${LogLevel}`;

export type { LogLevel, LogLevelType };

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
  level?: `${LogLevel}`;
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

function bootstrap({
  enabled,
  plugins = [],
  transports = [],
  level = 'debug',
  env = 'development',
  pretty = true,
  prefix = '',
}: LoggerOptions): LogLayer {
  const isProductionEnv = env === 'production';
  const isServer = typeof window === 'undefined';

  const stdoutTransport = pretty
    ? getSimplePrettyTerminal({
        viewMode: 'message-only',
        level,
        // NOTE: this gives us a nice balance even on the server
        runtime: 'browser',
        includeDataInBrowserConsole: true,
      })
    : new ConsoleTransport({
        level,
        logger: console,
        appendObjectData: true,
      });

  const appliedTransports: LogLayerTransport[] = [
    stdoutTransport,
    ...transports,
  ].filter(Boolean);

  const appliedPlugins: LogLayerPlugin[] = [
    callsitePlugin({ isProductionEnv }),
    environmentPlugin({ isProductionEnv, isServer }),

    ...plugins,
  ].filter(Boolean);

  const instance = new LogLayer({
    errorSerializer: serializeError,
    transport: appliedTransports,
    plugins: appliedPlugins,
    enabled,
    prefix,
  });

  logInstance = instance;

  return instance;
}

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
  if (logInstance) {
    return logInstance;
  }

  return bootstrap(opts);
}
