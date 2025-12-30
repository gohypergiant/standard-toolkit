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
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { DASH_ARRAYS, SHAPE_LAYER_IDS } from '../shared/constants';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import {
  COFFIN_CORNERS,
  DEFAULT_DISPLAY_PROPS,
  MAP_INTERACTION,
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
import type { Shape, ShapeId } from '../shared/types';
import type { DisplayShapeLayerProps } from './types';

/**
 * Typed event bus instance for shape events.
 * Provides type-safe event emission for shape interactions.
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();

/**
 * State interface for DisplayShapeLayer
 */
interface DisplayShapeLayerState {
  /** Index of currently hovered shape, undefined when not hovering */
  hoverIndex?: number;
  /** ID of the last hovered shape for event deduplication */
  lastHoveredId?: ShapeId | null;
  /** Allow additional properties from base layer state */
  [key: string]: unknown;
}

/**
 * Cache for transformed features to avoid recreating objects on every render.
 */
interface FeaturesCache {
  /** Reference to the original data array for identity comparison */
  data: Shape[];
  /** Transformed features with shapeId added to properties */
  features: Shape['feature'][];
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
 * - **Interactive selection**: Click handling with dotted border and optional highlight
 * - **Hover effects**: Line width increases on hover for better UX
 * - **Customizable labels**: Flexible label positioning with per-shape or global options
 * - **Style properties**: Full control over colors, stroke patterns, and opacity
 * - **Event bus integration**: Automatically emits shape events via @accelint/bus
 * - **Multi-map support**: Events include map instance ID for isolation
 *
 * ## Selection Visual Feedback
 * When a shape is selected via `selectedShapeId`:
 * - The shape's stroke pattern changes to dotted
 * - An optional highlight renders underneath (controlled by `showHighlight` prop)
 *
 * ## Layer Structure
 * Renders up to four sublayers (in order, bottom to top):
 * 1. **Highlight layer**: Selection highlight effect for non-icon-Point shapes (if showHighlight=true)
 * 2. **Coffin corners layer**: Selection/hover feedback for Point shapes with icons
 * 3. **Main GeoJsonLayer**: Shape geometries with styling and interaction
 * 4. **Label layer**: Text labels (if showLabels enabled)
 *
 * ## Icon Atlas Constraint
 * When using icons for Point geometries, all shapes in a single layer must share the
 * same icon atlas. The layer uses the first atlas found across all features. If you
 * need icons from different atlases, use separate DisplayShapeLayer instances.
 *
 * ## Event Bus Integration
 * Automatically emits shape events that can be consumed anywhere in your app:
 * - `shapes:selected` - Emitted when a shape is clicked (includes mapId)
 * - `shapes:hovered` - Emitted when the hovered shape changes (deduplicated, includes mapId)
 *
 * For selection with auto-deselection, use the companion `useShapeSelection` hook which handles
 * all the event wiring automatically. See the example below.
 *
 * @example Basic usage with useShapeSelection hook (recommended)
 * ```tsx
 * import '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/fiber';
 * import { useShapeSelection } from '@accelint/map-toolkit/deckgl/shapes';
 * import { uuid } from '@accelint/core';
 *
 * const MAP_ID = uuid();
 *
 * function MapWithShapes() {
 *   const { selectedId } = useShapeSelection(MAP_ID);
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

  /** Cache for transformed features to avoid recreating objects on every render */
  private featuresCache: FeaturesCache | null = null;

  static override layerName = 'DisplayShapeLayer';

  static override defaultProps = {
    ...DEFAULT_DISPLAY_PROPS,
  };

  /**
   * Clean up state and caches when layer is destroyed
   */
  override finalizeState(): void {
    // Clear hover state to prevent stale references
    if (this.state?.hoverIndex !== undefined) {
      this.setState({ hoverIndex: undefined, lastHoveredId: undefined });
    }
    // Clear features cache
    this.featuresCache = null;
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
   * Convert shapes to GeoJSON features with shapeId in properties.
   * Uses caching to avoid recreating objects on every render cycle.
   */
  private getFeaturesWithId(): Shape['feature'][] {
    const { data } = this.props;

    // Return cached features if data hasn't changed (identity check)
    if (this.featuresCache?.data === data) {
      return this.featuresCache.features;
    }

    // Transform features and cache the result
    const features = data.map((shape) => ({
      ...shape.feature,
      properties: {
        ...shape.feature.properties,
        shapeId: shape.id,
      },
    }));

    this.featuresCache = { data, features };
    return features;
  }

  /**
   * Look up a shape by ID from the data prop.
   * Used by event handlers to get full shape without storing in feature properties.
   */
  private getShapeById(shapeId: ShapeId): Shape | undefined {
    return this.props.data.find((shape) => shape.id === shapeId);
  }

  /**
   * Handle shape click
   */
  private handleShapeClick = (info: PickingInfo): void => {
    const { onShapeClick, mapId } = this.props;

    if (!info.object) {
      return;
    }

    // Look up shape from data prop using shapeId stored in feature properties
    const shapeId = info.object.properties?.shapeId as ShapeId | undefined;
    if (!shapeId) {
      return;
    }

    const shape = this.getShapeById(shapeId);
    if (!shape) {
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

    // Look up shape from data prop using shapeId stored in feature properties
    const shapeId =
      (info.object?.properties?.shapeId as ShapeId | undefined) ?? null;
    const shape = shapeId ? (this.getShapeById(shapeId) ?? null) : null;

    // Dedupe hover events - only emit if hovered shape changed
    if (shapeId !== this.state?.lastHoveredId) {
      this.setState({ lastHoveredId: shapeId });

      // Emit shape hovered event via bus (include mapId for multi-map isolation)
      shapeBus.emit(ShapeEvents.hovered, {
        shapeId,
        mapId,
      });
    }

    // Always call callback if provided (for local state updates)
    if (onShapeHover) {
      onShapeHover(shape);
    }
  };

  /**
   * Render highlight sublayer (underneath main layer)
   * Note: Points with icons use coffin corners instead of highlight layer
   */
  private renderHighlightLayer(
    features: Shape['feature'][],
  ): GeoJsonLayer | null {
    const { selectedShapeId, showHighlight, highlightColor } = this.props;

    if (!selectedShapeId || showHighlight === false) {
      return null;
    }

    const selectedFeature = features.find(
      (f) => f.properties?.shapeId === selectedShapeId,
    );

    if (!selectedFeature) {
      return null;
    }

    // Skip highlight layer for Point geometries with icons - they use coffin corners instead
    // Points without icons should still show the highlight layer
    if (selectedFeature.geometry.type === 'Point') {
      const hasIcon = !!selectedFeature.properties?.styleProperties?.icon;
      if (hasIcon) {
        return null;
      }
    }

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

      // Behavior
      pickable: false,
      updateTriggers: {
        getLineColor: [highlightColor],
        getLineWidth: [selectedShapeId, features],
      },
    });
  }

  /**
   * Render coffin corners layer for Point geometries that have icons on hover/select
   * Coffin corners provide visual feedback for points instead of highlight layer
   */
  private renderCoffinCornersLayer(
    features: Shape['feature'][],
  ): IconLayer | null {
    const { selectedShapeId } = this.props;

    // Find point features that need coffin corners (hovered or selected)
    const pointFeatures = features.filter((f) => {
      if (f.geometry.type !== 'Point') {
        return false;
      }
      const hasIcon = !!f.properties?.styleProperties?.icon;
      if (!hasIcon) {
        return false;
      }

      const shapeId = f.properties?.shapeId;
      const isSelected = shapeId === selectedShapeId;
      const isHovered =
        this.state?.hoverIndex !== undefined &&
        features.indexOf(f) === this.state.hoverIndex;

      return isSelected || isHovered;
    });

    if (pointFeatures.length === 0) {
      return null;
    }

    // Get icon atlas from first point feature (all should share the same atlas)
    const firstPointIcon = pointFeatures[0]?.properties?.styleProperties?.icon;
    const iconAtlas = firstPointIcon?.atlas;
    const iconMapping = firstPointIcon?.mapping;

    if (!iconAtlas) {
      return null;
    }

    if (!iconMapping) {
      return null;
    }

    // Add coffin corners icons to the mapping
    const extendedMapping = {
      ...iconMapping,
      [COFFIN_CORNERS.HOVER_ICON]: {
        x: 0,
        y: 0,
        width: 76,
        height: 76,
        mask: false,
      },
      [COFFIN_CORNERS.SELECTED_ICON]: {
        x: 76,
        y: 0,
        width: 76,
        height: 76,
        mask: false,
      },
      [COFFIN_CORNERS.SELECTED_HOVER_ICON]: {
        x: 152,
        y: 0,
        width: 76,
        height: 76,
        mask: false,
      },
    };

    return new IconLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-coffin-corners`,
      data: pointFeatures,
      iconAtlas,
      iconMapping: extendedMapping,
      getIcon: (d: Shape['feature']) => {
        const shapeId = d.properties?.shapeId;
        const isSelected = shapeId === selectedShapeId;
        const isHovered =
          this.state?.hoverIndex !== undefined &&
          features.indexOf(d) === this.state.hoverIndex;

        if (isSelected && isHovered) {
          return COFFIN_CORNERS.SELECTED_HOVER_ICON;
        }
        if (isSelected) {
          return COFFIN_CORNERS.SELECTED_ICON;
        }
        return COFFIN_CORNERS.HOVER_ICON;
      },
      getSize: COFFIN_CORNERS.SIZE,
      getPosition: (d: Shape['feature']) => {
        const coords =
          d.geometry.type === 'Point' ? d.geometry.coordinates : [0, 0];
        return coords as [number, number];
      },
      getPixelOffset: (d: Shape['feature']) => {
        const iconSize =
          d.properties?.styleProperties?.icon?.size ??
          MAP_INTERACTION.ICON_SIZE;
        // Center the coffin corners on the point icon
        return [-1, -iconSize / 2];
      },
      billboard: false,
      pickable: false,
      updateTriggers: {
        getIcon: [selectedShapeId, this.state?.hoverIndex],
        data: [features, selectedShapeId, this.state?.hoverIndex],
      },
    });
  }

  /**
   * Extract icon configuration from features in a single pass.
   * Returns the first icon's atlas and mapping (all shapes share the same atlas).
   * Uses early return for O(1) best case when first feature has icons.
   */
  private getIconConfig(features: Shape['feature'][]): {
    hasIcons: boolean;
    atlas?: string;
    mapping?: Record<
      string,
      { x: number; y: number; width: number; height: number; mask?: boolean }
    >;
  } {
    for (const f of features) {
      const icon = f.properties?.styleProperties?.icon;
      if (icon) {
        return {
          hasIcons: true,
          atlas: icon.atlas,
          mapping: icon.mapping,
        };
      }
    }
    return { hasIcons: false };
  }

  /**
   * Render main shapes layer
   */
  private renderMainLayer(features: Shape['feature'][]): GeoJsonLayer {
    const { pickable, applyBaseOpacity, selectedShapeId } = this.props;

    // Single-pass icon config extraction (O(1) best case with early return)
    const {
      hasIcons,
      atlas: iconAtlas,
      mapping: iconMapping,
    } = this.getIconConfig(features);

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: features as any,

      // Styling
      filled: true,
      stroked: true,
      getFillColor: (d: Shape['feature']) => getFillColor(d, applyBaseOpacity),
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
            getIcon: (d: Shape['feature']) =>
              d.properties?.styleProperties?.icon?.name ?? 'marker',
            getIconSize: (d: Shape['feature']) => {
              return (
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE
              );
            },
            getIconColor: getStrokeColor,
            getIconPixelOffset: (d: Shape['feature']) => {
              const iconSize =
                d.properties?.styleProperties?.icon?.size ??
                MAP_INTERACTION.ICON_SIZE;
              return [-1, -iconSize / 2];
            },
            iconBillboard: false,
          }
        : {}),

      // Dash pattern support - selected shapes get dotted border
      extensions: [new PathStyleExtension({ dash: true })],
      getDashArray: (d: Shape['feature']) => {
        const isSelected = d.properties?.shapeId === selectedShapeId;
        if (isSelected) {
          return DASH_ARRAYS.dotted;
        }
        return getDashArray(d);
      },

      // Behavior
      pickable,
      autoHighlight: false, // We handle highlighting manually
      // Note: onClick and onHover are handled via getPickingInfo() override

      // Update triggers
      updateTriggers: {
        getFillColor: [features, applyBaseOpacity],
        getLineColor: [features],
        getLineWidth: [features, this.state?.hoverIndex],
        getDashArray: [features, selectedShapeId],
        getPointRadius: [features],
        ...(hasIcons
          ? {
              getIcon: [features],
              getIconSize: [features],
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
      this.renderCoffinCornersLayer(features),
      this.renderMainLayer(features),
      this.renderLabelsLayer(),
    ].filter(Boolean) as Layer[];
  }
}
