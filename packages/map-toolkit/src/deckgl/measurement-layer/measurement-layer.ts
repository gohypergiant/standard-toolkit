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
} from '@accelint/geo/geodesy';
import { formatBearing, formatDistance } from '@accelint/formatters/bearing';
import { DASH_ARRAYS, TOOLTIP_CHARACTER_SET } from '../shapes/shared/constants';
import { DEFAULT_TEXT_STYLE, SDF_FONT_SETTINGS } from '../text-settings';
import type { Color, Layer } from '@deck.gl/core';
import type { DistanceUnit } from '@accelint/constants/units';
import type { MeasurementLayerProps } from './types';

/** Default RGBA color for the measurement line (white, 78% opacity) */
const DEFAULT_LINE_COLOR: Color = [255, 255, 255, 200];

/** Default RGBA color for the endpoint circles (white, fully opaque) */
const DEFAULT_ENDPOINT_COLOR: Color = [255, 255, 255, 255];

/** Default units: dual km + NM covers both maritime/air and land operations */
const DEFAULT_UNITS: DistanceUnit[] = ['kilometers', 'nauticalmiles'];

/** Stable PathStyleExtension instance — avoids re-creating per render */
const PATH_STYLE_EXTENSION = new PathStyleExtension({ dash: true });

/** Stable line color array for scatterplot endpoint borders */
const ENDPOINT_LINE_COLOR: Color = [0, 0, 0, 200];

/**
 * Builds the default measurement label string.
 *
 * Formats as `"42.3 km / 22.8 NM | BRG: 321°"` (dual units) or
 * `"42.3 km | BRG: 321°"` (single unit), using great-circle distance and
 * initial bearing from `@accelint/formatters`.
 *
 * @param pointA - Origin coordinate `[longitude, latitude]`
 * @param pointB - Destination coordinate `[longitude, latitude]`
 * @param units - Single or dual distance unit(s)
 * @returns Formatted measurement label string
 */
function buildDefaultLabel(
  pointA: [number, number],
  pointB: [number, number],
  units: DistanceUnit | DistanceUnit[],
): string {
  const meters = geoDistance(pointA, pointB);
  const brg = geoBearing(pointA, pointB);

  const distStr = formatDistance(meters, units);
  const brgStr = formatBearing(brg);

  return `${distStr} | BRG: ${brgStr}`;
}

/**
 * Computes the geographic midpoint between two `[longitude, latitude]` coordinates
 * using simple linear interpolation (sufficient for short measurement lines).
 *
 * @param pointA - Origin coordinate `[longitude, latitude]`
 * @param pointB - Destination coordinate `[longitude, latitude]`
 * @returns Midpoint coordinate `[longitude, latitude]`
 */
function midpoint(
  pointA: [number, number],
  pointB: [number, number],
): [number, number] {
  return [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
}

/**
 * A controlled deck.gl composite layer that renders a bearing-range measurement
 * between two geographic points.
 *
 * Composes three sub-layers:
 * - **PathLayer** — dashed line connecting `pointA` to `pointB`
 * - **ScatterplotLayer** — circular markers at `pointA` and `pointB`
 * - **TextLayer** — measurement readout at the line midpoint (optional)
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
 *   getLabel={(a, b) => `${a.join(',')} → ${b.join(',')}`}
 * />
 * ```
 */
export class MeasurementLayer extends CompositeLayer<MeasurementLayerProps> {
  static override layerName = 'MeasurementLayer';

  override renderLayers(): Layer[] {
    const {
      pointA,
      pointB,
      showLabel = true,
      getLabel = buildDefaultLabel,
      units = DEFAULT_UNITS,
      lineColor = DEFAULT_LINE_COLOR,
      endpointColor = DEFAULT_ENDPOINT_COLOR,
    } = this.props;

    const layers: Layer[] = [
      new PathLayer({
        id: `${this.id}-path`,
        data: [{ path: [pointA, pointB] }],
        getPath: (d: { path: [number, number][] }) => d.path,
        getColor: lineColor,
        getWidth: 2,
        widthUnits: 'pixels',
        pickable: false,
        getDashArray: DASH_ARRAYS.dashed ?? [8, 4],
        dashJustified: true,
        extensions: [PATH_STYLE_EXTENSION],
      }),
      new ScatterplotLayer({
        id: `${this.id}-endpoints`,
        data: [pointA, pointB],
        getPosition: (d: [number, number]) => d,
        getRadius: 6,
        radiusUnits: 'pixels',
        getFillColor: endpointColor,
        getLineColor: ENDPOINT_LINE_COLOR,
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
              position: midpoint(pointA, pointB),
              text: getLabel(pointA, pointB, units),
            },
          ],
          getText: (d: { text: string }) => d.text,
          getPosition: (d: { position: [number, number] }) => d.position,
          ...DEFAULT_TEXT_STYLE,
          fontSettings: { ...SDF_FONT_SETTINGS },
          fontFamily: 'Roboto MonoVariable, monospace',
          characterSet: TOOLTIP_CHARACTER_SET,
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
