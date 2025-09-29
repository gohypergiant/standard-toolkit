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

import React, { useEffect, useRef } from 'react';
import { setClockInterval } from '@/timers';

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long',
  timeZone: 'UTC',
  hour12: false,
});

/**
 * Outputs the current time in UTC as a span
 */
export function Clock() {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cleanup = setClockInterval(() => {
      if (el.current) {
        const time = timeFormatter.format(new Date());

        el.current.textContent = time;
      }
    }, 1000);

    return () => cleanup();
  }, []);

  return <span ref={el}>00:00:00 UTC</span>;
}
