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

import type { LogLayerPlugin, LogLayerPluginParams } from '@loglayer/plugin';

/**
 * Options for the environment detection plugin.
 */
export interface EnvironmentPluginOptions extends LogLayerPluginParams {
  /**
   * Whether the code is running in a server environment (Node.js).
   * Typically determined by `typeof window === 'undefined'`.
   */
  isServer: boolean;
  /**
   * Whether the application is running in production.
   * Reserved for future use.
   */
  isProductionEnv: boolean;
}

/**
 * Creates a LogLayer plugin that injects environment context into log data.
 *
 * This plugin adds a `server` boolean property to all log output, indicating
 * whether the log originated from a server or browser context.
 *
 * @param options - Plugin configuration options
 * @returns A LogLayer plugin instance
 *
 * @example
 * ```ts
 * import { environmentPlugin } from '@accelint/logger/plugins/environment';
 *
 * const plugin = environmentPlugin({
 *   isServer: typeof window === 'undefined',
 *   isProductionEnv: false,
 * });
 * // Log output will include: server: true (or false in browser)
 * ```
 */
export function environmentPlugin(
  options: EnvironmentPluginOptions,
): LogLayerPlugin {
  return {
    id: options.id,
    disabled: options.disabled,

    onBeforeDataOut({ data = {} }) {
      return {
        ...data,
        server: options.isServer,
      };
    },
  };
}
