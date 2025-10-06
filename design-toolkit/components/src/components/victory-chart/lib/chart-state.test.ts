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

import {
  type ChartState,
  type ChartStateInitial,
  initialChartState,
  reducerChartState,
  updateChartState,
} from './chart-state';
import type { ChartData } from '../data';

// Mock the getFilteredData function
vi.mock('../data/get-filtered-data', () => ({
  getFilteredData: vi.fn((data: ChartData, focus: number) => {
    // Mock implementation: return data with focus as a property
    return data.map((item) => ({ ...item, focus }));
  }),
}));

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFilteredData } from '../data/get-filtered-data';

describe('Chart State Management', () => {
  const sampleData: ChartData = [
    {
      title: 'Group 1',
      data: [
        [
          {
            title: 'Item 1',
            start: new Date('2024-01-01T00:00:00Z'),
            end: new Date('2024-01-01T02:00:00Z'),
          },
        ],
      ],
    },
  ];

  describe('initialChartState', () => {
    it('should create initial state with defaults', () => {
      const state = initialChartState(sampleData);

      expect(state).toEqual({
        data: expect.any(Array),
        focus: 24,
        zoom: 100,
      });
      expect(getFilteredData).toHaveBeenCalledWith(sampleData, 24);
    });

    it('should accept custom initial values', () => {
      const initialState: ChartStateInitial = {
        focus: 48,
        zoom: 50,
      };
      const state = initialChartState(sampleData, initialState);

      expect(state).toEqual({
        data: expect.any(Array),
        focus: 48,
        zoom: 50,
      });
      expect(getFilteredData).toHaveBeenCalledWith(sampleData, 48);
    });
  });

  describe('reducerChartState', () => {
    let initialState: ChartState;

    beforeEach(() => {
      initialState = initialChartState(sampleData);
      vi.clearAllMocks();
    });

    it('should handle SET_FOCUS action', () => {
      const newState = reducerChartState(initialState, {
        type: 'SET_FOCUS',
        focus: 12,
      });

      expect(newState.focus).toBe(12);
      // expect(getFilteredData).toHaveBeenCalledWith(sampleData, 12);
    });

    it('should handle SET_ZOOM action', () => {
      const newState = reducerChartState(initialState, {
        type: 'SET_ZOOM',
        zoom: 75,
      });

      expect(newState.zoom).toBe(75);
      expect(getFilteredData).not.toHaveBeenCalled();
    });

    it('should handle UPDATE action', () => {
      const newState = reducerChartState(initialState, {
        type: 'UPDATE',
        payload: { zoom: 200, focus: 6 },
        data: sampleData,
      });

      expect(newState.zoom).toBe(200);
      expect(newState.focus).toBe(6);
      expect(getFilteredData).toHaveBeenCalledWith(sampleData, 6);
    });

    it('should handle UPDATE action and fallback to existing state.focus value', () => {
      const newState = reducerChartState(initialState, {
        type: 'UPDATE',
        payload: { zoom: 200, focus: undefined },
        data: sampleData,
      });

      expect(newState.zoom).toBe(200);
      expect(newState.focus).toBe(24);
      expect(getFilteredData).toHaveBeenCalledWith(sampleData, 24);
    });

    it('should handle default case', () => {
      const newState = reducerChartState(initialState, {
        type: 'UNKNOWN',
      } as any);

      expect(newState).toEqual(initialState);
      expect(getFilteredData).not.toHaveBeenCalled();
    });
  });

  describe('updateChartState', () => {
    it('should return a function that dispatches UPDATE action', () => {
      const dispatch = vi.fn();
      const update = updateChartState(sampleData, dispatch);
      const updates = { focus: 6, zoom: 200 };

      update(updates);

      expect(dispatch).toHaveBeenCalledWith({
        type: 'UPDATE',
        payload: updates,
        data: sampleData,
      });
    });
  });
});
