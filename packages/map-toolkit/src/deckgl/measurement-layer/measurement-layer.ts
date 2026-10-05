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

import { CompositeLayer } from '@deck.gl/core';
import { PathLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { PathStyleExtension } from '@deck.gl/extensions';
import {
  bearing as geoBearing,
  distance as geoDistance,
  greatCirclePoints,
} from '@accelint/geo/geodesy';
import { formatBearing, formatDistance } from '@accelint/formatters/bearing';
import { toLonLat } from '@/shared/coordinates';
import {
  DASH_ARRAYS,
  DEFAULT_EDIT_HANDLE_COLOR,
  DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
  DEFAULT_EDIT_HANDLE_RADIUS,
  TOOLTIP_SUBLAYER_PROPS,
} from '../shapes/shared/constants';
import type { Color, DefaultProps, Layer } from '@deck.gl/core';
import type { DistanceUnit } from '@accelint/constants/units';
import type { MeasurementLayerProps } from './types';

/** Default RGBA color for the measurement line (white, 78% opacity) */
const DEFAULT_LINE_COLOR: Color = [255, 255, 255, 200];

/** Default units: dual km + NM covers both maritime/air and land operations */
const DEFAULT_UNITS: DistanceUnit[] = ['kilometers', 'nauticalmiles'];

/** Stable PathStyleExtension instance — avoids re-creating per render */
const PATH_STYLE_EXTENSION = new PathStyleExtension({ dash: true });

/**
 * Resolves the `units` prop to something `formatDistance` accepts: a single
 * unit, or an array of one or two units. An omitted prop and arrays outside
 * that range fall back to `DEFAULT_UNITS` so a bad prop never throws inside
 * `renderLayers`.
 */
function resolveUnits(
  units?: DistanceUnit | DistanceUnit[],
): DistanceUnit | DistanceUnit[] {
  if (units === undefined) {
    return DEFAULT_UNITS;
  }

  if (!Array.isArray(units)) {
    return units;
  }

  if (units.length < 1 || units.length > 2) {
    return DEFAULT_UNITS;
  }

  return units;
}

/**
 * Builds the default measurement label string.
 *
 * Formats as `"42.3 km / 22.8 NM | BRG: 321°"` (dual units) or
 * `"42.3 km | BRG: 321°"` (single unit), using great-circle distance and
 * initial bearing from `@accelint/formatters`.
 *
 * @param pointA - Origin coordinate `[longitude, latitude]`
 * @param pointB - Destination coordinate `[longitude, latitude]`
 * @param units - Single or dual distance unit(s), already resolved by `resolveUnits`
 * @returns Formatted measurement label string
 */
function buildDefaultLabel(
  pointA: [number, number],
  pointB: [number, number],
  units: DistanceUnit | DistanceUnit[],
): string {
  const meters = geoDistance(pointA, pointB);
  const bearingDegrees = geoBearing(pointA, pointB);

  const distanceLabel = formatDistance(meters, units);
  const bearingLabel = formatBearing(bearingDegrees);

  return `${distanceLabel} | BRG: ${bearingLabel}`;
}

/**
 * A controlled deck.gl composite layer that renders a bearing-range measurement
 * between two geographic points.
 *
 * Composes three sub-layers:
 * - **PathLayer** — dashed great-circle line from `pointA` to `pointB`
 * - **ScatterplotLayer** — circular markers at `pointA` and `pointB`
 * - **TextLayer** — measurement readout at the middle vertex of the line (optional)
 *
 * The line is sampled with `greatCirclePoints` from `@accelint/geo/geodesy`, so
 * long segments follow the geodesic instead of a straight Mercator chord and a
 * segment that crosses the antimeridian stays monotonic in longitude (drawn
 * the short way, e.g. 179° → 181°).
 *
 * The layer is a pure function of its props (controlled). Combine it with the
 * `useMeasurement` hook for interactive drag-based measurement, or use it directly
 * for static display.
 *
 * For JSX fiber usage, import `@accelint/map-toolkit/deckgl/measurement-layer/fiber`
 * once to register the `<measurementLayer />` intrinsic element.
 *
 * @example
 * ```tsx
 * // Controlled usage with the hook
 * function MeasurementOverlay() {
 *   const { pointA, pointB } = useMeasurement();
 *
 *   if (!pointA || !pointB) return null;
 *
 *   return (
 *     <MeasurementLayer
 *       pointA={pointA}
 *       pointB={pointB}
 *       showLabel
 *       units={['kilometers', 'nauticalmiles']}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Static display of a fixed bearing-range line
 * <MeasurementLayer
 *   pointA={[-97.0, 32.7]}
 *   pointB={[-90.1, 29.9]}
 *   lineColor={[0, 200, 255, 200]}
 *   endpointColor={[0, 200, 255, 255]}
 *   showLabel
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom label format
 * <MeasurementLayer
 *   pointA={pointA}
 *   pointB={pointB}
 *   getLabel={(pointA, pointB) => `${pointA.join(',')} → ${pointB.join(',')}`}
 * />
 * ```
 */
export class MeasurementLayer extends CompositeLayer<MeasurementLayerProps> {
  static override layerName = 'MeasurementLayer';

  // Only the color props are declared here: `type: 'color'` makes deck.gl
  // deep-compare them on prop diff, so inline `[r, g, b, a]` literals from
  // consumers don't force a sublayer rebuild on every parent render.
  static override defaultProps: DefaultProps<MeasurementLayerProps> = {
    lineColor: { type: 'color', value: DEFAULT_LINE_COLOR },
    endpointColor: { type: 'color', value: DEFAULT_EDIT_HANDLE_COLOR },
  };

  /** Builds the dashed geodesic path, endpoint markers, and (when `showLabel`) the label at the middle vertex. */
  override renderLayers(): Layer[] {
    // Defaults live in the destructuring, not `defaultProps`: deck.gl copies an
    // explicit `undefined` prop over a declared default, and JSX forwards
    // omitted optional props as `undefined`.
    const {
      showLabel = true,
      getLabel = buildDefaultLabel,
      lineColor = DEFAULT_LINE_COLOR,
      endpointColor = DEFAULT_EDIT_HANDLE_COLOR,
    } = this.props;
    const units = resolveUnits(this.props.units);
    const pointA = toLonLat(this.props.pointA);
    const pointB = toLonLat(this.props.pointB);

    // Non-finite points mean "no measurement"; geo's functions throw on them.
    if (!(pointA && pointB)) {
      return [];
    }

    // `greatCirclePoints` always returns at least the two endpoints.
    const vertices = greatCirclePoints(pointA, pointB);
    const firstVertex = vertices[0] as [number, number];
    const lastVertex = vertices[vertices.length - 1] as [number, number];

    const layers: Layer[] = [
      new PathLayer({
        id: `${this.id}-path`,
        data: [{ path: vertices }],
        getPath: (datum: { path: [number, number][] }) => datum.path,
        getColor: lineColor,
        getWidth: 2,
        widthUnits: 'pixels',
        pickable: false,
        getDashArray: DASH_ARRAYS.dashed,
        dashJustified: true,
        extensions: [PATH_STYLE_EXTENSION],
      }),
      new ScatterplotLayer({
        id: `${this.id}-endpoints`,
        data: [firstVertex, lastVertex],
        getPosition: (datum: [number, number]) => datum,
        getRadius: DEFAULT_EDIT_HANDLE_RADIUS,
        radiusUnits: 'pixels',
        getFillColor: endpointColor,
        getLineColor: DEFAULT_EDIT_HANDLE_OUTLINE_COLOR,
        lineWidthUnits: 'pixels',
        getLineWidth: 1,
        stroked: true,
        filled: true,
        pickable: false,
      }),
    ];

    if (showLabel) {
      layers.push(
        new TextLayer({
          id: `${this.id}-label`,
          data: [
            {
              position: vertices[Math.floor(vertices.length / 2)],
              text: getLabel(pointA, pointB, units),
            },
          ],
          ...TOOLTIP_SUBLAYER_PROPS.tooltips,
          getTextAnchor: 'middle',
          getAlignmentBaseline: 'bottom',
          getPixelOffset: [0, -8],
          billboard: true,
          pickable: false,
        }),
      );
    }

    return layers;
  }
}
