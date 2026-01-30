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

import { DEFAULT_TEXT_STYLE } from '../text-settings';
import type { TextLayerProps as DglTextLayerProps } from '@deck.gl/layers';

/**
 * Default settings for TextLayer with opinionated styling.
 *
 * Provides consistent text rendering with white text, black outline,
 * centered alignment, and system font stack for optimal performance.
 *
 * @example
 * ```typescript
 * import { TextLayer } from '@accelint/map-toolkit/deckgl/text-layer';
 * import { defaultSettings } from '@accelint/map-toolkit/deckgl/text-layer/default-settings';
 *
 * // Use defaults as-is
 * const layer = new TextLayer({
 *   id: 'text',
 *   data: [...],
 *   ...defaultSettings,
 * });
 *
 * // Override specific defaults
 * const customLayer = new TextLayer({
 *   id: 'text',
 *   data: [...],
 *   ...defaultSettings,
 *   fontFamily: 'Arial',
 *   getSize: 14,
 * });
 * ```
 */
export const defaultSettings: Partial<DglTextLayerProps> = {
  ...DEFAULT_TEXT_STYLE,
  fontFamily: 'system-ui, sans-serif',
  getAlignmentBaseline: 'center',
  getTextAnchor: 'middle',
  lineHeight: 1,
} as const;
