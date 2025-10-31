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
import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
import { createShapeLabelLayer } from '../display-shape-layer/shape-label-layer';
import {
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

export interface EditableShapeLayerProps {
  id?: string;
  data: EditableShape[];
  mode?: EditShapeMode;
  selectedShapeId?: ShapeId;
  hoveredShapeId?: ShapeId;
  showLabels?: boolean;
  pickable?: boolean;
  highlightColor?: [number, number, number, number];

  // Interaction callbacks
  onShapeClick?: (shape: EditableShape, event: any) => void;
  onShapeHover?: (shape: EditableShape | null, event: any) => void;
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
   */
  getFeatureCollection(): FeatureCollection {
    const { data } = this.props;
    return {
      type: 'FeatureCollection',
      // biome-ignore lint/suspicious/noExplicitAny: GeoJSON FeatureCollection type compatibility
      features: data.map((shape) => shape.feature) as any,
    };
  }

  /**
   * Find shape by feature
   */
  findShapeByFeature(feature: ShapeFeature): EditableShape | undefined {
    const { data } = this.props;
    return data.find((shape) => shape.feature === feature);
  }

  /**
   * Handle click on shape
   */
  handleClick = (info: any, event: any) => {
    const { onShapeClick, pickable } = this.props;
    if (!(pickable && onShapeClick)) {
      return;
    }

    const feature = info?.object;
    if (feature) {
      const shape = this.findShapeByFeature(feature);
      if (shape) {
        onShapeClick(shape, event);
      }
    }
  };

  /**
   * Handle hover on shape
   */
  handleHover = (info: any, event: any) => {
    const { onShapeHover, pickable } = this.props;
    if (!(pickable && onShapeHover)) {
      return;
    }

    const feature = info?.object;
    const shape = feature ? this.findShapeByFeature(feature) : null;
    onShapeHover(shape ?? null, event);
  };

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
    const { id = SHAPE_LAYER_IDS.EDIT, mode = 'view', data } = this.props;

    const featureCollection = this.getFeatureCollection();
    const modeInstance = createMode(mode);

    // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer data type compatibility
    return new EditableGeoJsonLayer({
      id,
      data: featureCollection as any,
      mode: modeInstance,

      // Styling for filled geometries (Polygon, Circle)
      filled: true,
      // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer color accessor signature
      getFillColor: (f: any) => getFillColor(f) as any,

      // Styling for line geometries (LineString, Polygon outline)
      stroked: true,
      // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer color accessor signature
      getLineColor: (f: any) => getStrokeColor(f) as any,
      // biome-ignore lint/suspicious/noExplicitAny: Feature type from deck.gl
      getLineWidth: (f: any) => {
        const shape = data.find((s) => s.feature === f);
        return shape ? getStrokeWidth(shape.feature) : 2;
      },
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 20,

      // Interaction
      pickable: this.props.pickable,
      onClick: this.handleClick,
      onHover: this.handleHover,
      onEdit: this.handleEdit,

      // Edit handles styling
      editHandlePointRadiusScale: 2,
      editHandlePointRadiusMinPixels: 4,
      editHandlePointRadiusMaxPixels: 8,
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
    return [
      ...this.renderHighlightLayers(),
      this.renderEditableLayer(),
      this.renderLabelsLayer(),
    ].filter(Boolean) as Array<
      | EditableGeoJsonLayer
      | ReturnType<typeof createEditHighlightSelectedLayer>
      | ReturnType<typeof createShapeLabelLayer>
    >;
  }
}
