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

import { Broadcast } from '@accelint/bus';
import { CompositeLayer } from '@deck.gl/core';
import { PathStyleExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
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
 * Typed event bus instance for shape events.
 * Provides type-safe event emission for shape interactions.
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();

/**
 * DisplayShapeLayer - Display-only shapes layer
 *
 * A composite layer that renders:
 * 1. Highlight sublayer (for selection glow)
 * 2. Main GeoJsonLayer (shapes)
 * 3. ShapeLabelLayer (if showLabels enabled)
 *
 * Purpose: Render shapes from external APIs (read-only visualization)
 *
 * Bus Integration: Automatically emits shape events via @accelint/bus:
 * - shapes:selected when a shape is clicked
 * - shapes:deselected when clicking empty space (future)
 */
export class DisplayShapeLayer extends CompositeLayer<DisplayShapeLayerProps> {
  static override layerName = 'DisplayShapeLayer';

  static override defaultProps = {
    ...DEFAULT_DISPLAY_PROPS,
  };

  /**
   * Override getPickingInfo to handle events from sublayers
   * This is the correct pattern for CompositeLayer event handling
   */
  override getPickingInfo({
    info,
    mode,
    sourceLayer,
  }: {
    info: PickingInfo;
    mode?: string;
    // biome-ignore lint/suspicious/noExplicitAny: sourceLayer type from deck.gl is not well-typed
    sourceLayer?: any;
  }) {
    // Check if this picking event came from our main shapes layer
    if (sourceLayer?.id === `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`) {
      // Handle click events (deck.gl uses 'query' mode for clicks)
      if (mode === 'query') {
        this.handleShapeClick(info);
      }

      // Handle hover events (including when mode is undefined, which is hover)
      if (mode === 'hover' || !mode) {
        // Update hover state
        if (info.index !== undefined && info.index !== this.state?.hoverIndex) {
          this.setState({ hoverIndex: info.index });
        } else if (
          info.index === undefined &&
          this.state?.hoverIndex !== undefined
        ) {
          this.setState({ hoverIndex: undefined });
        }

        // Call hover callback
        this.handleShapeHover(info);
      }
    }

    return info;
  }

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

    if (!info.object) {
      return;
    }

    const shape = info.object.properties?._shape as EditableShape;

    if (shape) {
      // Emit shape selected event via bus
      shapeBus.emit(ShapeEvents.selected, { shapeId: shape.id });

      // Call callback if provided
      if (onShapeClick) {
        onShapeClick(shape);
      }
    }
  };

  /**
   * Handle shape hover
   */
  private handleShapeHover = (info: PickingInfo): void => {
    const { onShapeHover } = this.props;

    // Extract shape from info if present
    let shape: EditableShape | null = null;
    if (info.object) {
      shape = info.object.properties?._shape as EditableShape;
    }

    // Call callback if provided
    if (onShapeHover) {
      onShapeHover(shape);
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
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 1,
      getFillColor: () => [0, 0, 0, 0], // Transparent fill
      getLineColor: () => highlightColor || getHighlightColor(),
      getLineWidth: getHighlightLineWidth,

      // Behavior
      pickable: false,
      updateTriggers: {
        getLineWidth: [selectedShapeId, features],
      },
    });
  }

  /**
   * Check if any features have icon configuration
   */
  private hasIcons(): boolean {
    const features = this.getFeaturesWithId();
    return features.some((f) => f.properties?.styleProperties?.icon);
  }

  /**
   * Render main shapes layer
   */
  private renderMainLayer() {
    const { pickable } = this.props;
    const features = this.getFeaturesWithId();
    const hasIcons = this.hasIcons();

    // Collect icon atlas and mapping from features
    const iconAtlas = features.find(
      (f) => f.properties?.styleProperties?.icon?.atlas,
    )?.properties?.styleProperties?.icon?.atlas;
    const iconMapping = features.find(
      (f) => f.properties?.styleProperties?.icon?.mapping,
    )?.properties?.styleProperties?.icon?.mapping;

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
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 20,

      // Points - use icons if any feature has icon config, otherwise circles
      pointType: hasIcons ? 'icon' : 'circle',
      getPointRadius: (d) => {
        const iconSize = d.properties?.styleProperties?.icon?.size;
        return iconSize ?? 2;
      },
      pointRadiusUnits: 'pixels',

      // Icon configuration (only used if pointType includes 'icon')
      ...(hasIcons && iconAtlas ? { iconAtlas } : {}),
      ...(hasIcons && iconMapping ? { iconMapping } : {}),
      ...(hasIcons
        ? {
            getIcon: (d: EditableShape['feature']) =>
              d.properties?.styleProperties?.icon?.name ?? 'marker',
            getIconSize: (d: EditableShape['feature']) =>
              d.properties?.styleProperties?.icon?.size ?? 8,
          }
        : {}),

      // Dash pattern support
      extensions: [new PathStyleExtension({ dash: true })],
      getDashArray,

      // Behavior
      pickable,
      autoHighlight: false, // We handle highlighting manually
      // Note: onClick and onHover are handled via getPickingInfo() override

      // Update triggers
      updateTriggers: {
        getFillColor: [features],
        getLineColor: [features],
        getLineWidth: [features, this.state?.hoverIndex],
        getDashArray: [features],
        getPointRadius: [features],
        ...(hasIcons
          ? {
              getIcon: [features],
              getIconSize: [features],
            }
          : {}),
      },
    });
  }

  /**
   * Render labels layer
   */
  private renderLabelsLayer() {
    const { showLabels, data, labelOptions } = this.props;

    if (!showLabels) {
      return null;
    }

    return createShapeLabelLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      data,
      labelOptions,
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
