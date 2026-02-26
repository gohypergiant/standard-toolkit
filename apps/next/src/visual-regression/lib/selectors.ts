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

import { getLogger } from '@accelint/logger';
import { page } from 'vitest/browser';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[VRT:Selectors]',
  pretty: true,
});

/**
 * Parse a selector string and return a vitest page locator.
 * Supports [role="..."] and [data-testid="..."] selectors.
 */
export function getTargetFromSelector(selector: string) {
  const roleMatch = selector.match(/\[role="([^"]+)"\]/);
  if (roleMatch?.[1]) {
    return page.getByRole(roleMatch[1] as Parameters<typeof page.getByRole>[0]);
  }

  const testIdMatch = selector.match(/\[data-testid="([^"]+)"\]/);
  if (testIdMatch?.[1]) {
    return page.getByTestId(testIdMatch[1]);
  }

  logger.warn(
    `Unsupported selector format: "${selector}". Only [role="..."] and [data-testid="..."] are supported. Falling back to container screenshot.`,
  );

  return null;
}
