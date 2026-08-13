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

import type { Color } from '@deck.gl/core';
import { designTokens } from '@accelint/design-foundation/tokens';

export const DEFAULT_LINE_COLOR: Color =
  designTokens.dark.outline.interactive.base;

export const DEFAULT_LABEL_COLOR: Color = designTokens.dark.fg.info.hover;

export const DEFAULT_FONT_WEIGHT: string = 'normal';

export const DEFAULT_LABEL_BACKGROUND_COLOR: Color = [255, 255, 255, 30];

export const DEFAULT_LABEL_PADDING: [number, number] = [4, 4];

export const DEFAULT_FONT_FAMILY = 'system-ui, sans-serif';

export const DEFAULT_STYLES = {
  alignmentBaseline: 'center' as const,
  backgroundColor: DEFAULT_LABEL_BACKGROUND_COLOR,
  backgroundPadding: DEFAULT_LABEL_PADDING,
  lineColor: DEFAULT_LINE_COLOR,
  labelColor: DEFAULT_LABEL_COLOR,
  labelSize: 12,
  textAnchor: 'middle' as const,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontWeight: DEFAULT_FONT_WEIGHT,
  hoverColor: [0, 0, 0, 0] as const,
  selectedColor: [0, 0, 0, 0] as const,
};
