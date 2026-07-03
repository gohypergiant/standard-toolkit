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

'use client';

import 'client-only';
import type { Color } from '@deck.gl/core';
import type { DistanceUnit } from '@accelint/constants/units';
import type { UniqueId } from '@accelint/core';
import type { RequiresModifier } from './use-measurement';
import './fiber';
import { useMeasurement } from './use-measurement';

/**
 * Props for the `MeasurementTool` convenience component.
 */
export type MeasurementToolProps = {
  /**
   * Map instance ID. Falls back to `MapContext` when omitted.
   * Required when used outside of a `MapProvider` (i.e., outside BaseMap children).
   */
  mapId?: UniqueId;
  /**
   * Whether to render the on-canvas measurement label at the line midpoint.
   * Set to `false` if you render the readout externally (e.g., in a sidebar).
   * @defaultValue true
   */
  showLabel?: boolean;
  /**
   * Distance unit(s) for the measurement readout.
   * Single unit: `'kilometers'` → `"42.3 km"`.
   * Dual units: `['kilometers', 'nauticalmiles']` → `"42.3 km / 22.8 NM"`.
   * @defaultValue `['kilometers', 'nauticalmiles']`
   */
  units?: DistanceUnit | DistanceUnit[];
  /**
   * If set, measurement only activates when this modifier key is held during drag.
   * Allows plain drag to continue panning the map while `Shift+drag` (or `Ctrl`/`Alt`)
   * triggers measurement.
   * @defaultValue undefined (all drag events trigger measurement)
   */
  requiresModifier?: RequiresModifier;
  /**
   * Custom label function. Receives `pointA`, `pointB`, and `units`, and returns the
   * label string to render at the line midpoint. When provided, overrides the default
   * `"X km / Y NM | BRG: ZZZ°"` format.
   */
  getLabel?: (
    pointA: [number, number],
    pointB: [number, number],
    units: DistanceUnit | DistanceUnit[],
  ) => string;
  /**
   * RGBA color for the measurement line.
   * Forwarded to `MeasurementLayer`.
   */
  lineColor?: Color;
  /**
   * RGBA color for the endpoint circles at pointA and pointB.
   * Forwarded to `MeasurementLayer`.
   */
  endpointColor?: Color;
};

/**
 * Convenience component that wires `useMeasurement` and `MeasurementLayer` together.
 *
 * Drop `<MeasurementTool />` inside a `<BaseMap>` and drag to measure bearing and
 * distance between two points. The component subscribes to `map:dragStart`,
 * `map:drag`, and `map:dragEnd` events from the bus, renders a dashed line with
 * circular endpoints and an optional readout label, and suppresses map pan during
 * the measurement drag.
 *
 * The measurement layer is only rendered when a drag is active and both `pointA`
 * and `pointB` are set, so there is no visual overhead when the tool is idle.
 *
 * For direct control over layer props, use `useMeasurement` + `MeasurementLayer`
 * separately. For JSX fiber usage, see `MeasurementLayer` and its fiber registration.
 *
 * @param props - See {@link MeasurementToolProps}
 *
 * @example
 * ```tsx
 * // Plug-and-play inside BaseMap (mapId inferred from context)
 * <BaseMap id="main">
 *   <MeasurementTool />
 * </BaseMap>
 * ```
 *
 * @example
 * ```tsx
 * // Require Shift key to activate measurement; plain drag continues to pan
 * <BaseMap id="main">
 *   <MeasurementTool requiresModifier="shift" />
 * </BaseMap>
 * ```
 *
 * @example
 * ```tsx
 * // Single-unit readout with custom line color
 * <BaseMap id="main">
 *   <MeasurementTool
 *     units="nauticalmiles"
 *     lineColor={[255, 200, 0, 200]}
 *     endpointColor={[255, 200, 0, 255]}
 *   />
 * </BaseMap>
 * ```
 *
 * @example
 * ```tsx
 * // Custom label format
 * <BaseMap id="main">
 *   <MeasurementTool
 *     getLabel={(a, b, units) => `From ${a.join(',')} to ${b.join(',')}`}
 *   />
 * </BaseMap>
 * ```
 */
export function MeasurementTool({
  mapId,
  showLabel,
  units,
  requiresModifier,
  getLabel,
  lineColor,
  endpointColor,
}: MeasurementToolProps) {
  const { isMeasuring, pointA, pointB } = useMeasurement(
    mapId,
    requiresModifier,
  );

  if (!isMeasuring || !pointA || !pointB) {
    return null;
  }

  return (
    <measurementLayer
      id='measurement-tool-layer'
      pointA={pointA}
      pointB={pointB}
      showLabel={showLabel}
      units={units}
      getLabel={getLabel}
      lineColor={lineColor}
      endpointColor={endpointColor}
    />
  );
}
