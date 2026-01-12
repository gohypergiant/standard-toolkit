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

import type { coordinateSystems } from '@accelint/geo';

/**
 * Supported coordinate format types for displaying map coordinates.
 *
 * @typedef {'dd' | 'ddm' | 'dms' | 'mgrs' | 'utm'} CoordinateFormatTypes
 * @property dd - Decimal Degrees (e.g., "45.500000° N, 30.250000° E")
 * @property ddm - Degrees Decimal Minutes (e.g., "45° 30.0000' N, 30° 15.0000' E")
 * @property dms - Degrees Minutes Seconds (e.g., "45° 30' 0.00" N, 30° 15' 0.00" E")
 * @property mgrs - Military Grid Reference System (e.g., "31U DQ 48251 11932")
 * @property utm - Universal Transverse Mercator (e.g., "31N 448251 5411932")
 */
export type CoordinateFormatTypes = keyof typeof coordinateSystems;

/**
 * Raw coordinate data returned by the hook.
 * Always in longitude/latitude format, matching the order from map hover events.
 *
 * Returns `null` when cursor is not over the map or coordinates are invalid.
 */
export type RawCoordinate = {
  /** Longitude value in degrees (-180 to 180, normalized) */
  longitude: number;
  /** Latitude value in degrees (-90 to 90) */
  latitude: number;
} | null;

/**
 * Custom formatter function signature.
 * Receives the raw coordinate data and returns a formatted string.
 *
 * @example
 * ```typescript
 * const customFormatter: CoordinateFormatter = (coord) =>
 *   `Lat: ${coord.latitude.toFixed(6)}° Lng: ${coord.longitude.toFixed(6)}°`;
 * ```
 */
export type CoordinateFormatter = (
  coordinate: NonNullable<RawCoordinate>,
) => string;

/**
 * Options for configuring cursor coordinate behavior.
 */
export type UseCursorCoordinatesOptions = {
  /**
   * Custom formatter function. When provided, this takes precedence
   * over the built-in format for the `formattedCoord` return value.
   *
   * The `setFormat` function still works and affects `currentFormat`,
   * but won't affect `formattedCoord` when a custom formatter is active.
   */
  formatter?: CoordinateFormatter;
};

/**
 * Return type for useCursorCoordinates hook.
 */
export type UseCursorCoordinatesReturn = {
  /** Formatted coordinate string using current format or custom formatter */
  formattedCoord: string;
  /** Function to change the coordinate format system */
  setFormat: (format: CoordinateFormatTypes) => void;
  /** Raw coordinate data (always available when cursor is over map) */
  rawCoord: RawCoordinate;
  /** Current active format type */
  currentFormat: CoordinateFormatTypes;
};

/**
 * Internal state stored for each map instance's cursor coordinates.
 */
export type CursorCoordinateState = {
  /** Raw coordinate tuple [longitude, latitude] or null */
  coordinate: [number, number] | null;
  /** Current format type */
  format: CoordinateFormatTypes;
};
