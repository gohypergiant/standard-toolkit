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
import {
  DEFAULT_DISPLAY_PROPS,
  MAP_INTERACTION,
  SELECTION_HIGHLIGHT,
} from './constants';
import { createShapeLabelLayer } from './shape-label-layer';
import {
  getDashArray,
  getFillColor,
  getHighlightColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getStrokeColor,
} from './utils/display-style';
import type { Layer, PickingInfo } from '@deck.gl/core';
import type { EditableShape } from '../shared/types';
import type { DisplayShapeLayerProps } from './types';

/**
 * Typed event bus instance for shape events.
 * Provides type-safe event emission for shape interactions.
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();

/**
 * DisplayShapeLayer - Read-only shapes visualization layer
 *
 * A composite deck.gl layer for displaying geographic shapes with interactive features.
 * Ideal for rendering shapes from external APIs or displaying read-only geographic data.
 *
 * ## Features
 * - **Multiple geometry types**: Point, LineString, Polygon, and Circle
 * - **Icon support**: Custom icons for Point geometries via icon atlases
 * - **Interactive selection**: Click handling with visual highlight feedback
 * - **Hover effects**: Line width increases on hover for better UX
 * - **Customizable labels**: Flexible label positioning with per-shape or global options
 * - **Style properties**: Full control over colors, stroke patterns, and opacity
 * - **Event bus integration**: Automatically emits shape events via @accelint/bus
 * - **Multi-map support**: Events include map instance ID for isolation
 *
 * ## Layer Structure
 * Renders three sublayers (in order):
 * 1. **Highlight layer**: Selection glow effect (rendered below main layer)
 * 2. **Main GeoJsonLayer**: Shape geometries with styling and interaction
 * 3. **Label layer**: Text labels (if showLabels enabled)
 *
 * ## Event Bus Integration
 * Automatically emits shape events that can be consumed anywhere in your app:
 * - `shapes:selected` - Emitted when a shape is clicked (includes mapId)
 * - `shapes:hovered` - Emitted when hovering over a shape or when hover ends (includes mapId)
 * - `shapes:deselected` - Emitted when clicking empty space (via map click handler)
 *
 * @example Basic usage with Fiber renderer and map instance ID
 * ```tsx
 * import '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/fiber';
 * import { uuid } from '@accelint/core';
 *
 * const MAP_ID = uuid();
 *
 * function MapWithShapes() {
 *   const [selectedId, setSelectedId] = useState<string>();
 *
 *   // Listen to shape selection events, filtered by map ID
 *   useOn(ShapeEvents.selected, (event) => {
 *     if (event.payload.id !== MAP_ID) return;
 *     setSelectedId(event.payload.shapeId);
 *   });
 *
 *   return (
 *     <BaseMap id={MAP_ID}>
 *       <displayShapeLayer
 *         id="my-shapes"
 *         mapId={MAP_ID}
 *         data={shapes}
 *         selectedShapeId={selectedId}
 *         showLabels={true}
 *         pickable={true}
 *       />
 *     </BaseMap>
 *   );
 * }
 * ```
 *
 * @example With custom label positioning
 * ```tsx
 * <displayShapeLayer
 *   id="my-shapes"
 *   data={shapes}
 *   showLabels={true}
 *   labelOptions={{
 *     // Position circle labels at the top
 *     circleLabelCoordinateAnchor: 'top',
 *     circleLabelVerticalAnchor: 'bottom',
 *     circleLabelOffset: [0, -10],
 *     // Position line labels at the middle
 *     lineStringLabelCoordinateAnchor: 'middle',
 *   }}
 * />
 * ```
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
    const { onShapeClick, mapId } = this.props;

    if (!info.object) {
      return;
    }

    const shape = info.object.properties?._shape as EditableShape;

    if (shape) {
      // Emit shape selected event via bus (include mapId for multi-map isolation)
      shapeBus.emit(ShapeEvents.selected, { shapeId: shape.id, id: mapId });

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
    const { onShapeHover, mapId } = this.props;

    // Extract shape from info if present
    let shape: EditableShape | null = null;
    if (info.object) {
      shape = info.object.properties?._shape as EditableShape;
    }

    // Emit shape hovered event via bus (include mapId for multi-map isolation)
    shapeBus.emit(ShapeEvents.hovered, {
      shapeId: shape?.id ?? null,
      id: mapId,
    });

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

    // Check if selected feature has icon
    const hasIcon = !!selectedFeature.properties?.styleProperties?.icon;
    const iconAtlas = selectedFeature.properties?.styleProperties?.icon?.atlas;
    const iconMapping =
      selectedFeature.properties?.styleProperties?.icon?.mapping;

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: [selectedFeature] as any,

      // Styling
      filled: true,
      stroked: true,
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: MAP_INTERACTION.LINE_WIDTH_MIN_PIXELS,
      getFillColor: () => [0, 0, 0, 0], // Transparent fill
      getLineColor: () => highlightColor || getHighlightColor(),
      getLineWidth: getHighlightLineWidth,

      // Icon configuration for highlight layer
      pointType: hasIcon ? 'icon' : 'circle',
      ...(hasIcon && iconAtlas ? { iconAtlas } : {}),
      ...(hasIcon && iconMapping ? { iconMapping } : {}),
      ...(hasIcon
        ? {
            getIcon: (d: EditableShape['feature']) =>
              d.properties?.styleProperties?.icon?.name ?? 'marker',
            getIconSize: (d: EditableShape['feature']) => {
              const iconSize =
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE;
              return iconSize + SELECTION_HIGHLIGHT.ICON_SIZE_INCREASE;
            },
            getIconColor: () => highlightColor || getHighlightColor(),
            getIconPixelOffset: (d: EditableShape['feature']) => {
              const iconSize =
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE;
              const highlightSize =
                iconSize + SELECTION_HIGHLIGHT.ICON_SIZE_INCREASE;
              return [-1, -highlightSize / 2];
            },
            iconBillboard: false,
          }
        : {}),

      // Behavior
      pickable: false,
      updateTriggers: {
        getLineWidth: [selectedShapeId, features],
        ...(hasIcon
          ? {
              getIconSize: [selectedShapeId, features],
              getIconColor: [highlightColor],
            }
          : {}),
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
      lineWidthMinPixels: MAP_INTERACTION.LINE_WIDTH_MIN_PIXELS,
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
            getIconSize: (
              d: EditableShape['feature'],
              { index }: { index: number },
            ) => {
              const iconSize =
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE;
              const isHovered = index === this.state?.hoverIndex;
              return isHovered ? iconSize + 5 : iconSize;
            },
            getIconColor: getStrokeColor,
            getIconPixelOffset: (d: EditableShape['feature']) => {
              const iconSize =
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE;
              return [-1, -iconSize / 2];
            },
            iconBillboard: false,
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
              getIconSize: [features, this.state?.hoverIndex],
              getIconColor: [features],
              getIconPixelOffset: [features],
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
  renderLayers(): Layer[] {
    return [
      this.renderHighlightLayer(),
      this.renderMainLayer(),
      this.renderLabelsLayer(),
    ].filter(Boolean) as Layer[];
  }
}
