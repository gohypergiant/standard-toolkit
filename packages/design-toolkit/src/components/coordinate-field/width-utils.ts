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

import type { SegmentConfig } from './types';

/**
 * Layout spacing constants for coordinate field width calculations.
 * All values are in character widths (ch units) to ensure consistent sizing
 * with monospace coordinate values.
 */

/** Gap spacing between segments (0.5rem = ~0.5ch per gap) */
export const SEGMENT_GAP_WIDTH = 0.5;

/** Container padding (px-s = 0.5rem on each side = ~1ch total) */
export const CONTAINER_PADDING_WIDTH = 2;

/** Format button width (icon button is roughly 2.5-3ch) */
export const FORMAT_BUTTON_WIDTH = 3.5;

/** Gap between input and button (gap-m = 1rem = ~1ch) */
export const INPUT_BUTTON_GAP = 1.5;

/**
 * Calculates the maximum width needed for the coordinate field control container.
 * This keeps the outlined container at a fixed width while segments animate.
 *
 * @param editableSegmentConfigs - Array of editable segment configurations
 * @param segmentConfigs - Array of all segment configurations (including literals)
 * @param showFormatButton - Whether the format button is displayed
 * @returns The calculated width as a CSS string (e.g., "25ch")
 */
export function calculateMaxControlWidth(
  editableSegmentConfigs: SegmentConfig[],
  segmentConfigs: SegmentConfig[],
  showFormatButton: boolean,
): string {
  // Sum all editable segment max widths with their padding
  const segmentWidth = editableSegmentConfigs.reduce((sum, config) => {
    const maxLen = config.maxLength || 0;
    const padding = config.pad ?? 0.5;
    return sum + maxLen + padding;
  }, 0);

  // Calculate width of literal characters (colons, spaces, etc.)
  const literalWidth = segmentConfigs
    .filter((c) => c.type === 'literal')
    .reduce((sum, c) => sum + (c.value?.length || 0), 0);

  // Add gap spacing between segments
  // Number of gaps = number of segments - 1
  const gapCount = segmentConfigs.length - 1;
  const gapWidth = gapCount * SEGMENT_GAP_WIDTH;

  // Add container padding
  const paddingWidth = CONTAINER_PADDING_WIDTH;

  // Add format button width if shown
  const buttonWidth = showFormatButton ? FORMAT_BUTTON_WIDTH : 0;

  // Add gap between input and button if button is shown
  const inputButtonGap = showFormatButton ? INPUT_BUTTON_GAP : 0;

  return `${segmentWidth + literalWidth + gapWidth + paddingWidth + buttonWidth + inputButtonGap}ch`;
}
