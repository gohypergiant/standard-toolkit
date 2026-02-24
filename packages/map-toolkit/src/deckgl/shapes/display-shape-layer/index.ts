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
import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer, IconLayer, LineLayer } from '@deck.gl/layers';
import { DASH_ARRAYS, SHAPE_LAYER_IDS } from '../shared/constants';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import { isLineGeometry, isPolygonGeometry } from '../shared/types';
import {
  getDashArray,
  getFillColor,
  getLineColor,
} from '../shared/utils/style-utils';
import {
  COFFIN_CORNERS,
  DASH_EXTENSION,
  DEFAULT_DISPLAY_PROPS,
  HIGHLIGHT_COLOR_TUPLE,
  MAP_INTERACTION,
  MATERIAL_SETTINGS,
} from './constants';
import { createShapeLabelLayer } from './shape-label-layer';
import {
  brightenColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getSelectionFillColor,
} from './utils/display-style';
import {
  classifyElevatedFeatures,
  createCurtainPolygonFeatures,
  createElevationLineSegments,
  getFeatureElevation,
  partitionCurtains,
} from './utils/elevation';
import {
  extendMappingWithCoffinCorners,
  getIconConfig,
  getIconLayerProps,
  getIconUpdateTriggers,
} from './utils/icon-config';
import type { Layer, PickingInfo } from '@deck.gl/core';
import type { Shape, ShapeId } from '../shared/types';
import type {
  CurtainFeature,
  DisplayShapeLayerProps,
  LineSegment,
} from './types';

const logger = getLogger({
  enabled: process.env.NODE_ENV !== 'production',
  level: 'warn',
  prefix: '[DisplayShapeLayer]',
  pretty: true,
});

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
   * Resolved highlight color — uses prop if provided, falls back to default.
   */
  private get resolvedHighlight(): [number, number, number, number] {
    return this.props.highlightColor ?? HIGHLIGHT_COLOR_TUPLE;
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
    const featureIndex = this.featuresCache?.shapeIdToIndex.get(curtainShapeId);

    if (featureIndex === undefined) {
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
    const index = this.featuresCache?.shapeIdToIndex.get(shapeId);
    return index !== undefined ? this.props.data[index] : undefined;
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
   * Render highlight sublayer (underneath main layer) for 2D shapes only.
   * 3D shapes (extruded polygons/elevated points) use color tinting in the main layer instead.
   * Note: Points with icons use coffin corners instead of highlight layer.
   */
  private renderHighlightLayer(
    features: Shape['feature'][],
  ): GeoJsonLayer | null {
    const { selectedShapeId, showHighlight, enableElevation } = this.props;

    // Skip if no selection or highlight is disabled
    if (!selectedShapeId || showHighlight === false) {
      return null;
    }

    const featureIndex =
      this.featuresCache?.shapeIdToIndex.get(selectedShapeId);

    const selectedFeature =
      featureIndex !== undefined ? features[featureIndex] : undefined;

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
      const geomType = selectedFeature.geometry.type;
      const hasElevation = getFeatureElevation(selectedFeature) > 0;

      if (
        (isPolygonGeometry(geomType) || geomType === 'Point') &&
        hasElevation
      ) {
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
      getLineColor: () => this.resolvedHighlight,
      getLineWidth: getHighlightLineWidth,

      // Behavior
      pickable: false,
      updateTriggers: {
        getLineColor: [this.props.highlightColor],
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
    const resolvedHighlight = this.resolvedHighlight;
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
    if (!isPolygonGeometry(hoveredFeature.geometry.type)) {
      return null;
    }

    // Get the fill color for hover (highlight color if selected, base color otherwise)
    const getHoverFillColor = (
      d: Shape['feature'],
    ): [number, number, number, number] => {
      const baseColor = getFillColor(d, applyBaseOpacity);

      if (d.properties?.shapeId === selectedShapeId) {
        return getSelectionFillColor(baseColor, resolvedHighlight);
      }

      return baseColor;
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
      getElevation: getFeatureElevation,
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
    const pointFeatures: Shape['feature'][] = [];
    for (const f of features) {
      if (f.geometry.type !== 'Point') {
        continue;
      }
      if (!f.properties?.styleProperties?.icon) {
        continue;
      }
      const shapeId = f.properties?.shapeId;
      const isSelected = shapeId === selectedShapeId;
      const featureIndex = shapeId ? shapeIdToIndex.get(shapeId) : undefined;
      const isHovered = hoverIndex !== undefined && featureIndex === hoverIndex;
      if (isSelected || isHovered) {
        pointFeatures.push(f);
      }
    }

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

    const extendedMapping = extendMappingWithCoffinCorners(iconMapping);

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
    } = getIconConfig(features);

    const resolvedHighlight = this.resolvedHighlight;

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: features as any,

      // Styling
      filled: true,
      stroked: true,
      getFillColor: (d: Shape['feature']) => {
        const baseColor = getFillColor(d, applyBaseOpacity);

        // Apply highlight color for selected extruded polygons and elevated points (matching curtains)
        if (enableElevation && d.properties?.shapeId === selectedShapeId) {
          const geomType = d.geometry.type;
          const hasElevation = getFeatureElevation(d) > 0;

          if (
            (isPolygonGeometry(geomType) || geomType === 'Point') &&
            hasElevation
          ) {
            return getSelectionFillColor(baseColor, resolvedHighlight);
          }
        }

        return baseColor;
      },
      getLineColor: (d: Shape['feature'], info) => {
        const base = getLineColor(d);
        const isSelected = d.properties?.shapeId === selectedShapeId;

        // Apply highlight border color only for elevated non-polygon shapes
        if (isSelected && enableElevation) {
          if (
            !isPolygonGeometry(d.geometry.type) &&
            getFeatureElevation(d) > 0
          ) {
            return resolvedHighlight;
          }
        }

        const isHovered = info?.index === this.state?.hoverIndex;
        if (isHovered) {
          return brightenColor(base, 1.5);
        }

        return base;
      },
      getLineWidth: (d, info) => {
        // Skip hover line width for elevated LineStrings - curtain handles it
        if (
          this.props.enableElevation &&
          isLineGeometry(d.geometry.type) &&
          getFeatureElevation(d) > 0
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
      getElevation: getFeatureElevation,
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
      ...getIconLayerProps(hasIcons, iconAtlas, iconMapping),

      // Dash pattern support - selected shapes get dotted border
      // Skip for elevated LineStrings (curtains handle selection visual feedback)
      extensions: DASH_EXTENSION,
      getDashArray: (d: Shape['feature']) => {
        // Skip dash styling for elevated LineStrings - curtain handles it
        if (
          this.props.enableElevation &&
          isLineGeometry(d.geometry.type) &&
          getFeatureElevation(d) > 0
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
        getLineColor: [
          features,
          this.state?.hoverIndex,
          selectedShapeId,
          this.props.highlightColor,
        ],
        getLineWidth: [features, this.state?.hoverIndex],
        getDashArray: [features, selectedShapeId],
        getPointRadius: [features],
        ...getIconUpdateTriggers(hasIcons, features),
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
    elevatedNonPolygons: Shape['feature'][],
  ): LineLayer | null {
    if (elevatedNonPolygons.length === 0) {
      return null;
    }

    const lineData: LineSegment[] = [];

    const { selectedShapeId } = this.props;
    const resolvedHighlight = this.resolvedHighlight;
    const hoverIndex = this.state?.hoverIndex;

    for (const feature of elevatedNonPolygons) {
      const { geometry } = feature;
      const shapeId = feature.properties?.shapeId;
      const isSelected = shapeId != null && shapeId === selectedShapeId;
      const isHovered =
        hoverIndex !== undefined &&
        features[hoverIndex]?.properties?.shapeId === shapeId;

      let color: [number, number, number, number];
      if (isSelected) {
        color = resolvedHighlight;
      } else {
        const base = getLineColor(feature);
        color = isHovered ? brightenColor(base, 1.5) : base;
      }

      // Generate line segments for this feature
      for (const segment of createElevationLineSegments(geometry, color)) {
        lineData.push(segment);
      }
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
        data: [features, selectedShapeId, hoverIndex],
        getColor: [
          features,
          selectedShapeId,
          hoverIndex,
          this.props.highlightColor,
        ],
      },
    });
  }

  /**
   * Create a single curtain GeoJsonLayer with shared configuration.
   */
  private createCurtainGeoJsonLayer(
    idSuffix: string,
    data: CurtainFeature[],
    getFillColor: (d: CurtainFeature) => [number, number, number, number],
    dataTriggers: unknown[],
    fillColorTriggers: unknown[],
  ): GeoJsonLayer {
    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-${idSuffix}`,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
      data: data as any,
      filled: true,
      stroked: false,
      // biome-ignore lint/style/useNamingConvention: deck.gl uses _full3d naming
      _full3d: true,
      // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accessor type incompatible with CurtainFeature
      getFillColor: getFillColor as any,
      pickable: this.props.pickable ?? true,
      parameters: {
        depthTest: true,
        depthCompare: 'less-equal',
      },
      updateTriggers: {
        data: dataTriggers,
        getFillColor: fillColorTriggers,
      },
    });
  }

  /**
   * Render curtain layers for elevated LineStrings.
   * Creates three separate layers for main, hovered, and selected states.
   */
  private renderCurtainLayers(
    features: Shape['feature'][],
    allCurtainFeatures: CurtainFeature[],
  ): GeoJsonLayer[] {
    const layers: GeoJsonLayer[] = [];
    const { selectedShapeId } = this.props;
    const resolvedHighlight = this.resolvedHighlight;
    const hoverIndex = this.state?.hoverIndex;

    const hoveredShapeId =
      hoverIndex !== undefined && features[hoverIndex]
        ? features[hoverIndex].properties?.shapeId
        : undefined;

    const { main, hovered, selected } = partitionCurtains(
      allCurtainFeatures,
      hoveredShapeId,
      selectedShapeId,
    );

    const isSelectedHovered = selectedShapeId === hoveredShapeId;
    const dataTriggers = [features, hoveredShapeId, selectedShapeId];

    if (main.length > 0) {
      layers.push(
        this.createCurtainGeoJsonLayer(
          'elevation-curtain',
          main,
          (d) => d.properties.fillColor,
          dataTriggers,
          [features, this.props.applyBaseOpacity],
        ),
      );
    }

    if (hovered.length > 0) {
      layers.push(
        this.createCurtainGeoJsonLayer(
          'elevation-curtain-hover',
          hovered,
          (d) => brightenColor(d.properties.fillColor, 1.5),
          dataTriggers,
          [features, this.props.applyBaseOpacity],
        ),
      );
    }

    if (selected.length > 0) {
      const selectedFillColor: [number, number, number, number] =
        isSelectedHovered
          ? brightenColor(
              [
                resolvedHighlight[0],
                resolvedHighlight[1],
                resolvedHighlight[2],
                80,
              ],
              1.3,
            )
          : [
              resolvedHighlight[0],
              resolvedHighlight[1],
              resolvedHighlight[2],
              60,
            ];

      layers.push(
        this.createCurtainGeoJsonLayer(
          'elevation-curtain-selected',
          selected,
          () => selectedFillColor,
          dataTriggers,
          [isSelectedHovered, this.props.highlightColor],
        ),
      );
    }

    return layers;
  }

  /**
   * Render elevation visualization layers (curtains for lines, wireframes for polygons).
   */
  private renderElevationVisualizationLayer(
    features: Shape['feature'][],
    elevatedLines: Shape['feature'][],
    elevatedPolygons: Shape['feature'][],
  ): GeoJsonLayer[] {
    const layers: GeoJsonLayer[] = [];

    // LineString curtains (filled vertical surfaces)
    const allCurtainFeatures = createCurtainPolygonFeatures(
      elevatedLines,
      this.props.applyBaseOpacity,
    );

    if (allCurtainFeatures.length > 0) {
      layers.push(...this.renderCurtainLayers(features, allCurtainFeatures));
    }

    // Polygon wireframes (extruded 3D boxes with edges)
    if (elevatedPolygons.length > 0) {
      const { applyBaseOpacity } = this.props;
      layers.push(
        new GeoJsonLayer({
          id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-wireframe`,
          // biome-ignore lint/suspicious/noExplicitAny: GeoJsonLayer accepts various feature formats
          data: elevatedPolygons as any,
          filled: false,
          stroked: false,
          extruded: true,
          wireframe: true,
          getElevation: getFeatureElevation,
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
    // Single classification pass replaces 3 separate .filter() calls per frame
    if (enableElevation) {
      const { lines, polygons, nonPolygons } = classifyElevatedFeatures(
        features,
        getFeatureElevation,
      );
      layers.push(
        ...this.renderElevationVisualizationLayer(features, lines, polygons),
      );
      layers.push(this.renderElevationIndicatorLayer(features, nonPolygons));
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
