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
import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer, IconLayer, LineLayer, TextLayer } from '@deck.gl/layers';
import { createLoggerDomain } from '@/shared/logger';
import { DEFAULT_TEXT_SIZE, DEFAULT_TEXT_STYLE } from '../../text-settings';
import { SHAPE_LAYER_IDS } from '../shared/constants';
import { type ShapeEvent, ShapeEvents } from '../shared/events';
import {
  isCircleShape,
  isLineGeometry,
  isPointType,
  isPolygonGeometry,
} from '../shared/types';
import {
  getDashArray,
  getFillColor,
  getLineColor,
} from '../shared/utils/style-utils';
import {
  BRIGHTNESS_FACTOR,
  COFFIN_CORNERS,
  DASH_EXTENSION,
  DEFAULT_DISPLAY_PROPS,
  HIGHLIGHT_COLOR_TUPLE,
  MAP_INTERACTION,
  MATERIAL_SETTINGS,
} from './constants';
import { createShapeLabelLayer } from './shape-label-layer';
import {
  applyOverlayOpacity,
  brightenColor,
  getHighlightLineWidth,
  getHoverLineWidth,
  getOverlayFillColor,
} from './utils/display-style';
import {
  buildIndicatorLineData,
  classifyElevatedFeatures,
  createCurtainPolygonFeatures,
  flattenFeatureTo2D,
  getFeatureElevation,
  partitionCurtains,
} from './utils/elevation';
import {
  extendMappingWithCoffinCorners,
  getIconConfig,
  getIconLayerProps,
  getIconUpdateTriggers,
} from './utils/icon-config';
import { getPointInteractionState } from './utils/interaction';
import { getLabelPosition2d } from './utils/labels';
import { getRadiusLabelText } from './utils/radius-label';
import type { Rgba255Tuple } from '@accelint/predicates';
import type { Layer, PickingInfo } from '@deck.gl/core';
import type { Shape, ShapeId } from '../shared/types';
import type {
  CurtainFeature,
  DisplayShapeLayerProps,
  DisplayShapeLayerState,
  ElevatedFeatureClassification,
  ElevationCache,
  FeaturesCache,
  IndicatorCache,
  LineSegment,
} from './types';

const logger = createLoggerDomain('[DisplayShapeLayer]');

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
 * - **Interactive selection**: Click handling with brightness overlay on polygon select, optional highlight effect for non-icon-Point shapes (if showHighlight=true)
 * - **Hover effects**: Polygon fills brighten via material lighting; outline width increases by 2px on hover
 * - **Customizable labels**: Flexible label positioning with per-shape or global options
 * - **Style properties**: Full control over colors, border/outline patterns, and opacity
 * - **Event bus integration**: Automatically emits shape events via @accelint/bus
 * - **Multi-map support**: Events include map instance ID for isolation
 *
 * ## Interaction Philosophy
 * Interactions never modify a shape's innate styling. Hover and selection are always
 * additive overlays rendered apart from the main layer using opacity-scaled fill colors
 * and material-based brightness — the base shape is never altered.
 *
 * ## Layer Structure
 * Renders up to seven sublayers (in order, bottom to top):
 * 1. **Select layer**: Selection brightness overlay for polygon shapes
 * 2. **Hover layer**: Hover brightness overlay for polygon shapes
 * 3. **Coffin corners layer**: Selection/hover feedback for Point shapes with icons
 * 4. **Elevation visualization**: Curtains (LineStrings) or wireframes (polygons) — elevation only
 * 5. **Elevation indicators**: Vertical strut lines for elevated non-polygon shapes — elevation only
 * 6. **Main GeoJsonLayer**: Shape geometries with styling and interaction
 * 7. **Label layer**: Text labels (if showLabels enabled)
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
  /** Cache for elevation classification and curtain features */
  private elevationCache: ElevationCache | null = null;
  /** Cache for elevation indicator line segments */
  private indicatorCache: IndicatorCache | null = null;

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
    this.elevationCache = null;
    this.indicatorCache = null;
  }

  /**
   * Resolved highlight color — uses prop if provided, falls back to default.
   */
  private get resolvedHighlight(): Rgba255Tuple {
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
  ): PickingInfo | undefined {
    if (!info.object) {
      return undefined;
    }

    const curtainShapeId = info.object.properties?.shapeId;
    if (!curtainShapeId) {
      return undefined;
    }

    const features = this.getFeaturesWithId();
    const featureIndex = this.featuresCache?.shapeIdToIndex.get(curtainShapeId);

    if (featureIndex === undefined) {
      return undefined;
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
    sourceLayer?: Layer | null;
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
    const normalizedLineColors: Rgba255Tuple[] = [];

    for (const [i, shape] of data.entries()) {
      let feature: Shape['feature'] = {
        ...shape.feature,
        properties: {
          ...shape.feature.properties,
          shapeId: shape.id,
        },
      };

      // For polygon geometries with elevation: strip Z coordinates to prevent
      // deck.gl double-counting (SolidPolygonLayer adds coordinate Z + getElevation).
      // The feature's maxElevation property is the source of truth for getFeatureElevation.
      if (
        isPolygonGeometry(feature.geometry) &&
        getFeatureElevation(feature) > 0
      ) {
        feature = flattenFeatureTo2D(feature);
      }

      features.push(feature);
      shapeIdToIndex.set(shape.id, i);
      normalizedLineColors.push(getLineColor(shape.feature));
    }

    this.featuresCache = {
      data,
      features,
      shapeIdToIndex,
      normalizedLineColors,
    };
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
    const shapeId = info.object?.properties?.shapeId as ShapeId | undefined;
    const shape = shapeId ? this.getShapeById(shapeId) : undefined;

    // Dedupe hover events - only emit if hovered shape changed
    if (shapeId !== this.state?.lastHoveredId) {
      this.setState({ lastHoveredId: shapeId });

      // Emit shape hovered event via bus (include mapId for multi-map isolation)
      // Cast to null at the bus boundary — ShapeHoveredEvent uses null for hover-end
      shapeBus.emit(ShapeEvents.hovered, {
        shapeId: shapeId ?? null,
        mapId,
      });
    }

    // Always call callback if provided (for local state updates)
    if (onShapeHover) {
      onShapeHover(shape);
    }
  };

  /**
   * Get or compute elevation-derived data (feature classification + curtain features).
   * Cached on features identity and applyBaseOpacity to avoid per-frame recomputation.
   */
  private getElevationData(
    features: Shape['feature'][],
    applyBaseOpacity: boolean | undefined,
  ): {
    classification: ElevatedFeatureClassification;
    curtainFeatures: CurtainFeature[];
  } {
    if (
      this.elevationCache !== null &&
      this.elevationCache.features === features &&
      this.elevationCache.applyBaseOpacity === applyBaseOpacity
    ) {
      return this.elevationCache;
    }

    const classification = classifyElevatedFeatures(
      features,
      getFeatureElevation,
    );
    const curtainFeatures = createCurtainPolygonFeatures(
      classification.lines,
      applyBaseOpacity,
    );

    this.elevationCache = {
      features,
      applyBaseOpacity,
      classification,
      curtainFeatures,
    };
    return { classification, curtainFeatures };
  }

  /**
   * Render highlight sublayer (underneath main layer).
   * Note: Points with icons use coffin corners instead of highlight layer.
   */
  private renderHighlightLayer(features: Shape['feature'][]): GeoJsonLayer[] {
    const { selectedShapeId, showHighlight } = this.props;

    // Skip if no selection or highlight is disabled
    if (!selectedShapeId || showHighlight === false) {
      return [];
    }

    const featureIndex =
      this.featuresCache?.shapeIdToIndex.get(selectedShapeId);

    const selectedFeature =
      featureIndex !== undefined ? features[featureIndex] : undefined;

    if (!selectedFeature) {
      return [];
    }

    // Skip highlight layer for Point geometries with icons - they use coffin corners instead
    if (isPointType(selectedFeature.geometry)) {
      const hasIcon = !!selectedFeature.properties?.styleProperties?.icon;
      if (hasIcon) {
        return [];
      }
    }

    // Strip Z from LineString coordinates so the highlight outline renders at
    // ground level rather than following the elevated path
    const highlightFeature = flattenFeatureTo2D(selectedFeature);
    const lineColor = this.resolvedHighlight;

    // Render 2D highlight layer (outline only)
    return [
      new GeoJsonLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_HIGHLIGHT}`,
        data: [highlightFeature],

        // Styling - outline only for 2D shapes
        filled: false,
        stroked: true,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: MAP_INTERACTION.LINE_WIDTH_MIN_PIXELS,
        getLineColor: lineColor,
        getLineWidth: getHighlightLineWidth,

        // Behavior
        pickable: false,
        updateTriggers: {
          getLineColor: [this.props.highlightColor],
          getLineWidth: [selectedShapeId, features],
        },
      }),
    ];
  }

  /**
   * Render selection overlay layer for polygon shapes.
   * Mirrors renderHoverLayer but triggers on selectedShapeId instead of hover.
   * When a shape is both selected and hovered, both layers stack for a brighter combined effect.
   */
  private renderSelectLayer(features: Shape['feature'][]): GeoJsonLayer[] {
    const { selectedShapeId, enableElevation } = this.props;

    if (!selectedShapeId) {
      return [];
    }

    const featureIndex =
      this.featuresCache?.shapeIdToIndex.get(selectedShapeId);

    const selectedFeature =
      featureIndex !== undefined ? features[featureIndex] : undefined;

    if (!selectedFeature) {
      return [];
    }

    // Only render for polygons — non-polygon shapes have no fill to brighten
    if (!isPolygonGeometry(selectedFeature.geometry)) {
      return [];
    }

    return [
      new GeoJsonLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_SELECTION}`,
        data: [selectedFeature],

        filled: true,
        stroked: false,
        getFillColor: getOverlayFillColor,

        // Material brightness for selection; extrusion only when elevation enabled
        extruded: enableElevation,
        getElevation: getFeatureElevation,
        material: MATERIAL_SETTINGS.HOVER_OR_SELECT,

        // Behavior
        pickable: false,
        updateTriggers: {
          data: [features, selectedShapeId],
          getFillColor: [features],
          getElevation: [features],
        },
      }),
    ];
  }

  /**
   * Render hover layer for all polygon shapes (2D and 3D).
   * Overlays the shape's base fill with brighter material lighting.
   * Stacks with other interaction layers (e.g. selection highlight underneath).
   */
  private renderHoverLayer(features: Shape['feature'][]): GeoJsonLayer[] {
    const { enableElevation, selectedShapeId } = this.props;
    const hoverIndex = this.state?.hoverIndex;

    // Only render if something is hovered
    if (hoverIndex === undefined) {
      return [];
    }

    const hoveredFeature = features[hoverIndex];
    if (!hoveredFeature) {
      return [];
    }

    // Only render for polygons
    if (!isPolygonGeometry(hoveredFeature.geometry)) {
      return [];
    }

    const isAlsoSelected =
      hoveredFeature.properties?.shapeId === selectedShapeId;
    const material = isAlsoSelected
      ? MATERIAL_SETTINGS.HOVER_AND_SELECT
      : MATERIAL_SETTINGS.HOVER_OR_SELECT;

    return [
      new GeoJsonLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-hover`,
        data: [hoveredFeature],

        // Styling
        filled: true,
        stroked: false, // Main layer handles strokes; this layer is fill-only
        getFillColor: getOverlayFillColor,

        // Material brightness scales with interaction state; extrusion only when elevation enabled
        extruded: enableElevation,
        getElevation: getFeatureElevation,
        material,

        // Behavior
        pickable: false,
        updateTriggers: {
          data: [features, hoverIndex],
          getFillColor: [features],
          getElevation: [features],
          material: [selectedShapeId, hoverIndex],
        },
      }),
    ];
  }

  /**
   * Render coffin corners layer for Point geometries that have icons on hover/select
   * Coffin corners provide visual feedback for points instead of select layer
   */
  private renderCoffinCornersLayer(features: Shape['feature'][]): IconLayer[] {
    const { selectedShapeId } = this.props;
    const hoverIndex = this.state?.hoverIndex;

    // Use cached shapeId->index map for O(1) lookup
    const shapeIdToIndex = this.featuresCache?.shapeIdToIndex;
    if (!shapeIdToIndex) {
      return [];
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
      const { isSelected, isHovered } = getPointInteractionState(
        f,
        selectedShapeId,
        hoverIndex,
        shapeIdToIndex,
      );
      if (isSelected || isHovered) {
        pointFeatures.push(f);
      }
    }

    if (pointFeatures.length === 0) {
      return [];
    }

    // Get icon atlas from first point feature (all should share the same atlas)
    const firstPointIcon = pointFeatures[0]?.properties?.styleProperties?.icon;
    const iconAtlas = firstPointIcon?.atlas;
    const iconMapping = firstPointIcon?.mapping;

    if (!(iconAtlas && iconMapping)) {
      logger.warn(
        'Point shape has icon style but missing iconAtlas or iconMapping - coffin corners will not render',
      );
      return [];
    }

    const extendedMapping = extendMappingWithCoffinCorners(iconMapping);

    return [
      new IconLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-coffin-corners`,
        data: pointFeatures,
        iconAtlas,
        iconMapping: extendedMapping,
        getIcon: (d: Shape['feature']) => {
          const { isSelected, isHovered } = getPointInteractionState(
            d,
            selectedShapeId,
            hoverIndex,
            shapeIdToIndex,
          );
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
          const coords = isPointType(d.geometry)
            ? d.geometry.coordinates
            : [0, 0];
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
      }),
    ];
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
    } = getIconConfig(features);

    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}`,
      data: features,

      // Styling
      filled: true,
      stroked: true,
      getFillColor: (d: Shape['feature']) => getFillColor(d, applyBaseOpacity),
      getLineColor: (d: Shape['feature'], info) => {
        // Read pre-normalized color from cache — avoids normalizeColor allocation per feature per trigger
        const baseColor =
          this.featuresCache?.normalizedLineColors[info?.index ?? -1] ??
          getLineColor(d);
        const isHovered = info?.index === this.state?.hoverIndex;
        const isSelected = d.properties?.shapeId === selectedShapeId;
        if (isHovered && isSelected) {
          return brightenColor(baseColor, BRIGHTNESS_FACTOR.HOVER_AND_SELECT);
        }
        if (isHovered || isSelected) {
          return brightenColor(baseColor, BRIGHTNESS_FACTOR.HOVER_OR_SELECT);
        }
        return baseColor;
      },
      getLineWidth: (d, info) => {
        // Skip hover line width for elevated LineStrings - curtain handles it
        if (
          this.props.enableElevation &&
          isLineGeometry(d.geometry) &&
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
      // Solution: Separate hover/select layers with material-based lighting for extruded polygons
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

      // Dash pattern support for shape-configured line patterns (solid/dashed/dotted)
      extensions: DASH_EXTENSION,
      getDashArray,

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
        getFillColor: [features, applyBaseOpacity],
        getLineColor: [features, this.state?.hoverIndex, selectedShapeId],
        getLineWidth: [features, this.state?.hoverIndex],
        getDashArray: [features],
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
  private renderLabelsLayer(): ReturnType<typeof createShapeLabelLayer>[] {
    const { showLabels, data, labelOptions } = this.props;

    // No labels if disabled
    if (showLabels === 'never') {
      return [];
    }

    // Determine which shapes to show labels for
    let labelData = data;
    if (showLabels === 'hover') {
      const hoverIndex = this.state?.hoverIndex;
      if (hoverIndex === undefined) {
        return []; // No shape hovered, no label to show
      }
      const hoveredShape = data[hoverIndex];
      labelData = hoveredShape ? [hoveredShape] : [];
    }

    if (labelData.length === 0) {
      return [];
    }

    return [
      createShapeLabelLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY_LABELS}`,
        data: labelData,
        labelOptions,
      }),
    ];
  }

  /**
   * Render radius label layer for hovered circle shapes.
   * Shows the circle's radius value converted to the configured display unit.
   *
   * Positioning relative to the shape's label:
   * - When showLabels is 'always' or 'hover': appears below the label
   * - When showLabels is 'never': appears in the label's position
   */
  private renderRadiusLabelLayer(): TextLayer[] {
    const { data, unit, showLabels, labelOptions } = this.props;

    const hoverIndex = this.state?.hoverIndex;
    if (hoverIndex === undefined) {
      return [];
    }

    const hoveredShape = data[hoverIndex];
    if (!(hoveredShape && isCircleShape(hoveredShape))) {
      return [];
    }

    const radiusText = getRadiusLabelText(hoveredShape, unit);
    if (!radiusText) {
      return [];
    }

    // Use the same position the label would occupy
    const labelPosition = getLabelPosition2d(hoveredShape, labelOptions);
    if (!labelPosition) {
      return [];
    }

    // When label is visible, offset below it; otherwise take its place
    const labelVisible = showLabels !== 'never';
    const pixelOffset: [number, number] = labelVisible
      ? [
          labelPosition.pixelOffset[0],
          labelPosition.pixelOffset[1] + DEFAULT_TEXT_SIZE + 2,
        ]
      : labelPosition.pixelOffset;

    return [
      new TextLayer({
        id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-radius-label`,
        data: [{ text: radiusText, position: labelPosition.coordinates }],
        getText: (d) => d.text,
        getPosition: (d) => d.position as [number, number],
        getPixelOffset: pixelOffset,
        getTextAnchor: labelPosition.textAnchor,
        getAlignmentBaseline: labelPosition.alignmentBaseline,
        ...DEFAULT_TEXT_STYLE,
        getAngle: 0,
        background: false,
        fontFamily: 'Roboto MonoVariable, monospace',
        pickable: false,
        updateTriggers: {
          getText: [hoverIndex, unit],
          getPosition: [hoverIndex, labelOptions],
          getPixelOffset: [hoverIndex, labelOptions, showLabels],
          getTextAnchor: [hoverIndex, labelOptions],
          getAlignmentBaseline: [hoverIndex, labelOptions],
        },
      }),
    ];
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
  ): LineLayer[] {
    if (elevatedNonPolygons.length === 0) {
      return [];
    }

    const { selectedShapeId } = this.props;
    const hoverIndex = this.state?.hoverIndex;

    // Return stable lineData when geometry and interaction state haven't changed.
    // A new array reference would force deck.gl to rebuild GPU buffers every frame.
    const cache = this.indicatorCache;
    let lineData: LineSegment[];

    if (
      cache !== null &&
      cache.features === features &&
      cache.selectedShapeId === selectedShapeId &&
      cache.hoverIndex === hoverIndex
    ) {
      lineData = cache.lineData;
    } else {
      lineData = buildIndicatorLineData(
        elevatedNonPolygons,
        features,
        selectedShapeId,
        hoverIndex,
      );
      this.indicatorCache = { features, selectedShapeId, hoverIndex, lineData };
    }

    if (lineData.length === 0) {
      return [];
    }

    return [
      new LineLayer({
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
          getColor: [features, selectedShapeId, hoverIndex],
        },
      }),
    ];
  }

  /**
   * Create a single curtain GeoJsonLayer with shared configuration.
   */
  private createCurtainGeoJsonLayer(
    idSuffix: string,
    data: CurtainFeature[],
    getFillColor: (d: CurtainFeature) => Rgba255Tuple,
    dataTriggers: unknown[],
    fillColorTriggers: unknown[],
  ): GeoJsonLayer {
    return new GeoJsonLayer({
      id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-${idSuffix}`,
      data: data,
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
      // All curtain segments in a partition share the same lineColor (same hovered shape).
      // Precompute once to avoid N allocations in the getFillColor accessor.
      const hoveredColor = applyOverlayOpacity(
        brightenColor(
          (hovered[0] as CurtainFeature).properties.lineColor,
          BRIGHTNESS_FACTOR.HOVER_OR_SELECT,
        ),
      );
      layers.push(
        this.createCurtainGeoJsonLayer(
          'elevation-curtain-hover',
          hovered,
          () => hoveredColor,
          dataTriggers,
          [features],
        ),
      );
    }

    if (selected.length > 0) {
      // Selected + hovered stacks to HOVER_AND_SELECT; selected only is HOVER_OR_SELECT
      const factor = isSelectedHovered
        ? BRIGHTNESS_FACTOR.HOVER_AND_SELECT
        : BRIGHTNESS_FACTOR.HOVER_OR_SELECT;
      const selectedColor = applyOverlayOpacity(
        brightenColor(
          (selected[0] as CurtainFeature).properties.lineColor,
          factor,
        ),
      );
      layers.push(
        this.createCurtainGeoJsonLayer(
          'elevation-curtain-selected',
          selected,
          () => selectedColor,
          dataTriggers,
          [features, isSelectedHovered],
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
    allCurtainFeatures: CurtainFeature[],
    elevatedPolygons: Shape['feature'][],
  ): GeoJsonLayer[] {
    const layers: GeoJsonLayer[] = [];

    // LineString curtains (filled vertical surfaces) — pre-computed by getElevationData()
    if (allCurtainFeatures.length > 0) {
      layers.push(...this.renderCurtainLayers(features, allCurtainFeatures));
    }

    // Polygon wireframes (extruded 3D boxes with edges)
    if (elevatedPolygons.length > 0) {
      const { applyBaseOpacity } = this.props;
      layers.push(
        new GeoJsonLayer({
          id: `${this.props.id}-${SHAPE_LAYER_IDS.DISPLAY}-elevation-wireframe`,
          data: elevatedPolygons,
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

    const layers: Layer[] = [
      ...this.renderHighlightLayer(features),
      ...this.renderSelectLayer(features),
      ...this.renderHoverLayer(features),
      ...this.renderCoffinCornersLayer(features),
    ];

    // Elevation visualization layers (wireframe for polygons, curtains for lines)
    // These render UNDER the main layer
    // Single classification pass replaces 3 separate .filter() calls per frame
    if (enableElevation) {
      const { classification, curtainFeatures } = this.getElevationData(
        features,
        this.props.applyBaseOpacity,
      );
      const { polygons, nonPolygons } = classification;
      layers.push(
        ...this.renderElevationVisualizationLayer(
          features,
          curtainFeatures,
          polygons,
        ),
      );
      layers.push(...this.renderElevationIndicatorLayer(features, nonPolygons));
    }

    // Main layer with fills and styled strokes
    // When elevation enabled, uses explicit 3D coordinates instead of extrusion
    // so PathStyleExtension works for hover/selection effects
    layers.push(this.renderMainLayer(features));

    // Labels on top of everything
    layers.push(...this.renderLabelsLayer());

    // Radius label on hover (above name labels)
    layers.push(...this.renderRadiusLabelLayer());

    return layers;
  }
}
