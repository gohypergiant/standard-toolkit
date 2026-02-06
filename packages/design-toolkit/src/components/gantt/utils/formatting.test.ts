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
import { formatTimestampLabel } from './formatting';

describe('formatTimestampLabel', () => {
  describe('date formatting (midnight)', () => {
    it('should format midnight as date with day and month', () => {
      const timestamp = new Date('2026-01-30T00:00:00.000Z').getTime();
      const result = formatTimestampLabel(timestamp);
      expect(result).toBe('30 JAN');
    });

    it('should pad single digit days with leading zero', () => {
      const timestamp = new Date('2026-03-05T00:00:00.000Z').getTime();
      const result = formatTimestampLabel(timestamp);
      expect(result).toBe('05 MAR');
    });
  });

  describe('time formatting (non-midnight)', () => {
    it('should format time as HH:MM when not midnight', () => {
      const timestamp = new Date('2026-01-30T14:30:00.000Z').getTime();
      const result = formatTimestampLabel(timestamp);
      expect(result).toBe('14:30');
    });

    it('should pad both hours and minutes when single digit', () => {
      const timestamp = new Date('2026-01-30T08:07:00.000Z').getTime();
      const result = formatTimestampLabel(timestamp);
      expect(result).toBe('08:07');
    });

    it('should format time with only minutes past midnight', () => {
      const timestamp = new Date('2026-01-30T00:15:00.000Z').getTime();
      const result = formatTimestampLabel(timestamp);
      expect(result).toBe('00:15');
    });
  });
});
