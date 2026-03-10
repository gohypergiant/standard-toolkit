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

import { CompositeLayer } from '@deck.gl/core';
import { PathLayer, TextLayer } from '@deck.gl/layers';
import type { Layer, PickingInfo, UpdateParameters } from '@deck.gl/core';
import { Broadcast } from '@accelint/bus';

import type {
  BaseGridLayerProps,
  GridEvent,
  GridStyleConfig,
  LabelData,
  LineData,
} from './types';
import { validateDefinition } from './validate-definition';
import { getViewportBounds } from '../shared/viewport-utils';

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

  private eventBus = Broadcast.getInstance<GridEvent>();
  private lastHoveredCell: string | undefined = undefined;

  constructor(props: BaseGridLayerProps) {
    validateDefinition(props.definition);
    super(props);
  }

  override initializeState(): void {
    // State initialization (validation already done in constructor)
  }

  override shouldUpdateState(params: UpdateParameters<this>): boolean {
    // Update if props changed or viewport changed
    return (
      params.changeFlags.propsChanged ||
      params.changeFlags.viewportChanged ||
      params.changeFlags.stateChanged
    );
  }

  /**
   * Returns deck.gl layers for all zoom ranges visible at the current viewport zoom.
   * Returns an empty array when the viewport is unavailable or bounds cannot be computed.
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Orchestration logic is necessarily complex
  override renderLayers(): Layer[] {
    const { definition, styleOverrides, showLabels, enableEvents } = this.props;
    const viewport = this.context.viewport;
    if (!viewport) {
      return [];
    }

    const zoom = viewport.zoom;
    const bounds = getViewportBounds(viewport);
    if (!bounds) {
      return [];
    }

    const layers: Layer[] = [];

    // Use custom zoom ranges if provided, otherwise use definition defaults
    const zoomRanges = this.props.zoomRanges || definition.zoomRanges;

    // Loop over zoom ranges and render visible grids
    for (const range of zoomRanges) {
      // Check if this grid type is visible at current zoom
      if (zoom < range.minZoom || zoom > range.maxZoom) {
        continue;
      }

      const style = this.getStyle(range.type, styleOverrides);

      const { lines, labels } = definition.renderer.render({
        bounds,
        zoom,
        gridType: range.type,
      });

      const pickable = enableEvents !== false;

      layers.push(
        new PathLayer<LineData>({
          id: `${this.id}-lines-${range.key}`,
          data: lines,
          getPath: (d) => d.path,
          getColor: style.lineColor as [number, number, number, number],
          getWidth: style.lineWidth,
          widthUnits: 'pixels',
          pickable,
          onClick: pickable ? this.handleClick : undefined,
          onHover: pickable ? this.handleHover : undefined,
          wrapLongitude: definition.options?.wrapLongitude ?? false,
          updateTriggers: {
            getColor: style.lineColor,
            getWidth: style.lineWidth,
          },
        }),
      );

      // Create TextLayer for labels if enabled and zoom is sufficient
      const labelMinZoom = range.labelMinZoom ?? range.minZoom;
      if (showLabels && zoom >= labelMinZoom) {
        layers.push(
          new TextLayer<LabelData>({
            id: `${this.id}-labels-${range.key}`,
            data: labels,
            getText: (d) => d.text,
            getPosition: (d) => d.position,
            getColor: (style.labelColor as [
              number,
              number,
              number,
              number,
            ]) ?? [255, 255, 255, 255],
            getSize: style.labelSize ?? 12,
            fontFamily: style.fontFamily ?? 'Monaco, monospace',
            fontWeight: style.fontWeight ?? 'normal',
            getTextAnchor: style.textAnchor ?? 'middle',
            getAlignmentBaseline: style.alignmentBaseline ?? 'center',
            background: !!style.backgroundColor,
            getBackgroundColor: (style.backgroundColor as [
              number,
              number,
              number,
              number,
            ]) ?? [40, 40, 40, 180],
            backgroundPadding:
              style.backgroundPadding !== undefined
                ? [style.backgroundPadding, style.backgroundPadding]
                : [4, 4],
            pickable,
            updateTriggers: {
              getColor: style.labelColor,
              getSize: style.labelSize,
              getBackgroundColor: style.backgroundColor,
              backgroundPadding: style.backgroundPadding,
            },
          }),
        );
      }
    }

    return layers;
  }

  /**
   * Merges default styles with overrides for a specific grid type
   */
  private getStyle(
    gridType: string,
    styleOverrides?: Record<string, Partial<GridStyleConfig>>,
  ): GridStyleConfig {
    const defaultStyle = this.props.definition.defaultStyles[gridType];
    const override = styleOverrides?.[gridType];

    if (!override) {
      return defaultStyle;
    }

    // Merge default with override
    return {
      ...defaultStyle,
      ...override,
    };
  }

  /**
   * Handles click events on grid cells
   */
  private handleClick = (info: PickingInfo): void => {
    if (!(info.object && info.coordinate)) {
      return;
    }

    this.eventBus.emit({
      type: 'grid.click',
      cellId: info.object.cellId,
      gridType: this.props.definition.id,
      coords: [info.coordinate[0], info.coordinate[1]],
      mapId: this.props.mapId ?? 'default',
    });
  };

  /**
   * Handles hover events on grid cells with deduplication
   */
  private handleHover = (info: PickingInfo): void => {
    const cellId = info.object?.cellId;

    // Deduplicate: only emit events when cell changes
    if (cellId === this.lastHoveredCell) {
      return;
    }

    // Emit exit event for previous cell
    if (this.lastHoveredCell) {
      this.eventBus.emit({
        type: 'grid.hover.exit',
        cellId: this.lastHoveredCell,
        gridType: this.props.definition.id,
        mapId: this.props.mapId ?? 'default',
      });
    }

    // Emit enter event for new cell
    if (cellId) {
      this.eventBus.emit({
        type: 'grid.hover.enter',
        cellId,
        gridType: this.props.definition.id,
        mapId: this.props.mapId ?? 'default',
      });
    }

    this.lastHoveredCell = cellId;
  };
}
