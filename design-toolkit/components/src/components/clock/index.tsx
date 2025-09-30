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
import 'client-only';
import { setClockInterval } from '@accelint/temporal';
import { useEffect, useMemo, useState } from 'react';
import type { ClockProps } from './types';

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  timeStyle: 'long',
  timeZone: 'UTC',
  hour12: false,
};

/**
 * Clock - An auto-updating UTC time component.
 *
 * Uses a standard Intl.DateTimeFormatOptions,
 * but can be overridden via `options` prop.
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
 * <Clock options={{ dateStyle: "short" }} /> // <time>9/30/25, 15:54:14 UTC</time>
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#locale_options| DateTimeFormatOptions MDN}
 */
export function Clock({ ref, options, ...rest }: ClockProps) {
  const formatOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const timeFormatter = new Intl.DateTimeFormat('en-US', formatOptions);

  const [time, setTime] = useState<string>();

  useEffect(() => {
    const cleanup = setClockInterval(() => {
      setTime(timeFormatter.format(new Date()));
    }, 1000);

    return () => cleanup();
  }, []);

  return (
    <time {...rest} ref={ref}>
      {time}
    </time>
  );
}

Clock.displayName = 'Clock';
