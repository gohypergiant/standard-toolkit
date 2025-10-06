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
import { getFilteredData } from './get-filtered-data';
import type { ChartData, ChartItem, ChartRow } from '.';

describe('getFilteredData', () => {
  const baseDate = new Date('2024-01-01T00:00:00Z');

  function createChartItem(
    title: string,
    hoursFromBase: number,
    durationHours: number,
  ): ChartItem {
    return {
      title,
      start: new Date(baseDate.getTime() + hoursFromBase * 3600000),
      end: new Date(
        baseDate.getTime() + (hoursFromBase + durationHours) * 3600000,
      ),
    };
  }

  const sampleData: ChartData = [
    {
      title: 'Group 1',
      data: [
        [
          createChartItem('Item 1', 0, 2), // 00:00-02:00
          createChartItem('Item 2', 3, 2), // 03:00-05:00
        ],
        {
          title: 'Subgroup 1',
          data: [
            [
              createChartItem('Item 3', 1, 3), // 01:00-04:00
              createChartItem('Item 4', 6, 2), // 06:00-08:00
            ],
          ],
        },
      ],
    },
  ];

  it('should filter data within time window', () => {
    const result = getFilteredData(sampleData, 4); // 4-hour window

    expect(result).toHaveLength(1);
    expect(result[0]?.data).toHaveLength(2);

    // First array of items should contain items within first 4 hours
    const firstGroup = result[0]?.data[0] as ChartItem[];
    expect(firstGroup).toHaveLength(2);
    expect(firstGroup[0]?.title).toBe('Item 1');
    expect(firstGroup[1]?.title).toBe('Item 2');

    // Subgroup should contain only items within first 4 hours
    const subgroup = result[0]?.data[1] as ChartRow;
    expect(subgroup.data[0]).toHaveLength(1);
    expect((subgroup.data[0] as ChartItem[])[0]?.title).toBe('Item 3');
  });

  it('should handle empty data array', () => {
    const emptyData: ChartData = [];
    const result = getFilteredData(emptyData, 4);

    expect(result).toHaveLength(0);
  });

  it('should remove empty groups when removeEmpty is true', () => {
    const dataWithEmptyGroup: ChartData = [
      {
        title: 'Empty Group',
        data: [
          [
            createChartItem('Future Item', 10, 2), // 10:00-12:00
          ],
        ],
      },
      ...sampleData,
    ];
    const result = getFilteredData(dataWithEmptyGroup, 4, true);

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('Group 1');
  });

  it('should keep empty groups when removeEmpty is false', () => {
    const dataWithEmptyGroup: ChartData = [
      {
        title: 'Empty Group',
        data: [
          [
            createChartItem('Future Item', 10, 2), // 10:00-12:00
          ],
        ],
      },
      ...sampleData,
    ];
    const result = getFilteredData(dataWithEmptyGroup, 4, false);

    expect(result).toHaveLength(2);
    expect(result[0]?.data).toHaveLength(0);
  });
});
