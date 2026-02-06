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
import {
  MS_PER_HOUR,
  MS_PER_MINUTE,
  OUT_OF_VIEW_CHUNK_COUNT,
  TIMELINE_CHUNK_WIDTH,
} from '../constants';
import { generateTimelineChunks } from './generation';
import type { TimelineChunkObject } from '../types';

describe('generateTimelineChunks', () => {
  describe('empty viewable region', () => {
    it('should return empty array when viewableRegionWidth is 0', () => {
      const result = generateTimelineChunks(0, 0, MS_PER_HOUR, MS_PER_HOUR);
      expect(result).toEqual([]);
    });
  });

  describe('chunk count calculation', () => {
    it('should generate odd number of chunks for typical viewport', () => {
      const viewableRegionWidth = 1600;
      const msPerPx = MS_PER_HOUR / TIMELINE_CHUNK_WIDTH;
      const result = generateTimelineChunks(
        0,
        viewableRegionWidth,
        MS_PER_HOUR,
        msPerPx,
      );

      expect(result.length % 2).toBe(1);
    });

    it('should generate enough chunks to fill viewport plus extras', () => {
      const viewableRegionWidth = 800;
      const msPerPx = MS_PER_HOUR / TIMELINE_CHUNK_WIDTH;
      const result = generateTimelineChunks(
        0,
        viewableRegionWidth,
        MS_PER_HOUR,
        msPerPx,
      );

      const expectedMinChunks =
        Math.ceil(viewableRegionWidth / TIMELINE_CHUNK_WIDTH) +
        OUT_OF_VIEW_CHUNK_COUNT;
      expect(result.length).toBeGreaterThanOrEqual(expectedMinChunks);
    });
  });

  describe('chunk positioning with selected time interval', () => {
    const msPerPx = MS_PER_HOUR / TIMELINE_CHUNK_WIDTH;
    const viewableRegionWidth = 800;

    it('should have evenly spaced chunks by selected time interval', () => {
      const currentPositionMs = new Date('2026-02-01T12:00:00.000Z').getTime();
      const result = generateTimelineChunks(
        currentPositionMs,
        viewableRegionWidth,
        MS_PER_HOUR,
        msPerPx,
      );

      const firstChunk = result[0] as TimelineChunkObject;

      result.forEach((chunk, index) => {
        const expectedTimestampMs =
          firstChunk.timestampMs + index * MS_PER_HOUR;
        expect(chunk.timestampMs).toBe(expectedTimestampMs);
      });
    });
  });

  describe('edge cases', () => {
    const msPerPx = MS_PER_HOUR / TIMELINE_CHUNK_WIDTH;

    it('should handle very small viewable region', () => {
      const viewableRegionWidth = 10;
      const currentPositionMs = new Date('2026-02-01T12:00:00.000Z').getTime();
      const result = generateTimelineChunks(
        currentPositionMs,
        viewableRegionWidth,
        MS_PER_HOUR,
        msPerPx,
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.length % 2).toBe(1);
    });

    it('should handle very small msPerPx values', () => {
      const currentPositionMs = new Date('2026-02-01T12:00:00.000Z').getTime();
      const viewableRegionWidth = 800;
      const smallMsPerPx = 0.001;
      const result = generateTimelineChunks(
        currentPositionMs,
        viewableRegionWidth,
        MS_PER_MINUTE,
        smallMsPerPx,
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result.length % 2).toBe(1);
    });
  });
});
