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

import type { CompositeLayerProps } from '@deck.gl/core';
import type { Bounds } from '@ngageoint/grid-js';

/**
 * Grid type identifier for different precision levels
 */
export type GridType = string;

/**
 * Zoom range configuration for a specific grid type
 */
export type GridZoomRange = {
  /** Grid type identifier (e.g., 'THIRTY_MINUTE', 'GZD') */
  type: GridType;
  /** Unique key for layer ID generation */
  key: string;
  /** Minimum zoom level for grid visibility */
  minZoom: number;
  /** Maximum zoom level for grid visibility */
  maxZoom: number;
  /** Optional minimum zoom for label visibility (defaults to minZoom) */
  labelMinZoom?: number;
};

/**
 * Style configuration for grid rendering
 */
export type GridStyleConfig = {
  /** Colors in any deck.gl-supported format */
  lineColor: number[] | string;
  /** Line width in pixels */
  lineWidth: number;
  /** Label text color */
  labelColor?: number[] | string;
  /** Label font size in pixels */
  labelSize?: number;
  /** Label font family */
  fontFamily?: string;
  /** Label font weight */
  fontWeight?: number | string;
  /** Label text anchor */
  textAnchor?: 'start' | 'middle' | 'end';
  /** Label alignment baseline */
  alignmentBaseline?: 'top' | 'center' | 'bottom';
  /** Label background color */
  backgroundColor?: number[] | string;
  /** Label background padding in pixels */
  backgroundPadding?: number;
};

/**
 * Context provided to grid renderers
 */
export type RenderContext = {
  /** Geographic bounds of the current viewport */
  bounds: Bounds;
  /** Current map zoom level */
  zoom: number;
  /** Grid type identifier being rendered */
  gridType: GridType;
};

/**
 * Line data for PathLayer
 */
export type LineData = {
  /** Path coordinates [[lng, lat], [lng, lat], ...] */
  path: number[][];
  /** Cell identifier for event handling */
  cellId: string;
};

/**
 * Label data for TextLayer
 */
export type LabelData = {
  /** Label text (grid cell identifier) */
  text: string;
  /** Label position [lng, lat] */
  position: [number, number];
  /** Cell identifier for event handling */
  cellId: string;
};

/**
 * Result returned by grid renderers
 */
export type RenderResult = {
  /** Grid line data for PathLayer */
  lines: LineData[];
  /** Grid label data for TextLayer */
  labels: LabelData[];
};

/**
 * Grid renderer interface
 */
export type GridRenderer = {
  /** Render grid geometry for the given context */
  render(context: RenderContext): RenderResult;
};

/**
 * Grid definition describing a complete grid system
 */
export type GridDefinition = {
  /** Unique identifier for this grid system */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Zoom level ranges controlling grid visibility by type */
  zoomRanges: GridZoomRange[];
  /** Default style configuration keyed by grid type */
  defaultStyles: Record<GridType, GridStyleConfig>;
  /** Renderer responsible for producing grid geometry */
  renderer: GridRenderer;
  /** Optional grid-specific options */
  options?: {
    /** Enable longitude wrapping for antimeridian */
    wrapLongitude?: boolean;
    /** Whether grid requires zone-based rendering */
    requiresZones?: boolean;
  };
};

/**
 * Grid event types
 */
export type GridEvent =
  | {
      type: 'grid.hover.enter';
      cellId: string;
      gridType: string;
      mapId: string;
    }
  | {
      type: 'grid.hover.exit';
      cellId: string;
      gridType: string;
      mapId: string;
    }
  | {
      type: 'grid.click';
      cellId: string;
      gridType: string;
      coords: [number, number];
      mapId: string;
    }
  | {
      type: 'grid.selected';
      cellId: string;
      gridType: string;
      mapId: string;
    }
  | {
      type: 'grid.deselected';
      cellId: string;
      gridType: string;
      mapId: string;
    };

/**
 * Base grid layer props
 */
export type BaseGridLayerProps = CompositeLayerProps & {
  /** Grid definition describing the complete grid system */
  definition: GridDefinition;
  /** Per-type style overrides merged with `definition.defaultStyles` */
  styleOverrides?: Record<string, Partial<GridStyleConfig> | undefined>;
  /** Whether to render label text on grid cells */
  showLabels?: boolean;
  /** Override zoom ranges from the grid definition */
  zoomRanges?: GridZoomRange[];
  /** Whether grid cells respond to hover and click events */
  enableEvents?: boolean;
  /** Map instance identifier for event routing */
  mapId?: string;
};
