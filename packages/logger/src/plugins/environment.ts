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

export interface EnvironmentPluginOptions extends LogLayerPluginParams {
  isServer: boolean;
  // NOTE: currently not used as of right now but reserving for later
  isProductionEnv: boolean;
}

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
