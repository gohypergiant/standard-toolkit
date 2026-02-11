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

// These two values can ultimately be configured by the user
// but for now, we'll stick to hardcoding them here
const DEFAULT_LOCALE = 'en-US';
const options: Intl.DateTimeFormatOptions = {
  minute: '2-digit',
  hour: '2-digit',
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
  hour12: false,
};

export function formatTimestampLabel(timestampMs: number) {
  const formatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, options);

  const { minute, hour, day, month } = formatter
    .formatToParts(timestampMs)
    .reduce(
      (acc, part) => {
        acc[part.type] = part.value;
        return acc;
      },
      {} as Record<Intl.DateTimeFormatPartTypes, string>,
    );

  const shouldRenderDate = hour === '00' && minute === '00';

  if (shouldRenderDate) {
    return `${day} ${month.toUpperCase()}`;
  }

  return `${hour}:${minute}`;
}
