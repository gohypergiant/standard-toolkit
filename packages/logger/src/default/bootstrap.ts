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

import { OneWayLogLevelManager } from '@loglayer/log-level-manager-one-way';
import { getSimplePrettyTerminal } from '@loglayer/transport-simple-pretty-terminal';
import { LogLayer, StructuredTransport } from 'loglayer';
import { serializeError } from 'serialize-error';
import { callsitePlugin } from '../plugins/callsite';
import { environmentPlugin } from '../plugins/environment';
import type { LoggerOptions } from '../definitions';

/**
 * Initializes and configures a LogLayer instance with default plugins and transports.
 *
 * This function creates a logger with pre-configured callsite tracking, environment detection,
 * and error serialization. It supports both pretty-printed and structured JSON output.
 *
 * @param options - Logger configuration options
 * @returns A configured LogLayer instance with all plugins and transports applied
 */
export function bootstrap({
  enabled,
  plugins = [],
  transports = [],
  level = 'debug',
  env = 'development',
  groups = {},
  pretty = true,
  prefix = '',
}: LoggerOptions) {
  const isProductionEnv = env === 'production';
  const isServer = typeof window === 'undefined';

  const instance = new LogLayer({
    errorSerializer: serializeError,
    transport: [
      pretty
        ? getSimplePrettyTerminal({
            viewMode: 'message-only',
            level,
            // NOTE: this gives us a nice balance even on the server
            runtime: 'browser',
            includeDataInBrowserConsole: true,
          })
        : new StructuredTransport({
            level,
            logger: console,
          }),
      ...transports,
    ],
    plugins: [
      callsitePlugin({ isProductionEnv }),
      environmentPlugin({ isProductionEnv, isServer }),
      ...plugins,
    ],
    groups,
    enabled,
    prefix,
  });

  instance.withLogLevelManager(new OneWayLogLevelManager());

  return instance;
}
