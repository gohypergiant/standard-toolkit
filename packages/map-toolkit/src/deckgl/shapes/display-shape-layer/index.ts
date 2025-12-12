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
 * Type guard to validate that an object is an EditableShape
 */
function isEditableShape(obj: unknown): obj is EditableShape {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'feature' in obj &&
    'shapeType' in obj
  );
}

/**
 * State interface for DisplayShapeLayer
 */
interface DisplayShapeLayerState {
  /** Index of currently hovered shape, undefined when not hovering */
  hoverIndex?: number;
  /** Allow additional properties from base layer state */
  [key: string]: unknown;
}

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
 * ## Icon Atlas Constraint
 * When using icons for Point geometries, all shapes in a single layer must share the
 * same icon atlas. The layer uses the first atlas found across all features. If you
 * need icons from different atlases, use separate DisplayShapeLayer instances.
 *
 * ## Event Bus Integration
 * Automatically emits shape events that can be consumed anywhere in your app:
 * - `shapes:selected` - Emitted when a shape is clicked (includes mapId)
 * - `shapes:hovered` - Emitted when hovering over a shape or when hover ends (includes mapId)
 *
 * **Note on deselection:** The layer emits `shapes:selected` automatically, but deselection
 * requires consumer-side wiring. Listen to `MapEvents.click` and emit `shapes:deselected`
 * when clicking empty space (`info.index === -1`). See the example below.
 *
 * @example Basic usage with selection and deselection
 * ```tsx
 * import '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/fiber';
 * import { useEmit, useOn } from '@accelint/bus/react';
 * import { uuid } from '@accelint/core';
 *
 * const MAP_ID = uuid();
 *
 * function MapWithShapes() {
 *   const [selectedId, setSelectedId] = useState<string>();
 *   const emitDeselected = useEmit(ShapeEvents.deselected);
 *
 *   // Listen to shape selection events (automatic from layer)
 *   useOn(ShapeEvents.selected, (event) => {
 *     if (event.payload.mapId !== MAP_ID) return;
 *     setSelectedId(event.payload.shapeId);
 *   });
 *
 *   // Listen to deselection events
 *   useOn(ShapeEvents.deselected, (event) => {
 *     if (event.payload.mapId !== MAP_ID) return;
 *     setSelectedId(undefined);
 *   });
 *
 *   // Handle deselection when clicking empty space (consumer-side wiring)
 *   useOn(MapEvents.click, (event) => {
 *     if (selectedId && event.payload.id === MAP_ID && event.payload.info.index === -1) {
 *       emitDeselected({ mapId: MAP_ID });
 *     }
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
  // State is typed via DisplayShapeLayerState but deck.gl doesn't support generic state
  declare state: DisplayShapeLayerState;

  static override layerName = 'DisplayShapeLayer';

  static override defaultProps = {
    ...DEFAULT_DISPLAY_PROPS,
  };

  /**
   * Clean up state when layer is destroyed
   */
  override finalizeState(): void {
    // Clear hover state to prevent stale references
    if (this.state?.hoverIndex !== undefined) {
      this.setState({ hoverIndex: undefined });
    }
  }

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

    const shape = info.object.properties?._shape;

    // Validate shape structure before using
    if (!isEditableShape(shape)) {
      return;
    }

    // Emit shape selected event via bus (include mapId for multi-map isolation)
    shapeBus.emit(ShapeEvents.selected, { shapeId: shape.id, mapId });

    // Call callback if provided
    if (onShapeClick) {
      onShapeClick(shape);
    }
  };

  /**
   * Handle shape hover
   */
  private handleShapeHover = (info: PickingInfo): void => {
    const { onShapeHover, mapId } = this.props;

    // Extract and validate shape from info if present
    const rawShape = info.object?.properties?._shape;
    const shape = isEditableShape(rawShape) ? rawShape : null;

    // Emit shape hovered event via bus (include mapId for multi-map isolation)
    shapeBus.emit(ShapeEvents.hovered, {
      shapeId: shape?.id ?? null,
      mapId,
    });

    // Call callback if provided
    if (onShapeHover) {
      onShapeHover(shape);
    }
  };

  /**
   * Render highlight sublayer (underneath main layer)
   */
  private renderHighlightLayer(
    features: EditableShape['feature'][],
  ): GeoJsonLayer | null {
    const { selectedShapeId, highlightColor } = this.props;

    if (!selectedShapeId) {
      return null;
    }

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
        getLineColor: [highlightColor],
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
  private hasIcons(features: EditableShape['feature'][]): boolean {
    return features.some((f) => f.properties?.styleProperties?.icon);
  }

  /**
   * Render main shapes layer
   */
  private renderMainLayer(features: EditableShape['feature'][]): GeoJsonLayer {
    const { pickable } = this.props;
    const hasIcons = this.hasIcons(features);

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
              return isHovered
                ? iconSize + MAP_INTERACTION.ICON_HOVER_SIZE_INCREASE
                : iconSize;
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
  private renderLabelsLayer(): ReturnType<typeof createShapeLabelLayer> | null {
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
    // Compute features once per render cycle for performance
    const features = this.getFeaturesWithId();

    return [
      this.renderHighlightLayer(features),
      this.renderMainLayer(features),
      this.renderLabelsLayer(),
    ].filter(Boolean) as Layer[];
  }
}
