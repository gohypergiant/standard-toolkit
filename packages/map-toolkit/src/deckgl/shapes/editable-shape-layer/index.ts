/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
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

import { CompositeLayer } from '@deck.gl/core';
import { PathStyleExtension } from '@deck.gl/extensions';
import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
import { createShapeLabelLayer } from '../display-shape-layer/shape-label-layer';
import {
  getDashArray,
  getFillColor,
  getStrokeColor,
  getStrokeWidth,
} from '../display-shape-layer/utils/display-style';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import {
  createEditHighlightHoveredLayer,
  createEditHighlightSelectedLayer,
} from './edit-highlight-layer';
import { createMode } from './modes';
import type {
  FeatureCollection,
  ModeProps,
} from '@deck.gl-community/editable-layers';
import type { EditShapeMode } from '../shared/events';
import type { EditableShape, ShapeFeature, ShapeId } from '../shared/types';

/**
 * Stable PathStyleExtension instance to prevent layer recreation on every render.
 * Creating this at module level ensures the same object identity is used across renders,
 * which prevents deck.gl from thinking the layer configuration has changed.
 */
const PATH_STYLE_EXTENSION = new PathStyleExtension({ dash: true });

/**
 * Stable accessor functions for _subLayerProps.geojson
 * These must be defined at module level to maintain stable function identities.
 * Creating new functions on every render causes deck.gl to think the layer config changed.
 */
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer color accessor signature
const STABLE_GET_FILL_COLOR = (f: any) => getFillColor(f) as any;
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer color accessor signature
const STABLE_GET_LINE_COLOR = (f: any) => getStrokeColor(f) as any;
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor signature
const STABLE_GET_LINE_WIDTH = (f: any) => getStrokeWidth(f);
// biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor signature
const STABLE_GET_DASH_ARRAY = (f: any) => getDashArray(f);

export interface EditableShapeLayerProps {
  id?: string;
  data: EditableShape[];
  mode?: EditShapeMode;
  selectedShapeId?: ShapeId;
  hoveredShapeId?: ShapeId;
  showLabels?: boolean;
  pickable?: boolean;
  highlightColor?: [number, number, number, number];

  // Edit callback - called when shape geometry is modified
  onEdit?: (
    editType: string,
    updatedData: FeatureCollection,
    editContext: any,
  ) => void;
}

/**
 * Default props for EditableShapeLayer
 */
const DEFAULT_EDITABLE_PROPS = {
  pickable: true,
  showLabels: true,
  mode: 'view' as EditShapeMode,
  highlightColor: [40, 245, 190, 100] as [number, number, number, number],
};

/**
 * EditableShapeLayer - Main layer for editable shapes
 * Renders shapes with editing capabilities using EditableGeoJsonLayer
 */
export class EditableShapeLayer extends CompositeLayer<EditableShapeLayerProps> {
  static override layerName = 'EditableShapeLayer';
  static override defaultProps = DEFAULT_EDITABLE_PROPS;

  /**
   * Convert EditableShape[] to FeatureCollection for EditableGeoJsonLayer
   *
   * IMPORTANT: EditableGeoJsonLayer should only receive a SINGLE shape at a time.
   * This matches NGC2's architecture where:
   * - DisplayShapeLayer shows ALL shapes (read-only)
   * - EditableShapeLayer shows ONLY the shape being edited
   *
   * Rendering multiple shapes in EditableGeoJsonLayer causes exponential
   * interaction complexity and infinite render loops.
   */
  getFeatureCollection(): FeatureCollection {
    const { data, selectedShapeId, mode } = this.props;

    let shapesToEdit: EditableShape[] = [];

    // Only include the selected shape when in modify mode
    if (mode === 'modify' && selectedShapeId) {
      const selectedShape = data.find((s) => s.id === selectedShapeId);
      if (selectedShape) {
        shapesToEdit = [selectedShape];
      }
    }
    // For drawing modes: empty array (new shape will be added by deck.gl)
    // For view mode: empty array (DisplayShapeLayer handles viewing)

    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      // biome-ignore lint/suspicious/noExplicitAny: GeoJSON FeatureCollection type compatibility
      features: shapesToEdit.map((shape) => shape.feature) as any,
    };

    // Debug logging
    if (mode === 'modify' && shapesToEdit.length > 0) {
      console.log('[EditableShapeLayer] Feature collection for modify mode:', {
        mode,
        selectedShapeId,
        featureCount: featureCollection.features.length,
        firstFeature: featureCollection.features[0],
        geometryType: featureCollection.features[0]?.geometry?.type,
        coordinatesLength:
          featureCollection.features[0]?.geometry?.coordinates?.length,
      });
    }

    return featureCollection;
  }

  /**
   * Find shape by feature
   */
  findShapeByFeature(feature: ShapeFeature): EditableShape | undefined {
    const { data } = this.props;
    return data.find((shape) => shape.feature === feature);
  }

  /**
   * NOTE: We do NOT override getPickingInfo for EditableShapeLayer.
   *
   * EditableGeoJsonLayer handles its own picking internally for drag operations
   * and edit handle interactions. Overriding getPickingInfo here interferes with
   * the drag events and prevents edit handles from being draggable.
   *
   * This differs from DisplayShapeLayer which DOES override getPickingInfo
   * because it needs custom click/hover handling for shape selection.
   *
   * EditableShapeLayer's onClick/onHover are passed directly to EditableGeoJsonLayer
   * and do not require getPickingInfo interception.
   */

  /**
   * Handle edits from EditableGeoJsonLayer
   */
  handleEdit = (
    params: Parameters<NonNullable<ModeProps<any>['onEdit']>>[0],
  ) => {
    const { onEdit } = this.props;
    if (!onEdit) {
      return;
    }

    const { editType, updatedData, editContext } = params;
    onEdit(editType, updatedData, editContext);
  };

  /**
   * Render the editable layer
   */
  renderEditableLayer(): EditableGeoJsonLayer {
    const {
      id = SHAPE_LAYER_IDS.EDIT,
      mode = 'view',
      selectedShapeId,
    } = this.props;

    const featureCollection = this.getFeatureCollection();
    const modeInstance = createMode(mode);

    // Ensure selectedFeatureIndexes is only set when we actually have features
    // Setting [0] with empty features causes nebula.gl to crash with undefined position errors
    const hasFeatures = featureCollection.features.length > 0;
    const selectedFeatureIndexes =
      mode === 'modify' && selectedShapeId && hasFeatures ? [0] : [];

    // Debug: Log layer creation
    console.log('[EditableShapeLayer] Creating EditableGeoJsonLayer:', {
      id,
      mode,
      modeInstance,
      modeInstanceIdentity: modeInstance === createMode(mode),
      dataIdentity: featureCollection,
      hasFeatures,
      selectedFeatureIndexes,
    });

    // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer data type compatibility
    return new EditableGeoJsonLayer({
      id,
      data: featureCollection as any,
      mode: modeInstance,
      // Tell deck.gl which feature is selected for editing (shows edit handles)
      selectedFeatureIndexes,

      // Interaction
      pickable: this.props.pickable,
      onEdit: this.handleEdit,

      // Edit handles styling
      editHandlePointRadiusScale: 2,
      editHandlePointRadiusMinPixels: 4,
      editHandlePointRadiusMaxPixels: 8,

      // Sub-layer props - configure all styling through geojson sublayer like NGC2
      // This approach avoids updateTriggers issues and lets deck.gl handle updates naturally
      // IMPORTANT: Use stable module-level functions to prevent layer recreation
      // biome-ignore lint/style/useNamingConvention: EditableGeoJsonLayer requires _subLayerProps naming
      _subLayerProps: {
        geojson: {
          // Filled geometries (Polygon, Circle)
          filled: true,
          getFillColor: STABLE_GET_FILL_COLOR,

          // Line geometries (LineString, Polygon outline)
          stroked: true,
          getLineColor: STABLE_GET_LINE_COLOR,
          getLineWidth: STABLE_GET_LINE_WIDTH,
          lineWidthUnits: 'pixels',
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 20,

          // Dash patterns
          getDashArray: STABLE_GET_DASH_ARRAY,
          extensions: [PATH_STYLE_EXTENSION],
        },
        // Note: guides sublayer config omitted - uses EditableGeoJsonLayer defaults
        // NGC2 only configures guides for circles (to hide edit handles)
      },
    });
  }

  /**
   * Render highlight layers for selected/hovered shapes
   */
  renderHighlightLayers(): ReturnType<
    typeof createEditHighlightSelectedLayer
  >[] {
    const { data, selectedShapeId, hoveredShapeId, highlightColor } =
      this.props;

    return [
      createEditHighlightSelectedLayer({
        data,
        selectedShapeId,
        highlightColor,
      }),
      createEditHighlightHoveredLayer({
        data,
        hoveredShapeId,
        selectedShapeId,
      }),
    ];
  }

  /**
   * Render labels layer
   */
  renderLabelsLayer(): ReturnType<typeof createShapeLabelLayer> | null {
    const { showLabels, data } = this.props;
    if (!showLabels) {
      return null;
    }

    return createShapeLabelLayer({ data });
  }

  /**
   * Render all sublayers
   */
  renderLayers(): Array<
    | EditableGeoJsonLayer
    | ReturnType<typeof createEditHighlightSelectedLayer>
    | ReturnType<typeof createShapeLabelLayer>
  > {
    // Temporarily simplified - only return editable layer to test if highlight layers are causing issues
    return [this.renderEditableLayer()].filter(Boolean) as Array<
      | EditableGeoJsonLayer
      | ReturnType<typeof createEditHighlightSelectedLayer>
      | ReturnType<typeof createShapeLabelLayer>
    >;
  }
}
