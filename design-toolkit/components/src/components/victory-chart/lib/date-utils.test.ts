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

import { describe, expect, it } from 'vitest';
import {
  addHours,
  dateFormat,
  dayAndDate,
  fullDateString,
  getTimeString,
} from './date-utils';

describe('Date Utils', () => {
  describe('addHours', () => {
    it('should add positive hours correctly', () => {
      const base = new Date('2024-01-01T00:00:00Z');
      const result = addHours(5, base);

      expect(result.getUTCHours()).toBe(5);
    });

    it('should handle negative hours', () => {
      const base = new Date('2024-01-01T12:00:00Z');
      const result = addHours(-5, base);

      expect(result.getUTCHours()).toBe(7);
    });

    it('should handle crossing day boundaries', () => {
      const base = new Date('2024-01-01T23:00:00Z');
      const result = addHours(2, base);

      expect(result.getUTCDate()).toBe(2);
      expect(result.getUTCHours()).toBe(1);
    });
  });

  describe('dateFormat', () => {
    it('should format date without time components', () => {
      const date = new Date('2024-01-01T15:30:45.123Z');

      expect(dateFormat(date)).toBe('2024-01-01 15:30');
    });

    it('should handle different timezones consistently', () => {
      const date = new Date('2024-01-01T23:59:59.999-05:00');

      expect(dateFormat(date)).toBe('2024-01-02 04:59');
    });
  });

  describe('dayAndDate', () => {
    it('should return day and date in correct format', () => {
      const date = new Date('2024-01-01T12:00:00Z');

      expect(dayAndDate(date)).toBe('Mon, 01 Jan 2024');
    });

    it('should handle month changes', () => {
      const date = new Date('2024-12-31T12:00:00Z');

      expect(dayAndDate(date)).toBe('Tue, 31 Dec 2024');
    });
  });

  describe('fullDateString', () => {
    it('should return full date string without time', () => {
      const date = new Date('2024-01-01T12:34:56Z');

      expect(fullDateString(date)).toBe('Mon, 01 Jan 2024');
    });

    it('should handle leap years', () => {
      const date = new Date('2024-02-29T12:00:00Z');

      expect(fullDateString(date)).toBe('Thu, 29 Feb 2024');
    });
  });

  describe('getTimeString', () => {
    it('should return time in HH:MM format', () => {
      const date = new Date('2024-01-01T15:30:00Z');

      expect(getTimeString(date)).toBe('15:30');
    });

    it('should handle midnight', () => {
      const date = new Date('2024-01-01T00:00:00Z');

      expect(getTimeString(date)).toBe('00:00');
    });

    it('should handle 23:59', () => {
      const date = new Date('2024-01-01T23:59:00Z');

      expect(getTimeString(date)).toBe('23:59');
    });
  });
});
