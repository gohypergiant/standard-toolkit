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
  ddmSegmentConfigs,
  ddSegmentConfigs,
  dmsSegmentConfigs,
  mgrsSegmentConfigs,
  utmSegmentConfigs,
} from './segment-configs';
import {
  CONTAINER_PADDING_WIDTH,
  calculateMaxControlWidth,
  FORMAT_BUTTON_WIDTH,
  INPUT_BUTTON_GAP,
  SEGMENT_GAP_WIDTH,
} from './width-utils';

describe('width-utils', () => {
  describe('constants', () => {
    it('exports spacing constants with sensible values', () => {
      expect(SEGMENT_GAP_WIDTH).toBe(0.5);
      expect(CONTAINER_PADDING_WIDTH).toBe(2);
      expect(FORMAT_BUTTON_WIDTH).toBe(3.5);
      expect(INPUT_BUTTON_GAP).toBe(1.5);
    });
  });

  describe('calculateMaxControlWidth', () => {
    describe('DD format', () => {
      const editableConfigs = ddSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('calculates width without format button', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          ddSegmentConfigs,
          false,
        );

        // DD has 2 editable segments:
        // - Segment 1: maxLength=10, pad=0.25 → 10.25ch
        // - Segment 2: maxLength=11, pad=0.5 → 11.5ch
        // Total segments: 21.75ch
        const segmentWidth = 10.25 + 11.5;

        // DD has 1 literal: ", " (2 chars) → 2ch
        const literalWidth = 2;

        // DD has 3 total segments (2 editable + 1 literal) → 2 gaps
        const gapWidth = 2 * SEGMENT_GAP_WIDTH; // 1ch

        // No button
        const buttonWidth = 0;
        const inputButtonGap = 0;

        const expectedTotal =
          segmentWidth +
          literalWidth +
          gapWidth +
          CONTAINER_PADDING_WIDTH +
          buttonWidth +
          inputButtonGap;

        expect(width).toBe(`${expectedTotal}ch`);
        expect(width).toBe('26.75ch');
      });

      it('calculates width with format button', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          ddSegmentConfigs,
          true,
        );

        const baseWidth = 26.75;
        const withButton = baseWidth + FORMAT_BUTTON_WIDTH + INPUT_BUTTON_GAP;

        expect(width).toBe(`${withButton}ch`);
        expect(width).toBe('31.75ch');
      });
    });

    describe('DDM format', () => {
      const editableConfigs = ddmSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('calculates width for DDM format', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          ddmSegmentConfigs,
          true,
        );

        // DDM has 6 editable segments
        expect(editableConfigs.length).toBe(6);

        // Should return a width string
        expect(width).toMatch(/^\d+(\.\d+)?ch$/);

        // Should be wider than DD format (31.75ch)
        const widthValue = Number.parseFloat(width);
        expect(widthValue).toBeGreaterThan(31.75);
      });
    });

    describe('DMS format', () => {
      const editableConfigs = dmsSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('calculates width for DMS format', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          dmsSegmentConfigs,
          true,
        );

        // DMS has 8 editable segments
        expect(editableConfigs.length).toBe(8);

        // Should return a width string
        expect(width).toMatch(/^\d+(\.\d+)?ch$/);

        // DMS should be the widest format
        const widthValue = Number.parseFloat(width);
        expect(widthValue).toBeGreaterThan(40);
      });
    });

    describe('MGRS format', () => {
      const editableConfigs = mgrsSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('calculates width for MGRS format', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          mgrsSegmentConfigs,
          true,
        );

        // MGRS has 5 editable segments
        expect(editableConfigs.length).toBe(5);

        expect(width).toMatch(/^\d+(\.\d+)?ch$/);
      });
    });

    describe('UTM format', () => {
      const editableConfigs = utmSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('calculates width for UTM format', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          utmSegmentConfigs,
          true,
        );

        // UTM has 4 editable segments
        expect(editableConfigs.length).toBe(4);

        expect(width).toMatch(/^\d+(\.\d+)?ch$/);
      });
    });

    describe('edge cases', () => {
      it('handles empty segment configurations', () => {
        const width = calculateMaxControlWidth([], [], false);

        // Only container padding should remain
        expect(width).toBe(`${CONTAINER_PADDING_WIDTH}ch`);
        expect(width).toBe('2ch');
      });

      it('handles single segment without literals', () => {
        const singleSegment = [
          { type: 'numeric' as const, maxLength: 5, pad: 0.5 },
        ];

        const width = calculateMaxControlWidth(
          singleSegment,
          singleSegment,
          false,
        );

        // Segment: 5 + 0.5 = 5.5ch
        // No literals: 0ch
        // No gaps (single segment): 0ch
        // Padding: 2ch
        // Total: 7.5ch
        expect(width).toBe('7.5ch');
      });

      it('handles segment without padding specified', () => {
        const segmentNoPad = [{ type: 'numeric' as const, maxLength: 5 }];

        const width = calculateMaxControlWidth(
          segmentNoPad,
          segmentNoPad,
          false,
        );

        // Should use default padding of 0.5
        // Segment: 5 + 0.5 = 5.5ch
        // Padding: 2ch
        // Total: 7.5ch
        expect(width).toBe('7.5ch');
      });

      it('handles segment with maxLength of 0', () => {
        const zeroLengthSegment = [
          { type: 'numeric' as const, maxLength: 0, pad: 0.5 },
        ];

        const width = calculateMaxControlWidth(
          zeroLengthSegment,
          zeroLengthSegment,
          false,
        );

        // Segment: 0 + 0.5 = 0.5ch
        // Padding: 2ch
        // Total: 2.5ch
        expect(width).toBe('2.5ch');
      });

      it('handles literal with empty value', () => {
        const configs = [
          { type: 'numeric' as const, maxLength: 5, pad: 0.5 },
          { type: 'literal' as const, value: '' },
          { type: 'numeric' as const, maxLength: 5, pad: 0.5 },
        ];

        const editableConfigs = configs.filter((c) => c.type !== 'literal');

        const width = calculateMaxControlWidth(editableConfigs, configs, false);

        // Segments: (5 + 0.5) + (5 + 0.5) = 11ch
        // Literals: 0ch (empty string)
        // Gaps: 2 gaps * 0.5 = 1ch
        // Padding: 2ch
        // Total: 14ch
        expect(width).toBe('14ch');
      });

      it('calculates gaps correctly for multiple segments', () => {
        const configs = [
          { type: 'numeric' as const, maxLength: 2, pad: 0 },
          { type: 'literal' as const, value: ' ' },
          { type: 'numeric' as const, maxLength: 2, pad: 0 },
          { type: 'literal' as const, value: ' ' },
          { type: 'numeric' as const, maxLength: 2, pad: 0 },
        ];

        const editableConfigs = configs.filter((c) => c.type !== 'literal');

        const width = calculateMaxControlWidth(editableConfigs, configs, false);

        // 5 total segments → 4 gaps
        const gapWidth = 4 * SEGMENT_GAP_WIDTH; // 2ch
        const segmentWidth = 2 + 2 + 2; // 6ch
        const literalWidth = 1 + 1; // 2ch
        const expectedTotal =
          segmentWidth + literalWidth + gapWidth + CONTAINER_PADDING_WIDTH;

        expect(width).toBe(`${expectedTotal}ch`);
        expect(width).toBe('12ch');
      });
    });

    describe('format button behavior', () => {
      const editableConfigs = ddSegmentConfigs.filter(
        (c) => c.type !== 'literal',
      );

      it('adds button width when showFormatButton is true', () => {
        const withoutButton = calculateMaxControlWidth(
          editableConfigs,
          ddSegmentConfigs,
          false,
        );
        const withButton = calculateMaxControlWidth(
          editableConfigs,
          ddSegmentConfigs,
          true,
        );

        const widthDifference =
          Number.parseFloat(withButton) - Number.parseFloat(withoutButton);
        const expectedDifference = FORMAT_BUTTON_WIDTH + INPUT_BUTTON_GAP;

        expect(widthDifference).toBe(expectedDifference);
        expect(widthDifference).toBe(5);
      });

      it('excludes button width when showFormatButton is false', () => {
        const width = calculateMaxControlWidth(
          editableConfigs,
          ddSegmentConfigs,
          false,
        );

        // Should not include FORMAT_BUTTON_WIDTH or INPUT_BUTTON_GAP
        const widthValue = Number.parseFloat(width);
        expect(widthValue).toBe(26.75);
      });
    });

    describe('return format', () => {
      it('always returns string ending with "ch"', () => {
        const width = calculateMaxControlWidth(
          ddSegmentConfigs.filter((c) => c.type !== 'literal'),
          ddSegmentConfigs,
          true,
        );

        expect(typeof width).toBe('string');
        expect(width).toMatch(/ch$/);
      });

      it('returns valid CSS width value', () => {
        const width = calculateMaxControlWidth(
          ddSegmentConfigs.filter((c) => c.type !== 'literal'),
          ddSegmentConfigs,
          true,
        );

        // Should be parseable as a number when removing 'ch'
        const numericValue = Number.parseFloat(width);
        expect(Number.isNaN(numericValue)).toBe(false);
        expect(numericValue).toBeGreaterThan(0);
      });
    });
  });
});
