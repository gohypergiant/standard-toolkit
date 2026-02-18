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

'use client';

import { Broadcast } from '@accelint/bus';
import { getLogger } from '@accelint/logger';
import { type Color, CompositeLayer } from '@deck.gl/core';
import { PathStyleExtension } from '@deck.gl/extensions';
import { GeoJsonLayer, IconLayer, LineLayer } from '@deck.gl/layers';
import { DASH_ARRAYS, SHAPE_LAYER_IDS } from '../shared/constants';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import {
  getDashArray,
  getFillColor,
  getLineColor,
} from '../shared/utils/style-utils';
import {
  COFFIN_CORNERS,
  DEFAULT_DISPLAY_PROPS,
  MAP_INTERACTION,
} from './constants';
import { createShapeLabelLayer } from './shape-label-layer';
import {
  getHighlightColor,
  getHighlightLineWidth,
  getHoverLineWidth,
} from './utils/display-style';
import type { Layer, PickingInfo } from '@deck.gl/core';
import type { Shape, ShapeId } from '../shared/types';
import type { DisplayShapeLayerProps } from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[DisplayShapeLayer]',
  pretty: true,
});

/**
 * Material settings for 3D lighting effects on extruded shapes.
 * Used for hover state when stroke styling is unavailable.
 * Selection state uses color tinting instead of material settings.
 */
const MATERIAL_SETTINGS = {
  // Normal state - standard lighting
  NORMAL: {
    ambient: 0.35,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [255, 255, 255] as [number, number, number],
  },
  // Hovered state - brighter, more prominent
  HOVERED: {
    ambient: 0.6,
    diffuse: 0.8,
    shininess: 64,
    specularColor: [255, 255, 255] as [number, number, number],
  },
} as const;

/**
 * Typed event bus instance for shape events.
 * Provides type-safe event emission for shape interactions.
 */
const shapeBus = Broadcast.getInstance<ShapeEvent>();

/**
 * State type for DisplayShapeLayer
 */
type DisplayShapeLayerState = {
  /** Index of currently hovered shape, undefined when not hovering */
  hoverIndex?: number;
  /** ID of the last hovered shape for event deduplication */
  lastHoveredId?: ShapeId | null;
  /** Allow additional properties from base layer state */
  [key: string]: unknown;
};

/**
 * Cache for transformed features to avoid recreating objects on every render.
 */
type FeaturesCache = {
  /** Reference to the original data array for identity comparison */
  data: Shape[];
  /** Transformed features with shapeId added to properties */
  features: Shape['feature'][];
  /** Map of shapeId to feature index for O(1) lookup */
  shapeIdToIndex: Map<ShapeId, number>;
};

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
 * - **Hover effects**: Border/outline width increases on hover for better UX
 * - **Customizable labels**: Flexible label positioning with per-shape or global options
 * - **Style properties**: Full control over colors, border/outline patterns, and opacity
 * - **Event bus integration**: Automatically emits shape events via @accelint/bus
 * - **Multi-map support**: Events include map instance ID for isolation
 *
 * ## Selection Visual Feedback
 * When a shape is selected via `selectedShapeId`:
 * - The shape's border/outline pattern changes to dotted
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
 * For selection with auto-deselection, use the companion `useSelectShape` hook which handles
 * all the event wiring automatically. See the example below.
 *
 * @example Basic usage with useSelectShape hook (recommended)
 * ```tsx
 * import '@accelint/map-toolkit/deckgl/shapes/display-shape-layer/fiber';
 * import { useSelectShape } from '@accelint/map-toolkit/deckgl/shapes';
 * import { uuid } from '@accelint/core';
 *
 * const MAP_ID = uuid();
 *
 * function MapWithShapes() {
 *   const { selectedId } = useSelectShape(MAP_ID);
 *
 *   return (
 *     <BaseMap id={MAP_ID}>
 *       <displayShapeLayer
 *         id="my-shapes"
 *         mapId={MAP_ID}
 *         data={shapes}
 *         selectedShapeId={selectedId}
 *         showLabels="always"
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
 *   showLabels="always"
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
   * Handle picking events from the main shapes layer
   */
  private handleMainLayerPick(info: PickingInfo, mode?: string): void {
    // Handle click events (deck.gl uses 'query' mode for clicks)
    if (mode === 'query') {
      this.handleShapeClick(info);
    }

    // Handle hover events (including when mode is undefined, which is hover)
    if (mode === 'hover' || !mode) {
      // Update hover state
      if (info.index !== undefined && info.index !== this.state?.hoverIndex) {
        this.setState({ hoverIndex: info.index });
      }

      // Call hover callback
      this.handleShapeHover(info);
    }
  }

  /**
   * Handle picking events from curtain layers and map back to original LineString
   */
  private handleCurtainPick(
    info: PickingInfo,
    mode?: string,
  ): PickingInfo | null {
    if (!info.object) {
      return null;
    }

    const curtainShapeId = info.object.properties?.shapeId;
    if (!curtainShapeId) {
      return null;
    }

    const features = this.getFeaturesWithId();
    const featureIndex = features.findIndex(
      (f) => f.properties?.shapeId === curtainShapeId,
    );

    if (featureIndex === -1) {
      return null;
    }

    // Create modified info with the original feature
    const modifiedInfo = {
      ...info,
      index: featureIndex,
      object: features[featureIndex],
    };

    // Handle click events
    if (mode === 'query') {
      this.handleShapeClick(modifiedInfo);
    }

    // Handle hover events
    if (mode === 'hover' || !mode) {
      if (featureIndex !== this.state?.hoverIndex) {
        this.setState({ hoverIndex: featureIndex });
      }
      this.handleShapeHover(modifiedInfo);
    }

    return modifiedInfo;
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
    // Handle hover end (moving off all shapes to empty space)
    // This must be checked BEFORE layer-specific logic to ensure hover state clears properly
    if (
      (mode === 'hover' || !mode) &&
      (info.index === undefined || info.index < 0)
    ) {
      if (this.state?.hoverIndex !== undefined) {
        this.setState({ hoverIndex: undefined });
      }
      this.handleShapeHover(info);
      return info;
    }

    // Check if this picking event came from our main shapes layer
    if (sourceLayer?.id === `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`) {
      this.handleMainLayerPick(info, mode);
      return info;
    }

    // Check if this picking event came from a curtain layer (elevation visualization for LineStrings)
    const isCurtainLayer = sourceLayer?.id?.includes('-elevation-curtain');
    if (isCurtainLayer) {
      const curtainInfo = this.handleCurtainPick(info, mode);
      if (curtainInfo) {
        return curtainInfo;
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

    // Transform features and build shapeId->index map in a single pass
    const features: Shape['feature'][] = [];
    const shapeIdToIndex = new Map<ShapeId, number>();

    for (const [i, shape] of data.entries()) {
      features.push({
        ...shape.feature,
        properties: {
          ...shape.feature.properties,
          shapeId: shape.id,
        },
      });
      shapeIdToIndex.set(shape.id, i);
    }

    this.featuresCache = { data, features, shapeIdToIndex };
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
   * Extract elevation from 3D coordinates.
   * Returns the z-coordinate if present, otherwise returns 0.
   */
  private getElevationFromCoordinates(
    // biome-ignore lint/suspicious/noExplicitAny: GeoJSON coordinates can be deeply nested
    coordinates: any,
  ): number {
    // Handle nested coordinate arrays (polygons, multi-polygons)
    if (Array.isArray(coordinates[0])) {
      return this.getElevationFromCoordinates(coordinates[0]);
    }

    // Single coordinate [lon, lat] or [lon, lat, elevation]
    const coords = coordinates as number[];
    return coords[2] ?? 0;
  }

  /**
   * Get elevation accessor for GeoJsonLayer.
   * Extracts z-coordinate from feature geometry.
   */
  private getFeatureElevation = (feature: Shape['feature']): number => {
    const { geometry } = feature;

    if (!geometry) {
      return 0;
    }

    // GeometryCollection doesn't have coordinates property
    if (geometry.type === 'GeometryCollection') {
      return 0;
    }

    return this.getElevationFromCoordinates(geometry.coordinates);
  };

  /**
   * Extract [lon, lat] from coordinate array if valid.
   */
  private extractLonLat(
    coords: number[] | undefined,
  ): [number, number] | undefined {
    if (!coords || coords.length < 2) {
      return undefined;
    }
    const [lon, lat] = coords;
    return lon !== undefined && lat !== undefined ? [lon, lat] : undefined;
  }

  /**
   * Extract representative coordinate from a feature for elevation indicators.
   * Returns [lon, lat] or undefined if coordinates cannot be extracted.
   */
  private getRepresentativeCoordinate(
    geometry: Shape['feature']['geometry'],
  ): [number, number] | undefined {
    if (geometry.type === 'Point') {
      return this.extractLonLat(geometry.coordinates as number[]);
    }

    if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
      return this.extractLonLat((geometry.coordinates as number[][])[0]);
    }

    if (geometry.type === 'MultiLineString') {
      return this.extractLonLat((geometry.coordinates as number[][][])[0]?.[0]);
    }

    return undefined;
  }

  /**
   * Create vertical line segment from coordinate to ground.
   */
  private createVerticalSegment(
    lon: number,
    lat: number,
    elevation: number,
    color: [number, number, number, number],
  ) {
    return {
      source: [lon, lat, 0] as [number, number, number],
      target: [lon, lat, elevation] as [number, number, number],
      color,
    };
  }

  /**
   * Process coordinates array and create vertical segments.
   */
  private processCoordinates(
    coordinates: number[][],
    color: [number, number, number, number],
  ) {
    const segments: Array<{
      source: [number, number, number];
      target: [number, number, number];
      color: [number, number, number, number];
    }> = [];

    for (const coord of coordinates) {
      const [lon, lat, elevation] = coord;
      if (
        lon !== undefined &&
        lat !== undefined &&
        elevation !== undefined &&
        elevation > 0
      ) {
        segments.push(this.createVerticalSegment(lon, lat, elevation, color));
      }
    }

    return segments;
  }

  /**
   * Create elevation indicator line segments for a geometry.
   * Returns array of line segments from ground to elevated positions.
   */
  private createElevationLineSegments(
    geometry: Shape['feature']['geometry'],
    color: [number, number, number, number],
  ): Array<{
    source: [number, number, number];
    target: [number, number, number];
    color: [number, number, number, number];
  }> {
    // Skip GeometryCollection
    if (geometry.type === 'GeometryCollection') {
      return [];
    }

    if (geometry.type === 'LineString') {
      // Create vertical lines at EACH coordinate to form a "curtain"
      return this.processCoordinates(geometry.coordinates as number[][], color);
    }

    if (geometry.type === 'MultiLineString') {
      // Create vertical lines for each coordinate in each line
      const allSegments: Array<{
        source: [number, number, number];
        target: [number, number, number];
        color: [number, number, number, number];
      }> = [];
      const lines = geometry.coordinates as number[][][];
      for (const line of lines) {
        allSegments.push(...this.processCoordinates(line, color));
      }
      return allSegments;
    }

    // For Point and MultiPoint, use single representative coordinate
    const coords = this.getRepresentativeCoordinate(geometry);
    if (coords) {
      const [lon, lat] = coords;
      const elevation = this.getElevationFromCoordinates(geometry.coordinates);
      if (elevation > 0) {
        return [this.createVerticalSegment(lon, lat, elevation, color)];
      }
    }

    return [];
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
   * Determine material settings based on hover/selection state.
   * When elevation is enabled, uses 3D lighting effects to differentiate states.
   */
  /**
   * Render highlight sublayer (underneath main layer) for 2D shapes only.
   * 3D shapes (extruded polygons/elevated points) use color tinting in the main layer instead.
   * Note: Points with icons use coffin corners instead of highlight layer.
   */
  private renderHighlightLayer(
    features: Shape['feature'][],
  ): GeoJsonLayer | null {
    const { selectedShapeId, showHighlight, highlightColor, enableElevation } =
      this.props;

    // Skip if no selection or highlight is disabled
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
    if (selectedFeature.geometry.type === 'Point') {
      const hasIcon = !!selectedFeature.properties?.styleProperties?.icon;
      if (hasIcon) {
        return null;
      }
    }

    // Skip for 3D shapes - they use color tinting in main layer
    if (enableElevation) {
      const isPolygon =
        selectedFeature.geometry.type === 'Polygon' ||
        selectedFeature.geometry.type === 'MultiPolygon';
      const isPoint = selectedFeature.geometry.type === 'Point';
      const hasElevation = this.getFeatureElevation(selectedFeature) > 0;

      if ((isPolygon || isPoint) && hasElevation) {
        return null; // Main layer handles 3D selection highlight
      }
    }

    // Render 2D highlight layer (outline only)
    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: [selectedFeature] as any,

      // Styling - outline only for 2D shapes
      filled: false,
      stroked: true,
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: MAP_INTERACTION.LINE_WIDTH_MIN_PIXELS,
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
   * Render hover layer for extruded polygons (when enableElevation is true).
   * Uses material-based lighting to add brightness on hover.
   * Works for both selected and non-selected shapes.
   */
  private renderHoverLayer(features: Shape['feature'][]): GeoJsonLayer | null {
    const { enableElevation, selectedShapeId, applyBaseOpacity } = this.props;
    const hoverIndex = this.state?.hoverIndex;

    // Only render if elevation is enabled and something is hovered
    if (!enableElevation || hoverIndex === undefined) {
      return null;
    }

    const hoveredFeature = features[hoverIndex];
    if (!hoveredFeature) {
      return null;
    }

    // Only render for polygons
    const isPolygon =
      hoveredFeature.geometry.type === 'Polygon' ||
      hoveredFeature.geometry.type === 'MultiPolygon';
    if (!isPolygon) {
      return null;
    }

    // Get the fill color for hover (solid turquoise if selected, base color otherwise)
    const getHoverFillColor = (
      d: Shape['feature'],
    ): [number, number, number, number] => {
      const baseColor = getFillColor(d, applyBaseOpacity);

      // Use solid turquoise if this is the selected shape (matching curtains)
      if (d.properties?.shapeId === selectedShapeId) {
        const a = baseColor[3] ?? 255;
        return [40, 245, 190, a];
      }

      // Ensure we return RGBA format
      return baseColor.length === 4
        ? (baseColor as [number, number, number, number])
        : [
            baseColor[0] ?? 0,
            baseColor[1] ?? 0,
            baseColor[2] ?? 0,
            baseColor[3] ?? 255,
          ];
    };

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: [hoveredFeature] as any,

      // Styling
      filled: true,
      stroked: false, // No strokes on extruded polygons (deck.gl limitation)
      getFillColor: getHoverFillColor,

      // Extrusion with hover material (brighter lighting)
      extruded: true,
      getElevation: this.getFeatureElevation,
      material: MATERIAL_SETTINGS.HOVERED,

      // Behavior
      pickable: false,
      updateTriggers: {
        data: [features, hoverIndex],
        getFillColor: [features, applyBaseOpacity, selectedShapeId],
        getElevation: [features],
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
    const hoverIndex = this.state?.hoverIndex;

    // Use cached shapeId->index map for O(1) lookup
    const shapeIdToIndex = this.featuresCache?.shapeIdToIndex;
    if (!shapeIdToIndex) {
      return null;
    }

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
      const featureIndex = shapeId ? shapeIdToIndex.get(shapeId) : undefined;
      const isHovered = hoverIndex !== undefined && featureIndex === hoverIndex;

      return isSelected || isHovered;
    });

    if (pointFeatures.length === 0) {
      return null;
    }

    // Get icon atlas from first point feature (all should share the same atlas)
    const firstPointIcon = pointFeatures[0]?.properties?.styleProperties?.icon;
    const iconAtlas = firstPointIcon?.atlas;
    const iconMapping = firstPointIcon?.mapping;

    if (!(iconAtlas && iconMapping)) {
      logger.warn(
        'Point shape has icon style but missing iconAtlas or iconMapping - coffin corners will not render',
      );
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
        const featureIndex = shapeId ? shapeIdToIndex.get(shapeId) : undefined;
        const isHovered =
          hoverIndex !== undefined && featureIndex === hoverIndex;

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
    const { pickable, applyBaseOpacity, selectedShapeId, enableElevation } =
      this.props;

    // Single-pass icon config extraction (O(1) best case with early return)
    const {
      hasIcons,
      atlas: iconAtlas,
      mapping: iconMapping,
    } = this.getIconConfig(features);

    // Helper to get selection color (solid turquoise, matching curtains)
    const getSelectionColor = (
      baseColor: Color,
    ): [number, number, number, number] => {
      // Use solid turquoise with the base alpha (same as curtains)
      const a = baseColor[3] ?? 255;
      return [40, 245, 190, a];
    };

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: features as any,

      // Styling
      filled: true,
      stroked: true,
      getFillColor: (d: Shape['feature']) => {
        const baseColor = getFillColor(d, applyBaseOpacity);

        // Apply solid turquoise for selected extruded polygons and elevated points (matching curtains)
        if (enableElevation && d.properties?.shapeId === selectedShapeId) {
          const isPolygon =
            d.geometry.type === 'Polygon' || d.geometry.type === 'MultiPolygon';
          const isPoint = d.geometry.type === 'Point';
          const hasElevation = this.getFeatureElevation(d) > 0;

          if ((isPolygon || isPoint) && hasElevation) {
            return getSelectionColor(baseColor);
          }
        }

        return baseColor;
      },
      getLineColor,
      getLineWidth: (d, info) => {
        // Skip hover line width for elevated LineStrings - curtain handles it
        if (
          this.props.enableElevation &&
          (d.geometry.type === 'LineString' ||
            d.geometry.type === 'MultiLineString') &&
          this.getFeatureElevation(d) > 0
        ) {
          return d.properties?.styleProperties?.lineWidth ?? 2;
        }

        const isHovered = info?.index === this.state?.hoverIndex;
        return getHoverLineWidth(d, isHovered);
      },
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: MAP_INTERACTION.LINE_WIDTH_MIN_PIXELS,
      lineWidthMaxPixels: 20,

      // Polygon extrusion (when elevation enabled)
      // NOTE: deck.gl has a limitation where stroked polygon outlines only render when !extruded && stroked
      // This means hover/selection styling (dash arrays, line width) won't work for extruded polygons
      // See: https://github.com/visgl/deck.gl/blob/master/modules/layers/src/geojson-layer/geojson-layer.ts#L467-508
      // Tested fix: Changing condition to `!wireframe && stroked` in deck.gl source did NOT resolve the issue
      // Solution: Separate hover/highlight layers with material-based lighting for extruded polygons
      extruded: this.props.enableElevation ?? false,
      getElevation: this.getFeatureElevation,
      ...(this.props.enableElevation
        ? {
            material: MATERIAL_SETTINGS.NORMAL,
          }
        : {}),

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
            getIconColor: getLineColor,
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
      // Skip for elevated LineStrings (curtains handle selection visual feedback)
      extensions: [new PathStyleExtension({ dash: true })],
      getDashArray: (d: Shape['feature']) => {
        // Skip dash styling for elevated LineStrings - curtain handles it
        if (
          this.props.enableElevation &&
          (d.geometry.type === 'LineString' ||
            d.geometry.type === 'MultiLineString') &&
          this.getFeatureElevation(d) > 0
        ) {
          return getDashArray(d); // Use default dash pattern only
        }

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

      // Depth testing - enable for 3D shapes to prevent rendering through globe
      ...(this.props.enableElevation
        ? {
            parameters: {
              depthTest: true,
              depthCompare: 'less-equal',
            },
          }
        : {}),

      // Update triggers
      updateTriggers: {
        getFillColor: [
          features,
          applyBaseOpacity,
          selectedShapeId,
          enableElevation,
        ],
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
   * Supports three modes:
   * - 'always': Show labels for all shapes
   * - 'hover': Show label only for the currently hovered shape
   * - 'never': No labels
   */
  private renderLabelsLayer(): ReturnType<typeof createShapeLabelLayer> | null {
    const { showLabels, data, labelOptions } = this.props;

    // No labels if disabled
    if (showLabels === 'never') {
      return null;
    }

    // Determine which shapes to show labels for
    let labelData = data;
    if (showLabels === 'hover') {
      const hoverIndex = this.state?.hoverIndex;
      if (hoverIndex === undefined) {
        return null; // No shape hovered, no label to show
      }
      const hoveredShape = data[hoverIndex];
      labelData = hoveredShape ? [hoveredShape] : [];
    }

    if (labelData.length === 0) {
      return null;
    }

    return createShapeLabelLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
      data: labelData,
      labelOptions,
    });
  }

  /**
   * Render vertical elevation indicator lines for non-polygon shapes.
   * Creates vertical "strut" lines from ground level to elevated features.
   * For LineStrings, creates a "curtain" effect with vertical lines at each coordinate.
   * Polygons use wireframe extrusion instead.
   */
  private renderElevationIndicatorLayer(
    features: Shape['feature'][],
  ): LineLayer | null {
    // Filter to non-polygon features with elevation > 0
    const elevatedFeatures = features.filter((f) => {
      // Polygons use wireframe extrusion, don't need separate indicators
      if (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') {
        return false;
      }

      const elevation = this.getFeatureElevation(f);
      return elevation > 0;
    });

    if (elevatedFeatures.length === 0) {
      return null;
    }

    // Create line segments from ground to elevated position
    type LineSegment = {
      source: [number, number, number];
      target: [number, number, number];
      color: [number, number, number, number];
    };

    const lineData: LineSegment[] = [];

    for (const feature of elevatedFeatures) {
      const { geometry } = feature;
      const lineColor = getLineColor(feature);

      // Ensure RGBA format (add alpha if needed)
      const color: [number, number, number, number] =
        lineColor.length === 4
          ? (lineColor as [number, number, number, number])
          : ([...lineColor, 255] as [number, number, number, number]);

      // Generate line segments for this feature
      const segments = this.createElevationLineSegments(geometry, color);
      lineData.push(...segments);
    }

    if (lineData.length === 0) {
      return null;
    }

    return new LineLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-indicators`,
      data: lineData,
      getSourcePosition: (d: LineSegment) => d.source,
      getTargetPosition: (d: LineSegment) => d.target,
      getColor: (d: LineSegment) => d.color,
      getWidth: 2,
      widthUnits: 'pixels',
      pickable: false,
      updateTriggers: {
        data: [features],
        getColor: [features],
      },
    });
  }

  /**
   * Create vertical curtain polygon features from LineString coordinates.
   * Converts elevated LineStrings into vertical rectangular polygons from ground to elevation.
   */
  private createCurtainPolygonFeatures(features: Shape['feature'][]): Array<{
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
    properties: {
      fillColor: [number, number, number, number];
      lineColor: [number, number, number, number];
      shapeId?: ShapeId; // Track which shape this curtain belongs to
    };
  }> {
    const { applyBaseOpacity } = this.props;
    const curtainFeatures: Array<{
      type: 'Feature';
      geometry: {
        type: 'Polygon';
        coordinates: number[][][];
      };
      properties: {
        fillColor: [number, number, number, number];
        lineColor: [number, number, number, number];
        shapeId?: ShapeId;
      };
    }> = [];

    // Filter to LineString features with elevation > 0
    const lineFeatures = features.filter((f) => {
      if (
        f.geometry.type !== 'LineString' &&
        f.geometry.type !== 'MultiLineString'
      ) {
        return false;
      }
      const elevation = this.getFeatureElevation(f);
      return elevation > 0;
    });

    for (const feature of lineFeatures) {
      const { geometry } = feature;
      const lineColor = getLineColor(feature);
      const shapeId = feature.properties?.shapeId;

      // Ensure RGBA format
      const lineColorRGBA: [number, number, number, number] =
        lineColor.length === 4
          ? (lineColor as [number, number, number, number])
          : ([...lineColor, 255] as [number, number, number, number]);

      // Create fill color with base opacity (same as polygon fills)
      const fillColor: [number, number, number, number] = applyBaseOpacity
        ? [
            lineColorRGBA[0],
            lineColorRGBA[1],
            lineColorRGBA[2],
            Math.round(lineColorRGBA[3] * 0.2),
          ]
        : lineColorRGBA;

      if (geometry.type === 'LineString') {
        const coordinates = geometry.coordinates as number[][];
        curtainFeatures.push(
          ...this.createCurtainPolygonsFromLine(
            coordinates,
            fillColor,
            lineColorRGBA,
            shapeId,
          ),
        );
      } else if (geometry.type === 'MultiLineString') {
        const lines = geometry.coordinates as number[][][];
        for (const line of lines) {
          curtainFeatures.push(
            ...this.createCurtainPolygonsFromLine(
              line,
              fillColor,
              lineColorRGBA,
              shapeId,
            ),
          );
        }
      }
    }

    return curtainFeatures;
  }

  /**
   * Create curtain polygon features from a single LineString.
   * Each pair of consecutive coordinates becomes a vertical rectangular polygon.
   */
  private createCurtainPolygonsFromLine(
    coordinates: number[][],
    fillColor: [number, number, number, number],
    lineColor: [number, number, number, number],
    shapeId?: ShapeId,
  ): Array<{
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
    properties: {
      fillColor: [number, number, number, number];
      lineColor: [number, number, number, number];
      shapeId?: ShapeId;
    };
  }> {
    const polygons: Array<{
      type: 'Feature';
      geometry: {
        type: 'Polygon';
        coordinates: number[][][];
      };
      properties: {
        fillColor: [number, number, number, number];
        lineColor: [number, number, number, number];
        shapeId?: ShapeId;
      };
    }> = [];

    // Create vertical polygon for each pair of consecutive coordinates
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lon1, lat1, elev1] = coordinates[i];
      const [lon2, lat2, elev2] = coordinates[i + 1];

      if (
        lon1 === undefined ||
        lat1 === undefined ||
        elev1 === undefined ||
        lon2 === undefined ||
        lat2 === undefined ||
        elev2 === undefined
      ) {
        continue;
      }

      // Skip if both points are at ground level
      if (elev1 === 0 && elev2 === 0) {
        continue;
      }

      // Create vertical rectangle as a polygon
      // Winding order: counter-clockwise when viewed from outside
      // Bottom-left -> Bottom-right -> Top-right -> Top-left -> Bottom-left (closing)
      const ring: number[][] = [
        [lon1, lat1, 0], // Bottom left (ground)
        [lon2, lat2, 0], // Bottom right (ground)
        [lon2, lat2, elev2], // Top right (elevated)
        [lon1, lat1, elev1], // Top left (elevated)
        [lon1, lat1, 0], // Close the ring
      ];

      polygons.push({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [ring],
        },
        properties: {
          fillColor,
          lineColor,
          shapeId,
        },
      });
    }

    return polygons;
  }

  /**
   * Render unified elevation visualization layer.
   * - For LineStrings: Filled curtains (vertical surfaces from ground to elevation)
   * - For Polygons: Extruded wireframe (3D box with edges)
   *
   * This layer sits UNDER the main layer.
   */
  private renderElevationVisualizationLayer(
    features: Shape['feature'][],
  ): GeoJsonLayer[] {
    const layers: GeoJsonLayer[] = [];
    const { selectedShapeId } = this.props;
    const hoverIndex = this.state?.hoverIndex;

    // LineString curtains (filled vertical surfaces)
    const allCurtainFeatures = this.createCurtainPolygonFeatures(features);

    if (allCurtainFeatures.length > 0) {
      // Determine hovered shape ID
      const hoveredShapeId =
        hoverIndex !== undefined && features[hoverIndex]
          ? features[hoverIndex].properties?.shapeId
          : undefined;

      // Filter curtains by state (main, hovered, selected)
      const mainCurtains = allCurtainFeatures.filter((f) => {
        const curtainShapeId = f.properties.shapeId;
        return (
          curtainShapeId !== hoveredShapeId &&
          curtainShapeId !== selectedShapeId
        );
      });

      const hoveredCurtains = allCurtainFeatures.filter((f) => {
        const curtainShapeId = f.properties.shapeId;
        return (
          curtainShapeId === hoveredShapeId &&
          curtainShapeId !== selectedShapeId
        );
      });

      const selectedCurtains = allCurtainFeatures.filter((f) => {
        const curtainShapeId = f.properties.shapeId;
        return curtainShapeId === selectedShapeId;
      });

      // Determine if selected curtain is also hovered
      const isSelectedHovered = selectedShapeId === hoveredShapeId;

      // Helper to brighten color for hover/selection (increases RGB values while preserving alpha)
      const brightenColor = (
        color: [number, number, number, number],
        factor: number,
      ): [number, number, number, number] => {
        return [
          Math.min(255, Math.round(color[0] * factor)),
          Math.min(255, Math.round(color[1] * factor)),
          Math.min(255, Math.round(color[2] * factor)),
          color[3], // Keep original alpha
        ];
      };

      // Main curtains (normal color)
      if (mainCurtains.length > 0) {
        layers.push(
          new GeoJsonLayer({
            id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain`,
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
            data: mainCurtains as any,
            filled: true,
            stroked: false,
            // biome-ignore lint/style/useNamingConvention: deck.gl uses _full3d naming
            _full3d: true, // Render both sides of vertical surfaces
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor type compatibility
            getFillColor: (d: any) => d.properties.fillColor,
            pickable: this.props.pickable ?? true,
            parameters: {
              depthTest: true,
              depthCompare: 'less-equal',
            },
            updateTriggers: {
              data: [features, hoveredShapeId, selectedShapeId],
              getFillColor: [features, this.props.applyBaseOpacity],
            },
          }),
        );
      }

      // Hovered curtains (brightened by 1.5x for visibility)
      if (hoveredCurtains.length > 0) {
        layers.push(
          new GeoJsonLayer({
            id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain-hover`,
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
            data: hoveredCurtains as any,
            filled: true,
            stroked: false,
            // biome-ignore lint/style/useNamingConvention: deck.gl uses _full3d naming
            _full3d: true, // Render both sides of vertical surfaces
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor type compatibility
            getFillColor: (d: any) =>
              brightenColor(d.properties.fillColor, 1.5),
            pickable: this.props.pickable ?? true,
            parameters: {
              depthTest: true,
              depthCompare: 'less-equal',
            },
            updateTriggers: {
              data: [features, hoveredShapeId, selectedShapeId],
              getFillColor: [features, this.props.applyBaseOpacity],
            },
          }),
        );
      }

      // Selected curtains (turquoise tint with brightness boost)
      if (selectedCurtains.length > 0) {
        const selectedFillColor = isSelectedHovered
          ? brightenColor([40, 245, 190, 80], 1.3) // Brighter turquoise when hovered+selected
          : ([40, 245, 190, 60] as [number, number, number, number]); // Turquoise tint

        layers.push(
          new GeoJsonLayer({
            id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-curtain-selected`,
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
            data: selectedCurtains as any,
            filled: true,
            stroked: false,
            // biome-ignore lint/style/useNamingConvention: deck.gl uses _full3d naming
            _full3d: true, // Render both sides of vertical surfaces
            // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor type compatibility
            getFillColor: () => selectedFillColor,
            pickable: this.props.pickable ?? true,
            parameters: {
              depthTest: true,
              depthCompare: 'less-equal',
            },
            updateTriggers: {
              data: [features, hoveredShapeId, selectedShapeId],
              getFillColor: [isSelectedHovered],
            },
          }),
        );
      }
    }

    // Polygon wireframes (extruded 3D boxes with edges)
    const polygonFeatures = features.filter((f) => {
      const geomType = f.geometry.type;
      return (
        (geomType === 'Polygon' || geomType === 'MultiPolygon') &&
        this.getFeatureElevation(f) > 0
      );
    });

    if (polygonFeatures.length > 0) {
      const { applyBaseOpacity } = this.props;
      layers.push(
        new GeoJsonLayer({
          id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-wireframe`,
          // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
          data: polygonFeatures as any,
          filled: false,
          stroked: false,
          extruded: true,
          wireframe: true,
          getElevation: this.getFeatureElevation,
          getFillColor: (d: Shape['feature']) =>
            getFillColor(d, applyBaseOpacity),
          getLineColor,
          pickable: false,
          parameters: {
            depthTest: true,
            depthCompare: 'less-equal',
          },
          updateTriggers: {
            getElevation: [features],
            getFillColor: [features, applyBaseOpacity],
            getLineColor: [features],
          },
        }),
      );
    }

    return layers;
  }

  /**
   * Render all sublayers
   */
  renderLayers(): Layer[] {
    // Compute features once per render cycle for performance
    const features = this.getFeaturesWithId();
    const enableElevation = this.props.enableElevation ?? false;

    const layers: Array<Layer | null> = [
      this.renderHighlightLayer(features),
      this.renderHoverLayer(features),
      this.renderCoffinCornersLayer(features),
    ];

    // Elevation visualization layers (wireframe for polygons, curtains for lines)
    // These render UNDER the main layer
    if (enableElevation) {
      layers.push(...this.renderElevationVisualizationLayer(features));
      layers.push(this.renderElevationIndicatorLayer(features));
    }

    // Main layer with fills and styled strokes
    // When elevation enabled, uses explicit 3D coordinates instead of extrusion
    // so PathStyleExtension works for hover/selection effects
    layers.push(this.renderMainLayer(features));

    // Labels on top of everything
    layers.push(this.renderLabelsLayer());

    return layers.filter(Boolean) as Layer[];
  }
}
