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

import type { Color } from '@deck.gl/core';

export const defaultSettings = {
  fontFamily: 'system-ui, sans-serif',
  fontSettings: {
    fontSize: 12,
    sdf: true,
    // Larger buffer improves SDF text quality and rendering sharpness
    buffer: 6,
    // Cutoff determines the edge of the glyph in SDF rendering
    // Range: 0-1, default 0.25. Higher values = bolder text
    cutoff: 0.25,
    // Smoothing controls anti-aliasing of text edges
    // Range: 0-1, lower values = sharper edges
    smoothing: 0.05,
  },
  fontWeight: 500,
  getAlignmentBaseline: 'center',
  getColor: [255, 255, 255, 255] as Color,
  getTextAnchor: 'middle',
  lineHeight: 1,
  outlineColor: [0, 0, 0, 255] as Color,
  outlineWidth: 1,
} as const;
