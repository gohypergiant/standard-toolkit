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

/**
 * Shared constants for grid layers
 */

/**
 * Default line color for grid lines (dark gray, semi-transparent)
 */
export const DEFAULT_LINE_COLOR: [number, number, number, number] = [
  80, 80, 80, 180,
];

/**
 * Default label color (white, fully opaque)
 */
export const DEFAULT_LABEL_COLOR: [number, number, number, number] = [
  255, 255, 255, 255,
];

/**
 * Default label background color (dark gray, semi-transparent)
 */
export const DEFAULT_LABEL_BACKGROUND_COLOR: [number, number, number, number] =
  [40, 40, 40, 180];

/**
 * Default label background padding in pixels
 */
export const DEFAULT_LABEL_PADDING = 4;

/**
 * Default font family for labels
 */
export const DEFAULT_FONT_FAMILY = 'Monaco, monospace';

/**
 * Default font size for labels in pixels
 */
export const DEFAULT_FONT_SIZE = 12;
