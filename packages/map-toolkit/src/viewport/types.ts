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

import type { DistanceUnitSymbol } from '@accelint/constants/units';
import type { Bounds } from '../deckgl/base-map/types';

/** Arguments for {@link getViewportSize}. */
export type GetViewportSizeArgs = {
  /** Geographic bounds, undefined if viewport not yet initialized */
  bounds?: Bounds;
  /** Map zoom level for meters-per-pixel calculation. */
  zoom: number;
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  /** Distance unit symbol. Defaults to `'NM'`. */
  unit?: DistanceUnitSymbol;
  /** Number formatter for localization. Defaults to `en-US`. */
  formatter?: Intl.NumberFormat;
};

/** A geographic coordinate as `[longitude, latitude]`. */
export type GeoCoordinate = [longitude: number, latitude: number];
