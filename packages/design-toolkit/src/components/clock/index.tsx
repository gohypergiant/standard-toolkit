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
'use client';

import { setClockInterval } from '@accelint/temporal';
import 'client-only';
import { useCallback, useEffect, useState } from 'react';
import type { ClockProps } from './types';

const DEFAULT_FORMATTER = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long',
  timeZone: 'UTC',
  hour12: false,
});

/**
 * Clock - An auto-updating UTC time component.
 *
 * Uses a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat|DateTimeFormat} configured with `'en-US', { timeStyle: 'long, timeZone: 'UTC', hour12: false }` by default,
 * but can be overridden with the `formatter` prop.
 *
 * NOTE: This component comes **unstyled by default**.
 *
 * @example
 * // Standard Clock
 * <Clock /> // <time>15:54:14 UTC</time>
 *
 * @example
 * // Styled
 * <Clock className="fg-accent-primary-bold" />
 *
 * @example
 * // Custom Format
 * const formatter = new Intl.DateTimeFormat('en-US', {
 *   dateStyle: "short",
 *   timeStyle: 'long',
 *   timeZone: 'UTC',
 *   hour12: false
 * });
 *
 * <Clock formatter={formatter} /> // <time>9/30/25, 15:54:14 UTC</time>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat| DateTimeFormat MDN}
 */
export function Clock({ formatter = DEFAULT_FORMATTER, ...rest }: ClockProps) {
  const now = useCallback(() => formatter.format(Date.now()), [formatter]);

  const [time, setTime] = useState<string>(now());

  useEffect(() => setClockInterval(() => setTime(now()), 1000), [now]);

  return <time {...rest}>{time}</time>;
}
