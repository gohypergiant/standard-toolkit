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

import {
  DISTANCE_UNIT_BY_SYMBOL,
  DISTANCE_UNIT_SYMBOLS,
} from '@accelint/constants/units';
import { convertLength } from '@turf/turf';
import { formatDistance } from '../../shared/constants';
import { isCircleShape } from '../../shared/types';
import type { DistanceUnitSymbol } from '@accelint/constants/units';
import type { Shape } from '../../shared/types';

const DEFAULT_RADIUS_DISPLAY_SYMBOL: DistanceUnitSymbol =
  DISTANCE_UNIT_SYMBOLS.nauticalmiles;

/**
 * Get the formatted radius label text for a circle shape.
 * Returns null for non-circle shapes.
 *
 * Uses the same `formatDistance` formatter as draw/edit tooltips for consistency.
 * Unlike `formatCircleTooltip` (which shows both radius and area during draw/edit),
 * this returns only the radius line for hover display.
 *
 * @param shape - The shape to get radius text for
 * @param unitSymbol - Display unit symbol (e.g., 'km', 'NM'). Defaults to 'NM'.
 * @returns Formatted radius string (e.g., "r: 250.00 NM") or null for non-circle shapes
 */
export function getRadiusLabelText(
  shape: Shape,
  unitSymbol?: DistanceUnitSymbol,
): string | null {
  if (!isCircleShape(shape)) {
    return null;
  }

  const { value, units } = shape.feature.properties.circleProperties.radius;
  const displaySymbol = unitSymbol ?? DEFAULT_RADIUS_DISPLAY_SYMBOL;
  const targetUnit = DISTANCE_UNIT_BY_SYMBOL[displaySymbol];

  const convertedValue =
    units === targetUnit ? value : convertLength(value, units, targetUnit);

  return `r: ${formatDistance(convertedValue)} ${displaySymbol}`;
}
