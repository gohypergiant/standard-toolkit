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

import { describe, expect, it } from 'vitest';
import { MS_PER_HOUR, MS_PER_MINUTE } from '../constants';
import { roundDateToInterval } from './dates';

describe('roundDateToInterval', () => {
  describe('hours intervals', () => {
    it('should round down to nearest 1 hour interval', () => {
      const date = new Date('2026-01-30T14:35:42.123Z');
      roundDateToInterval(date, MS_PER_HOUR);
      expect(date.toISOString()).toBe('2026-01-30T14:00:00.000Z');
    });

    it('should handle date already aligned to 1 hour interval', () => {
      const date = new Date('2026-01-30T10:00:00.000Z');
      roundDateToInterval(date, MS_PER_HOUR);
      expect(date.toISOString()).toBe('2026-01-30T10:00:00.000Z');
    });
  });

  describe('minutes intervals', () => {
    it('should round down to nearest 1 minute interval', () => {
      const date = new Date('2026-01-30T14:35:42.123Z');
      roundDateToInterval(date, MS_PER_MINUTE);
      expect(date.toISOString()).toBe('2026-01-30T14:35:00.000Z');
    });

    it('should handle date already aligned to 1 minute interval', () => {
      const date = new Date('2026-01-30T14:35:00.000Z');
      roundDateToInterval(date, MS_PER_MINUTE);
      expect(date.toISOString()).toBe('2026-01-30T14:35:00.000Z');
    });
  });

  describe('edge cases', () => {
    it('should handle end of year for 24 hour interval', () => {
      const date = new Date('2025-12-31T23:59:59.999Z');
      roundDateToInterval(date, MS_PER_HOUR * 24);
      expect(date.toISOString()).toBe('2025-12-31T00:00:00.000Z');
    });
  });
});
