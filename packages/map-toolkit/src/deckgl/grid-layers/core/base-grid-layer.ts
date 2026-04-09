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

import { Broadcast } from '@accelint/bus';
import { type Color, CompositeLayer } from '@deck.gl/core';
import { PathLayer, PolygonLayer, TextLayer } from '@deck.gl/layers';
import { getViewportBounds } from '../shared/viewport-utils';
import {
  type BaseGridLayerProps,
  type GridCellEvent,
  GridCellEvents,
  type GridStyleConfig,
  type LabelData,
  type LineData,
  type PolygonData,
} from './types';
import { validateDefinition } from './validate-definition';
import type { Layer, PickingInfo, UpdateParameters } from '@deck.gl/core';

/**
 * Base class for all grid layers.
 *
 * Handles zoom-range filtering, per-type styling, label visibility, and
 * hover/click event emission via the `@accelint/bus` broadcast channel.
 * Extend this class to implement a concrete grid system by providing a
 * `GridDefinition` with a renderer.
 *
 * @throws {Error} When `props.definition` fails validation (see `validateDefinition`)
 *
 * @example
 * ```typescript
 * const layer = new BaseGridLayer({
 *   id: 'gars-grid',
 *   definition: garsDefinition,
 *   showLabels: true,
 *   enableEvents: true,
 *   mapId: 'main-map',
 * });
 * ```
 */
export class BaseGridLayer extends CompositeLayer<BaseGridLayerProps> {
  static override layerName = 'BaseGridLayer';

  private eventBus = Broadcast.getInstance<GridCellEvent>();

  constructor(props: BaseGridLayerProps) {
    validateDefinition(props.definition);
    super(props);
  }

  /**
   * Type-safe accessor for hovered cell state
   */
  private getHoveredCell(): string {
    const state = this.state as { hoveredCell?: string } | undefined;
    return state?.hoveredCell ?? '';
  }

  /**
   * Determines fill color for a grid cell based on selection/hover state
   */
  private getCellFillColor(
    cellId: string,
    hoveredCell: string | undefined,
    selectedCell: string | undefined,
    hoverColor: Color | undefined,
    selectedColor: Color | undefined,
  ): Color {
    if (selectedColor && cellId === selectedCell) {
      return selectedColor;
    }
    if (hoverColor && cellId === hoveredCell) {
      return hoverColor;
    }
    return [0, 0, 0, 0]; // Transparent
  }

  /**
   * Determines whether the layer should re-render based on change flags.
   *
   * Triggers updates when viewport changes (zoom/pan), internal state changes
   * (hover state), or props change (style overrides, definition changes).
   *
   * @param params - Update parameters from deck.gl containing change flags
   * @returns True if the layer should re-render, false otherwise
   */
  override shouldUpdateState(params: UpdateParameters<this>): boolean {
    return (
      params.changeFlags.viewportChanged ||
      params.changeFlags.stateChanged ||
      Boolean(params.changeFlags.propsChanged)
    );
  }

  /**
   * Handles picking events (hover and click) from deck.gl's event system.
   *
   * Processes hover and click events when interactivity is enabled, emitting events
   * via the event bus. Returns early if `enableInteractivity` prop is false.
   *
   * @param params - Picking parameters from deck.gl
   * @param params.info - Picking information including picked object and coordinates
   * @param params.mode - Event mode ('hover', 'query', or undefined for clicks)
   * @returns The original picking info, unchanged
   */
  override getPickingInfo({
    info,
    mode,
  }: {
    info: PickingInfo;
    mode?: string;
  }): PickingInfo {
    if (!this.props.enableInteractivity) {
      return info;
    }

    if (mode === 'hover') {
      this.handleHover(info);
    }

    // Handle click events - deck.gl doesn't pass mode for clicks, check for it explicitly
    if (mode === 'query' || (info.picked && !mode)) {
      this.handleClick(info);
    }

    return info;
  }

  /**
   * Returns deck.gl layers for all zoom ranges visible at the current viewport zoom.
   * Returns an empty array when the viewport is unavailable or bounds cannot be computed.
   *
   * Generates PathLayer, PolygonLayer, and TextLayer instances based on grid definition
   * and current zoom level. Applies style overrides, handles interactivity, and manages
   * hover/selection highlighting.
   *
   * @returns Array of deck.gl Layer instances (PathLayer, PolygonLayer, TextLayer) configured
   *   for rendering grid lines, cell polygons, and labels. Returns empty array when viewport
   *   is unavailable or bounds calculation fails.
   *
   * @example
   * ```typescript
   * // Called automatically by deck.gl during render cycle
   * const layers = layer.renderLayers();
   * ```
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: complexity increased from 15 to 16 by adding labelMaxZoom check, which is unavoidable
  override renderLayers(): Layer[] {
    const {
      definition,
      styleOverrides,
      showLabels = true,
      enableInteractivity = false,
      zoomRanges: customZoomRanges,
      selectedCell,
    } = this.props;
    const viewport = this.context.viewport;
    if (!viewport) {
      return [];
    }

    const pickable = enableInteractivity !== false;
    const zoom = viewport.zoom;
    const bounds = getViewportBounds(viewport);

    const layers: Layer[] = [];

    // TODO: memoize the grid layers based on the current zoom so that we don't have to continually recalculate
    const zoomRanges = customZoomRanges || definition.zoomRanges;
    const hoveredCell = this.getHoveredCell();

    for (const range of zoomRanges) {
      // Check if this grid type is visible at current zoom (inclusive range)
      if (zoom < range.minZoom || zoom > range.maxZoom) {
        continue;
      }

      const style = this.getStyle(range.type, styleOverrides);

      const { lines, labels, polygons } = definition.renderer.render({
        bounds,
        zoom,
        gridType: range.type,
      });

      // Add polygon layer for cell-wide interaction and hover/select highlighting
      if (pickable && polygons.length > 0) {
        const hoverColor = style.hoverColor;
        const selectedColor = style.selectedColor;

        const fillColorTriggers = [
          hoveredCell,
          selectedCell,
          hoverColor,
          selectedColor,
        ];

        layers.push(
          new PolygonLayer<PolygonData>({
            id: `${this.id}-polygons-${range.key}`,
            data: polygons,
            getPolygon: (d) => d.polygon,
            getFillColor: (d) =>
              this.getCellFillColor(
                d.cellId,
                hoveredCell,
                selectedCell,
                hoverColor,
                selectedColor,
              ),
            getLineColor: [0, 0, 0, 0],
            pickable: true,
            wrapLongitude: definition.options?.wrapLongitude ?? false,
            updateTriggers: {
              getFillColor: fillColorTriggers,
            },
          }),
        );
      }

      // Create TextLayer for labels if enabled and zoom is within label range
      const labelMinZoom = range.labelMinZoom ?? range.minZoom;
      const labelMaxZoom = range.labelMaxZoom ?? range.maxZoom;
      if (showLabels && zoom >= labelMinZoom && zoom <= labelMaxZoom) {
        layers.push(
          new TextLayer<LabelData>({
            id: `${this.id}-labels-${range.key}`,
            data: labels,
            getText: (d) => d.text,
            getPosition: (d) => d.position,
            getColor: style.labelColor,
            getSize: style.labelSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            getTextAnchor: style.textAnchor,
            getAlignmentBaseline: style.alignmentBaseline,
            background: !!style.backgroundColor,
            getBackgroundColor: style.backgroundColor,
            backgroundPadding: style.backgroundPadding,
            pickable: false,
            updateTriggers: {
              getColor: style.labelColor,
              getSize: style.labelSize,
              getBackgroundColor: style.backgroundColor,
              backgroundPadding: style.backgroundPadding,
            },
          }),
        );
      }

      layers.push(
        new PathLayer<LineData>({
          id: `${this.id}-lines-${range.key}`,
          data: lines,
          getPath: (d) => d.path,
          getColor: style.lineColor,
          getWidth: style.lineWidth,
          widthUnits: 'pixels',
          pickable: false,
          wrapLongitude: definition.options?.wrapLongitude ?? false,
          updateTriggers: {
            getColor: style.lineColor,
            getWidth: style.lineWidth,
          },
        }),
      );
    }

    return layers;
  }

  /**
   * Merges default styles with overrides for a specific grid type
   */
  private getStyle(
    gridType: string,
    styleOverrides?: Record<string, Partial<GridStyleConfig> | undefined>,
  ): GridStyleConfig {
    const defaultStyle = this.props.definition.defaultStyles[gridType];
    const override = styleOverrides?.[gridType];

    if (!defaultStyle) {
      const availableTypes = Object.keys(
        this.props.definition.defaultStyles,
      ).join(', ');
      throw new Error(
        `No default style defined for grid type: '${gridType}'. ` +
          `Available types: ${availableTypes}`,
      );
    }

    if (!override) {
      return defaultStyle;
    }

    return Object.assign({}, defaultStyle, override);
  }

  /**
   * Handles click events on grid cells
   *
   */
  private handleClick = (info: PickingInfo): void => {
    const cellId = info.object?.cellId;

    if (!(info.object && info.coordinate)) {
      return;
    }
    if (cellId) {
      this.eventBus.emit(GridCellEvents.click, {
        cellId,
        gridType: this.props.definition.id,
        coords: [info.coordinate[0], info.coordinate[1]] as [number, number],
        mapId: this.props.mapId ?? 'default',
        bounds: info.object?.bounds,
      });
    }
  };

  /**
   * Handles hover events on grid cells with deduplication
   * Note: No event is emitted when the cursor leaves all cells (cellId becomes undefined).
   * Only cell-to-cell transitions emit events.
   */
  private handleHover = (info: PickingInfo): void => {
    const cellId = info.object?.cellId;
    const lastHoveredCell = this.getHoveredCell();

    // Deduplicate: only emit events when cell changes
    if (cellId === lastHoveredCell) {
      return;
    }

    if (cellId) {
      this.eventBus.emit(GridCellEvents.hover, {
        cellId,
        gridType: this.props.definition.id,
        mapId: this.props.mapId ?? 'default',
        bounds: info.object?.bounds,
      });
    }

    this.setState({ hoveredCell: cellId });
  };
}
