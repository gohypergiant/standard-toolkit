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
import {
  ConsoleTransport,
  type ILogLayer,
  LogLayer,
  type LogLevel,
} from 'loglayer';
import { serializeError } from 'serialize-error';
import { callsitePlugin } from '../plugins/callsite';
import { environmentPlugin } from '../plugins/environment';
import type { LogLayerPlugin } from '@loglayer/plugin';
import type { LogLayerTransport } from '@loglayer/transport';

let logInstance: ILogLayer;

type LoggerOptions = {
  enabled: boolean;
  plugins?: LogLayerPlugin[];
  transports?: LogLayerTransport[];
  level?: `${LogLevel}`;
  pretty?: boolean;
  prefix?: string;
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
}: LoggerOptions) {
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

  const appliedPlugins = [
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

export function getLogger(opts: LoggerOptions) {
  if (logInstance) {
    return logInstance;
  }

  return bootstrap(opts);
}
