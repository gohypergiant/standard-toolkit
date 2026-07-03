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

import type { Color, CompositeLayerProps } from '@deck.gl/core';
import type { DistanceUnit } from '@accelint/constants/units';

/**
 * Props for the `MeasurementLayer` composite layer.
 *
 * The layer is controlled (pure function of props). Pass `pointA` and `pointB`
 * to render a dashed line, circular endpoints, and an optional measurement label.
 */
export type MeasurementLayerProps = CompositeLayerProps & {
  /**
   * Origin coordinate as `[longitude, latitude]`.
   */
  pointA: [number, number];
  /**
   * Destination coordinate as `[longitude, latitude]`.
   */
  pointB: [number, number];
  /**
   * Whether to render the measurement label at the line midpoint.
   * @defaultValue true
   */
  showLabel?: boolean;
  /**
   * Custom label function. Receives `pointA`, `pointB`, and `units`, and returns
   * the string to display at the midpoint. When omitted, the default label format
   * is `"42.3 km / 22.8 NM | BRG: 321°"`.
   *
   * @param pointA - The origin coordinate as `[longitude, latitude]`
   * @param pointB - The destination coordinate as `[longitude, latitude]`
   * @param units - The unit(s) passed to the layer
   * @returns The label string to render at the midpoint
   */
  getLabel?: (
    pointA: [number, number],
    pointB: [number, number],
    units: DistanceUnit | DistanceUnit[],
  ) => string;
  /**
   * Distance unit(s) for the measurement readout.
   * Single unit produces `"42.3 km"`; dual units produce `"42.3 km / 22.8 NM"`.
   * @defaultValue `['kilometers', 'nauticalmiles']`
   */
  units?: DistanceUnit | DistanceUnit[];
  /**
   * RGBA color for the dashed measurement line.
   * @defaultValue `[255, 255, 255, 200]`
   */
  lineColor?: Color;
  /**
   * RGBA color for the circular endpoint markers at `pointA` and `pointB`.
   * @defaultValue `[255, 255, 255, 255]`
   */
  endpointColor?: Color;
};
