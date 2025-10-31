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
import { GeoJsonLayer } from '@deck.gl/layers';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import { DEFAULT_DISPLAY_PROPS } from './constants';
import { createShapeLabelLayer } from './shape-label-layer';
import {
  getDashArray,
  getFillColor,
  getHighlightColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getStrokeColor,
} from './utils/display-style';
import type { PickingInfo } from '@deck.gl/core';
import type { EditableShape } from '../shared/types';
import type { DisplayShapeLayerProps } from './types';

/**
 * DisplayShapeLayer - Display-only shapes layer
 *
 * A composite layer that renders:
 * 1. Highlight sublayer (for selection glow)
 * 2. Main GeoJsonLayer (shapes)
 * 3. ShapeLabelLayer (if showLabels enabled)
 *
 * Purpose: Render shapes from external APIs (read-only visualization)
 */
export class DisplayShapeLayer extends CompositeLayer<DisplayShapeLayerProps> {
  static override layerName = 'DisplayShapeLayer';

  static override defaultProps = {
    ...DEFAULT_DISPLAY_PROPS,
  };

  /**
   * Convert shapes to GeoJSON features with shapeId in properties
   */
  private getFeaturesWithId(): EditableShape['feature'][] {
    const { data } = this.props;
    return data.map((shape) => ({
      ...shape.feature,
      properties: {
        ...shape.feature.properties,
        shapeId: shape.id,
        // biome-ignore lint/style/useNamingConvention: Using underscore prefix to indicate internal property
        _shape: shape, // Store full shape for callbacks
      },
    }));
  }

  /**
   * Handle shape click
   */
  private handleShapeClick = (info: PickingInfo): void => {
    const { onShapeClick } = this.props;

    if (!(info.object && onShapeClick)) {
      return;
    }

    const shape = info.object.properties?._shape as EditableShape;
    if (shape) {
      onShapeClick(shape);
    }
  };

  /**
   * Handle shape hover
   */
  private handleShapeHover = (info: PickingInfo): void => {
    const { onShapeHover } = this.props;

    if (!onShapeHover) {
      return;
    }

    if (info.object) {
      const shape = info.object.properties?._shape as EditableShape;
      if (shape) {
        onShapeHover(shape);
      }
    } else {
      onShapeHover(null);
    }
  };

  /**
   * Render highlight sublayer (underneath main layer)
   */
  private renderHighlightLayer() {
    const { selectedShapeId, highlightColor } = this.props;

    if (!selectedShapeId) {
      return null;
    }

    const features = this.getFeaturesWithId();
    const selectedFeature = features.find(
      (f) => f.properties?.shapeId === selectedShapeId,
    );

    if (!selectedFeature) {
      return null;
    }

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: [selectedFeature] as any,

      // Styling
      filled: true,
      stroked: true,
      getFillColor: highlightColor || getHighlightColor(),
      getLineColor: highlightColor || getHighlightColor(),
      getLineWidth: getHighlightLineWidth,

      // Behavior
      pickable: false,
    });
  }

  /**
   * Render main shapes layer
   */
  private renderMainLayer() {
    const { pickable } = this.props;
    const features = this.getFeaturesWithId();

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: features as any,

      // Styling
      filled: true,
      stroked: true,
      getFillColor,
      getLineColor: getStrokeColor,
      getLineWidth: (d, info) => {
        const isHovered = info?.index === this.state?.hoverIndex;
        return getHoverLineWidth(d, isHovered);
      },

      // Points as icons (markers)
      pointType: 'circle+icon',
      getPointRadius: 8,

      // Dash pattern support
      extensions: [new PathStyleExtension({ dash: true })],
      getDashArray,

      // Behavior
      pickable,
      autoHighlight: false, // We handle highlighting manually
      onClick: this.handleShapeClick,
      onHover: (info) => {
        this.setState({ hoverIndex: info.index });
        this.handleShapeHover(info);
      },

      // Update triggers
      updateTriggers: {
        getFillColor: [features],
        getLineColor: [features],
        getLineWidth: [features, this.state?.hoverIndex],
        getDashArray: [features],
      },
    });
  }

  /**
   * Render labels layer
   */
  private renderLabelsLayer() {
    const { showLabels, data } = this.props;

    if (!showLabels) {
      return null;
    }

    return createShapeLabelLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      data,
    });
  }

  /**
   * Render all sublayers
   */
  renderLayers() {
    return [
      this.renderHighlightLayer(),
      this.renderMainLayer(),
      this.renderLabelsLayer(),
    ].filter(Boolean);
  }
}
