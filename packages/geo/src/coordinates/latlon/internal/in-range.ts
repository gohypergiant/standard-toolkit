// __private-exports
/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Return an error string if the value is outside the range where the limits
 * are 0-limit.
 */
export const inRange = (label: string, value: string, limit: number) => {
  const num = Number.parseFloat(value);

  if (limit < num) {
    return `${label} value (${value}) exceeds max value (${limit}).`;
  }

  if (num < 0) {
    return `${label} value (${value}) must be positive.`;
  }
};
