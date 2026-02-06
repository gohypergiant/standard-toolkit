/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 */

import { describe, expect, it } from 'vitest';
import { TIMELINE_CHUNK_WIDTH } from '../constants';
import {
  getRenderedRegionBoundaryMs,
  getScrolledPixels,
  getViewableRegionWidth,
  shouldRenderBlock,
} from './helpers';
import type { UIEvent } from 'react';

describe('helpers', () => {
  describe('getViewableRegionWidth', () => {
    it('returns 0 for null element', () => {
      expect(getViewableRegionWidth(null)).toBe(0);
    });

    it('returns clientWidth for element', () => {
      const el = { clientWidth: 250 } as HTMLElement;
      expect(getViewableRegionWidth(el)).toBe(250);
    });
  });

  describe('getScrolledPixels', () => {
    it('returns scrollLeft from event currentTarget', () => {
      const mockEvent = {
        currentTarget: { scrollLeft: 123 },
      } as UIEvent<HTMLDivElement>;
      expect(getScrolledPixels(mockEvent)).toBe(123);
    });
  });

  describe('getRenderedRegionBoundaryMs', () => {
    it('returns {0,0} for empty markers', () => {
      expect(getRenderedRegionBoundaryMs([], 10)).toEqual({
        startMs: 0,
        endMs: 0,
      });
    });

    it('computes start and end using TIMELINE_CHUNK_WIDTH and msPerPx', () => {
      const msPerPx = 10;
      const firstMarkerMs = 1000;
      const lastMarkerMs = 1500;
      const markers = [
        { timestampMs: firstMarkerMs },
        { timestampMs: 1250 },
        { timestampMs: lastMarkerMs },
      ];

      expect(getRenderedRegionBoundaryMs(markers, msPerPx)).toEqual({
        startMs: firstMarkerMs,
        endMs: lastMarkerMs + TIMELINE_CHUNK_WIDTH * msPerPx,
      });
    });
  });

  describe('shouldRenderBlock', () => {
    const renderedRegion = { startMs: 1000, endMs: 2000 };

    it.each([
      [
        'returns true when block starts before region and ends inside region',
        900,
        1100,
        true,
      ],
      ['returns true when block is fully within the region', 1200, 1800, true],
      [
        'returns true when block starts inside region and ends after region end',
        1900,
        2100,
        true,
      ],
      [
        'returns true when block exactly matches the region boundaries',
        1000,
        2000,
        true,
      ],
      [
        'returns true when block extends beyond region on both sides',
        900,
        2100,
        true,
      ],
      [
        'returns false when block is completely before the region',
        800,
        1000,
        false,
      ],
      [
        'returns false when block is completely after the region',
        2000,
        2100,
        false,
      ],
    ])('%s', (_description, blockStartMs, blockEndMs, expected) => {
      const result = shouldRenderBlock(
        renderedRegion,
        blockStartMs,
        blockEndMs,
      );
      expect(result).toBe(expected);
    });
  });
});
