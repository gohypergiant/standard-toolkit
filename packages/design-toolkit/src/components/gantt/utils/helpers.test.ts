/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 */

import { describe, expect, it } from 'vitest';
import { TIMELINE_CHUNK_WIDTH } from '../constants';
import {
  getHorizontalScrolledPixels,
  getRenderedRegionBoundsMs,
  getVerticalScrolledPixels,
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

  describe('getHorizontalScrolledPixels', () => {
    it('returns scrollLeft from event currentTarget', () => {
      const mockEvent = {
        currentTarget: { scrollLeft: 123 },
      } as UIEvent<HTMLDivElement>;
      expect(getHorizontalScrolledPixels(mockEvent)).toBe(123);
    });
  });

  describe('getVerticalScrolledPixels', () => {
    it('returns scrollTop from event currentTarget', () => {
      const mockEvent = {
        currentTarget: { scrollTop: 123 },
      } as UIEvent<HTMLDivElement>;
      expect(getVerticalScrolledPixels(mockEvent)).toBe(123);
    });
  });

  describe('getRenderedRegionBoundsMs', () => {
    it('returns {0,0} for empty markers', () => {
      expect(getRenderedRegionBoundsMs([], 10)).toEqual({
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

      expect(getRenderedRegionBoundsMs(markers, msPerPx)).toEqual({
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
        { startMs: 900, endMs: 1100 },
        true,
      ],
      [
        'returns true when block is fully within the region',
        { startMs: 1200, endMs: 1800 },
        true,
      ],
      [
        'returns true when block starts inside region and ends after region end',
        { startMs: 1900, endMs: 2100 },
        true,
      ],
      [
        'returns true when block exactly matches the region boundaries',
        { startMs: 1000, endMs: 2000 },
        true,
      ],
      [
        'returns true when block extends beyond region on both sides',
        { startMs: 900, endMs: 2100 },
        true,
      ],
      [
        'returns false when block is completely before the region',
        { startMs: 800, endMs: 1000 },
        false,
      ],
      [
        'returns false when block is completely after the region',
        { startMs: 2000, endMs: 2100 },
        false,
      ],
    ])('%s', (_description, { startMs, endMs }, expected) => {
      const result = shouldRenderBlock(renderedRegion, {
        startMs,
        endMs,
      });
      expect(result).toBe(expected);
    });
  });
});
