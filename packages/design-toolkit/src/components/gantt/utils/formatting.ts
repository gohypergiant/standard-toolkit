// __private-exports
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

// TODO: Make locale and format options configurable via GanttProviderProps
const DEFAULT_LOCALE = 'en-US';
const options: Intl.DateTimeFormatOptions = {
  minute: '2-digit',
  hour: '2-digit',
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  hour12: false,
};

const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, options);
const labelCache = new Map<number, string>();

export function formatTimestampLabel(timestampMs: number): string {
  const cached = labelCache.get(timestampMs);

  if (cached !== undefined) {
    return cached;
  }

  const parts = formatter.formatToParts(timestampMs);
  let minute = '';
  let hour = '';
  let day = '';
  let month = '';

  for (const part of parts) {
    switch (part.type) {
      case 'minute':
        minute = part.value;
        break;
      case 'hour':
        hour = part.value;
        break;
      case 'day':
        day = part.value;
        break;
      case 'month':
        month = part.value;
        break;
    }
  }

  const label =
    hour === '00' && minute === '00'
      ? `${day} ${month.toUpperCase()}`
      : `${hour}:${minute}`;

  labelCache.set(timestampMs, label);

  if (labelCache.size > 500) {
    labelCache.clear();
  }

  return label;
}
