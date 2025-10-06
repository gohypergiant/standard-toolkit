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
import { getTimelineTiming } from './timeline-timing';
import type { ChartData } from '../data';

// Helper function to create test data
const createTestData = (start: Date, end: Date): ChartData => [
  {
    title: 'Test',
    data: [[{ start, end, title: 'Test Event' }]],
  },
];

describe('getTimelineTiming', () => {
  it.each`
    start                  | end                    | focus | matchStart             | matchEnd               | title
    ${'2024-10-15 00:00Z'} | ${'2024-10-15 10:00Z'} | ${2}  | ${'2024-10-15 00:00Z'} | ${'2024-10-15 02:00Z'} | ${'within'}
    ${'2024-10-15 00:00Z'} | ${'2024-10-15 12:00Z'} | ${12} | ${'2024-10-15 00:00Z'} | ${'2024-10-15 12:00Z'} | ${'matching'}
    ${'2024-10-15 00:00Z'} | ${'2024-10-15 12:00Z'} | ${24} | ${'2024-10-14 18:00Z'} | ${'2024-10-15 18:00Z'} | ${'exceeding'}
  `(
    'should handle data $title the focus window',
    ({ end, focus, matchEnd, matchStart, start }) => {
      const data = createTestData(new Date(start), new Date(end));
      const { timelineEnd, timelineStart } = getTimelineTiming(focus, data);

      expect(timelineStart).toBe(new Date(matchStart).valueOf());
      expect(timelineEnd).toBe(new Date(matchEnd).valueOf());
    },
  );

  describe('edge cases', () => {
    it.each`
      start                            | end                              | title
      ${new Date('invalid')}           | ${new Date('2024-10-15 00:00Z')} | ${'an "invalid" start Date'}
      ${undefined}                     | ${new Date('2024-10-15 00:00Z')} | ${'an `undefined` start Date'}
      ${new Date('2024-10-15 00:00Z')} | ${new Date('invalid')}           | ${'an "invalid" end Date'}
      ${new Date('2024-10-15 00:00Z')} | ${undefined}                     | ${'an `undefined` end Date'}
      ${new Date('2024-10-15 00:00Z')} | ${new Date('2024-10-15 00:00Z')} | ${'zero length'}
    `('should handle $title', ({ end, start }) => {
      const data = createTestData(start, end);
      const { timelineEnd, timelineStart } = getTimelineTiming(2, data);

      expect(timelineStart).toBe(0);
      expect(timelineEnd).toBe(0);
    });

    it('should handle empty data gracefully', () => {
      const emptyData: ChartData = [];
      const focus = 8;

      const result = getTimelineTiming(focus, emptyData);

      expect(result.timelineStart).toBe(0);
      expect(result.timelineEnd).toBe(0);
    });
  });
});
