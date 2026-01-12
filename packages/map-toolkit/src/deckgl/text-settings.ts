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

import type { Color } from '@deck.gl/core';
import type { TextLayerProps } from '@deck.gl/layers';

/**
 * Shared font settings for SDF (Signed Distance Field) text rendering.
 *
 * These settings are optimized for cross-platform legibility, particularly
 * on Windows machines where text can appear thin/hard to read without
 * proper SDF configuration.
 *
 * Used by:
 * - TextLayer component
 * - Shape label layers
 * - Draw/edit mode tooltips
 */
export const SDF_FONT_SETTINGS: NonNullable<TextLayerProps['fontSettings']> = {
  fontSize: 22,
  sdf: true,
  buffer: 10,
  cutoff: 0.19,
  radius: 10,
  smoothing: 0.1,
};

/**
 * Default text size in pixels for deck.gl TextLayer.
 * Works in conjunction with SDF_FONT_SETTINGS for proper rendering.
 */
export const DEFAULT_TEXT_SIZE = 12;

/**
 * Default text color (white) for deck.gl TextLayer.
 */
export const DEFAULT_TEXT_COLOR: Color = [255, 255, 255, 255];

/**
 * Default text outline color (black) for deck.gl TextLayer.
 */
export const DEFAULT_TEXT_OUTLINE_COLOR: Color = [0, 0, 0, 255];

/**
 * Default text outline width in pixels for deck.gl TextLayer.
 */
export const DEFAULT_TEXT_OUTLINE_WIDTH = 2;

/**
 * Default font weight for deck.gl TextLayer.
 */
export const DEFAULT_FONT_WEIGHT = 500;

/**
 * Combined default text style settings for deck.gl TextLayer.
 * Spread this object into TextLayer props for consistent cross-platform rendering.
 *
 * Includes: fontSettings, fontWeight, getSize, getColor, outlineWidth, outlineColor
 */
export const DEFAULT_TEXT_STYLE = {
  fontSettings: { ...SDF_FONT_SETTINGS },
  fontWeight: DEFAULT_FONT_WEIGHT,
  getSize: DEFAULT_TEXT_SIZE,
  getColor: DEFAULT_TEXT_COLOR,
  outlineWidth: DEFAULT_TEXT_OUTLINE_WIDTH,
  outlineColor: DEFAULT_TEXT_OUTLINE_COLOR,
};
