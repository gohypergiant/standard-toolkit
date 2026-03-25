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

import type { Color, CompositeLayerProps } from '@deck.gl/core';
import type { Bounds } from '@ngageoint/grid-js';
import type { Payload } from '@accelint/bus';

/**
 * Grid type identifier for different precision levels
 */
export type GridType = string;
type Coordinate = [longitude: number, latitude: number];

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
  /** Line color in RGBA format [r, g, b, a] or deck.gl color string */
  lineColor: Color;
  /** Line width in pixels */
  lineWidth: number;
  /** Label text color in RGBA format or deck.gl color string */
  labelColor: Color;
  /** Label font size in pixels */
  labelSize: number;
  /** Label font family */
  fontFamily: string;
  /** Label font weight */
  fontWeight: number | string;
  /** Label text anchor */
  textAnchor: 'start' | 'middle' | 'end';
  /** Label alignment baseline */
  alignmentBaseline: 'top' | 'center' | 'bottom';
  /** Label background color in RGBA format or deck.gl color string */
  backgroundColor: Color;
  /** Label background padding in pixels [x, y] */
  backgroundPadding: [number, number];
  /** Fill color applied to a cell polygon when hovered (RGBA format only) */
  hoverColor: Color;
  /** Fill color applied to a cell polygon when selected (RGBA format only) */
  selectedColor: Color;
};

/**
 * Line data for PathLayer
 */
export type LineData = {
  /** Path coordinates [[lng, lat], [lng, lat], ...] */
  path: Coordinate[];
  /** Cell identifier for event handling */
  cellId: string;
};

/**
 * Grid cell bounds
 */
export type CellBounds = {
  /** Minimum longitude (west) */
  minLongitude: number;
  /** Minimum latitude (south) */
  minLatitude: number;
  /** Maximum longitude (east) */
  maxLongitude: number;
  /** Maximum latitude (north) */
  maxLatitude: number;
  /** Polygon coordinates [[lng, lat], ...] forming a closed ring */
  polygon: Coordinate[];
};

/**
 * Label data for TextLayer
 */
export type LabelData = {
  /** Label text (grid cell identifier) */
  text: string;
  /** Label position [lng, lat] */
  position: Coordinate;
  /** Cell identifier for event handling */
  cellId: string;
  /** Cell bounds (optional, for event handling) */
  bounds?: CellBounds;
};

/**
 * Polygon data for PolygonLayer (cell areas)
 */
export type PolygonData = {
  /** Polygon coordinates forming a closed ring */
  polygon: Coordinate[];
  /** Cell identifier for event handling */
  cellId: string;
  /** Cell bounds for event handling */
  bounds: CellBounds;
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
 * Result returned by grid renderers
 */
export type RenderResult = {
  /** Grid line data for PathLayer */
  lines: LineData[];
  /** Grid label data for TextLayer */
  labels: LabelData[];
  /** Grid cell polygon data for PolygonLayer (for cell-wide interaction) */
  polygons: PolygonData[];
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
 * Payload for grid hover enter/exit events.
 */
export type GridHoverPayload = {
  /** Grid cell identifier */
  cellId: string;
  /** Grid system type (e.g., 'mgrs', 'gars') */
  gridType: string;
  /** Map instance identifier */
  mapId: string;
  /** Cell bounds (optional, for highlighting the cell) */
  bounds?: CellBounds;
};

/**
 * Payload for grid click events.
 */
export type GridClickPayload = {
  /** Grid cell identifier */
  cellId: string;
  /** Grid system type (e.g., 'mgrs', 'gars') */
  gridType: string;
  /** Geographic coordinates of the click [longitude, latitude] */
  coords: [number, number];
  /** Map instance identifier */
  mapId: string;
  /** Cell bounds (optional, for highlighting the cell) */
  bounds?: CellBounds;
};

/**
 * Grid layer event type constants.
 * Used with the event bus to emit and listen for grid interactions.
 */
export const GridCellEvents = {
  hover: 'gridCell:hover',
  click: 'gridCell:click',
} as const;

/**
 * Event type for grid cell hover interactions.
 *
 * Combines the hover event identifier with hover payload data for type-safe
 * event handling via the event bus.
 *
 * @see GridCellEvents.hover - Event identifier constant
 * @see GridHoverPayload - Hover event data structure
 */
export type GridCellHoverEvent = Payload<
  typeof GridCellEvents.hover,
  GridHoverPayload
>;
/**
 * Event type for grid cell click interactions.
 *
 * Combines the click event identifier with click payload data for type-safe
 * event handling via the event bus.
 *
 * @see GridCellEvents.click - Event identifier constant
 * @see GridClickPayload - Click event data structure
 */
export type GridCellClickEvent = Payload<
  typeof GridCellEvents.click,
  GridClickPayload
>;

/**
 * Union type for all grid cell interaction events.
 *
 * Use this type when handling any grid cell event (hover or click) without
 * discriminating between event types. For type-specific handling, use
 * GridCellHoverEvent or GridCellClickEvent directly.
 *
 * @see GridCellHoverEvent - Hover-specific event type
 * @see GridCellClickEvent - Click-specific event type
 */
export type GridCellEvent = GridCellHoverEvent | GridCellClickEvent;

/**
 * Base grid layer props
 */
export type BaseGridLayerProps = CompositeLayerProps & {
  /** Map instance identifier for event routing */
  mapId?: string;
  /** Grid definition describing the complete grid system */
  definition: GridDefinition;
  /** Per-type style overrides merged with `definition.defaultStyles` */
  styleOverrides?: Record<string, Partial<GridStyleConfig> | undefined>;
  /** Whether to render label text on grid cells */
  showLabels?: boolean;
  /** Override zoom ranges from the grid definition */
  zoomRanges?: GridZoomRange[];
  /** Whether grid cells respond to hover and click events */
  enableInteractivity?: boolean;
  /** Cell identifier of the currently selected cell, for highlight rendering */
  selectedCell?: string;
};
