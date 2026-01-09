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

import callsites from 'callsites';
import type { LogLayerPlugin, LogLayerPluginParams } from '@loglayer/plugin';

const LEVEL_REGEX = /(info|warn|error|debug|trace|fatal)/;

function getCallsite() {
  let levelLine = 0;
  const sites = callsites();

  if (!sites || sites.length === 0) {
    return 'unknown';
  }

  /**
   * NOTE: callsites can be rather unpredictable as there are many
   * variables that can change the stack. E.g. if you are in a prod
   * build vs. dev, if you have sourcemaps enabled or not, if you
   * are in a server or browser context, etc.
   *
   * As such, we need to hunt for two callsites in our stack:
   * 1. The internal call to the LogLayer method e.g. `.debug()`
   * 2. The call immediately following the former which is the
   * callsite we actually care about.
   */
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    const name = site?.getFunctionName() || '';

    if (LEVEL_REGEX.test(name)) {
      levelLine = i;
      break;
    }
  }

  const site = sites[levelLine + 1];
  const columnNumber = site?.getColumnNumber();
  const lineNumber = site?.getLineNumber();
  // NOTE: in bundler environments eval() is often used during dev builds
  const fileName = site?.isEval() ? site.getEvalOrigin() : site?.getFileName();

  return `${fileName}:${lineNumber}:${columnNumber}`;
}

/**
 * Options for the callsite tracking plugin.
 */
export interface CallsitePluginOptions extends LogLayerPluginParams {
  /**
   * Whether the application is running in production.
   * Reserved for future use.
   */
  isProductionEnv: boolean;
}

/**
 * Creates a LogLayer plugin that tracks and injects source code location into log data.
 *
 * This plugin automatically captures the file, line number, and column where each
 * log call originates, adding a `callSite` property to the log data.
 *
 * @param options - Plugin configuration options
 * @returns A LogLayer plugin instance
 *
 * @example
 * ```ts
 * import { callsitePlugin } from '@accelint/logger/plugins/callsite';
 *
 * const plugin = callsitePlugin({ isProductionEnv: false });
 * // Log output will include: callSite: "src/services/user.ts:42:5"
 * ```
 */
export function callsitePlugin(options: CallsitePluginOptions): LogLayerPlugin {
  return {
    id: options.id,
    disabled: options.disabled,

    onBeforeDataOut({ data = {} }) {
      return {
        ...data,
        callSite: getCallsite(),
      };
    },
  };
}
