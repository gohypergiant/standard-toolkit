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
  DISTANCE_UNIT_SYMBOLS,
  type DistanceUnit,
} from '@accelint/constants/units';
import {
  type DraggingEvent,
  type FeatureCollection,
  type GeoJsonEditMode,
  type ModeProps,
  ResizeCircleMode,
  type StopDraggingEvent,
  TranslateMode,
} from '@deck.gl-community/editable-layers';
import { centroid, circle, distance } from '@turf/turf';
import { DEFAULT_DISTANCE_UNITS } from '@/shared/units';
import { formatCircleTooltip } from '../../shared/constants';
import { computeCircleMeasurements } from '../../shared/utils/geometry-measurements';
import { BaseTransformMode, type HandleMatcher } from './base-transform-mode';
import type { Feature, Polygon } from 'geojson';

/**
 * Transform mode for circles combining resize and translate.
 *
 * ## Capabilities
 * This composite mode provides:
 * - **Resize** (ResizeCircleMode): Drag edge to resize from center
 * - **Translation** (TranslateMode): Drag the circle body to move it
 * - **Live tooltip**: Shows radius and area during resize
 *
 * ## Handle Priority Logic
 * When drag starts, modes are evaluated in this priority order:
 * 1. If dragging on the edge/handle → resize takes priority
 * 2. Otherwise → dragging the circle body translates it
 *
 * ## Resize Behavior
 * Unlike scale operations in BoundingTransformMode, circle resize maintains
 * the shape's circular geometry by resizing from the center point. The center
 * remains fixed while the radius changes based on cursor distance.
 *
 * @example
 * ```typescript
 * import { CircleTransformMode } from '@accelint/map-toolkit/deckgl/shapes/edit-shape-layer/modes/circle-transform-mode';
 * import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
 *
 * // Used internally by EditShapeLayer for circles
 * const mode = new CircleTransformMode();
 *
 * const layer = new EditableGeoJsonLayer({
 *   mode,
 *   data: circleFeatureCollection,
 *   selectedFeatureIndexes: [0],
 *   onEdit: handleEdit,
 *   modeConfig: { distanceUnits: 'kilometers' },
 *   // ... other props
 * });
 * ```
 */
/** Validated selection data extracted from editor props. */
type SelectedCircleData = {
  /** Index of the selected feature in the feature collection. */
  selectedIndex: number;
  /** The selected circle feature (validated as Polygon geometry). */
  feature: Feature<Polygon>;
  /** Outer ring coordinates of the polygon (validated to have >= 3 points). */
  coordinates: [number, number][];
};

export class CircleTransformMode extends BaseTransformMode {
  private resizeMode: ResizeCircleMode;
  private translateMode: TranslateMode;

  /** Cached center point — invariant during resize (ResizeCircleMode resizes from fixed center) */
  private cachedCenter: [number, number] | null = null;

  constructor() {
    const resizeMode = new ResizeCircleMode();
    const translateMode = new TranslateMode();

    // Order matters: resize first so edge handles take priority
    super([resizeMode, translateMode]);

    this.resizeMode = resizeMode;
    this.translateMode = translateMode;
  }

  /**
   * Extracts and validates the selected circle feature from editor props.
   *
   * @param props - Current editor mode props containing selection and feature data.
   * @returns Validated circle data, or null if no valid circle is selected.
   */
  private getSelectedCircleData(
    props: ModeProps<FeatureCollection>,
  ): SelectedCircleData | null {
    const selectedIndex = props.selectedIndexes?.[0];
    if (selectedIndex === undefined) {
      return null;
    }

    const feature = props.data.features[selectedIndex] as
      | Feature<Polygon>
      | undefined;
    if (!feature || feature.geometry.type !== 'Polygon') {
      return null;
    }

    const coordinates = feature.geometry.coordinates[0] as
      | [number, number][]
      | undefined;
    if (!coordinates || coordinates.length < 3) {
      return null;
    }

    return { selectedIndex, feature, coordinates };
  }

  /** Resets drag state and clears the cached center point. */
  protected override resetDragState(): void {
    super.resetDragState();
    this.cachedCenter = null;
  }

  protected override getHandleMatchers(): HandleMatcher[] {
    return [
      {
        // Resize handle: intermediate point on circle edge
        match: (pick) =>
          Boolean(
            pick.isGuide &&
              pick.object?.properties?.guideType === 'editHandle' &&
              pick.object?.properties?.editHandleType === 'intermediate',
          ),
        mode: this.resizeMode,
        // No shift config - resize doesn't have modifiers
      },
    ];
  }

  protected override getDefaultMode(): GeoJsonEditMode {
    // biome-ignore lint/suspicious/noExplicitAny: Library type inconsistency — see HandleMatcher JSDoc in base-transform-mode
    return this.translateMode as any;
  }

  /**
   * Emit a 'resized' completion event when circle resize ends.
   *
   * ResizeCircleMode (from the library) only emits 'unionGeometry' during drag
   * and does NOT emit a completion event on stop. Without this, the final geometry
   * is only committed via RAF batching, which can be cancelled if the user saves
   * immediately (Enter key calls cancelPendingUpdate before the RAF fires).
   *
   * This override ensures featureBeingEdited receives an immediate update with the
   * final geometry, matching the pattern used by ScaleMode ('scaled'),
   * RotateMode ('rotated'), and TranslateMode ('translated').
   *
   * @param event - The stop dragging event containing final cursor position.
   * @param props - Current editor mode props with feature data and edit callback.
   */
  override handleStopDragging(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // Capture before super resets activeDragMode to null
    const wasResizing = this.activeDragMode === this.resizeMode;

    // Delegate to ResizeCircleMode.handleStopDragging (resets internal state)
    // and then resetDragState (clears activeDragMode, tooltip, etc.)
    super.handleStopDragging(event, props);

    if (!wasResizing) {
      return;
    }

    // Compute the final geometry at the stop position and emit completion event
    const data = this.getSelectedCircleData(props);
    if (!data) {
      return;
    }

    const { selectedIndex, feature, coordinates } = data;
    const center =
      this.cachedCenter ??
      (centroid(feature).geometry.coordinates as [number, number]);
    const numberOfSteps = coordinates.length - 1;
    const radius = Math.max(distance(center, event.mapCoords), 0.001);
    const updatedGeometry = circle(center, radius, {
      steps: numberOfSteps,
    }).geometry;

    const updatedFeatures = props.data.features.map((f, i) =>
      i === selectedIndex ? { ...f, geometry: updatedGeometry } : f,
    );

    props.onEdit({
      updatedData: { ...props.data, features: updatedFeatures },
      editType: 'resized',
      editContext: { featureIndexes: [selectedIndex] },
    });
  }

  /**
   * Update the tooltip with circle radius and area during resize.
   *
   * @param event - The drag event containing current cursor map coordinates.
   * @param props - Current editor mode props with feature data and distance units config.
   */
  protected override onDragging(
    event: DraggingEvent,
    props: ModeProps<FeatureCollection>,
  ): void {
    // Only show tooltip when resizing
    if (this.activeDragMode !== this.resizeMode) {
      return;
    }

    const { mapCoords } = event;
    const distanceUnits =
      (props.modeConfig?.distanceUnits as DistanceUnit) ??
      DEFAULT_DISTANCE_UNITS;

    // Get the selected feature to calculate radius from its geometry
    const data = this.getSelectedCircleData(props);
    if (!data) {
      this.tooltip = null;
      return;
    }

    const { feature, coordinates } = data;

    // Cache center — invariant during resize, avoids O(v) centroid per frame
    if (!this.cachedCenter) {
      this.cachedCenter = centroid(feature).geometry.coordinates as [
        number,
        number,
      ];
    }

    const firstPoint = coordinates[0] as [number, number];
    const { radius, area } = computeCircleMeasurements(
      this.cachedCenter,
      firstPoint,
      distanceUnits,
    );
    const unitAbbrev = DISTANCE_UNIT_SYMBOLS[distanceUnits];

    // Position tooltip at cursor - offset is applied via getPixelOffset in sublayer props
    this.tooltip = {
      position: mapCoords,
      text: formatCircleTooltip(radius, area, unitAbbrev),
    };
  }
}
