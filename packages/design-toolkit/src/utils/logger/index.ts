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

// __private-exports
import { bootstrap, type LogLevel } from '@accelint/logger';

// NOTE: we don't want to use the singleton variant getLogger to
// allow for an independent logging setup that can be controlled
// explicitly by the consumer. Treat this how you would enable
// logging with any third party dependency.
const logger = bootstrap({
  enabled: true,
  prefix: '[Design Toolkit]',
  level: 'error',
  pretty: true,
});

export function createLoggerDomain(prefix: string, level?: LogLevel) {
  const child = logger.withPrefix(prefix);

  if (level) {
    child.setLevel(level);
  }

  return child;
}
