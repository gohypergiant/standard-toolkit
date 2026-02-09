/*
 * Copyright 2024 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

type Format = 'LATLON' | 'LONLAT';

// biome-ignore lint/style/useNamingConvention: consistency with Axes type
export type CoordinateInternalValue = { LAT: number; LON: number };

/** Tuple in `[latitude, longitude]` order. */
export type LatLonTuple = readonly [latitude: number, longitude: number];

/** Tuple in `[longitude, latitude]` order (GeoJSON convention). */
export type LonLatTuple = readonly [longitude: number, latitude: number];

/** A coordinate tuple in either lat/lon or lon/lat order. */
export type CoordinateTuple = LatLonTuple | LonLatTuple;

/**
 * Object representation of a coordinate with explicit lat/lon keys.
 * Accepts objects with case-insensitive variations: lat/LAT/latitude/LATITUDE and lon/LON/longitude/LONGITUDE.
 * Runtime validation via `isCoordinateObject` ensures proper keys are present.
 *
 * @example
 * ```typescript
 * { lat: 40.7128, lon: -74.0060 }
 * { latitude: 40.7128, longitude: -74.0060 }
 * { LAT: 40.7128, LON: -74.0060 }
 * ```
 */
export type CoordinateObject = Record<string, number>;

export type CoordinateInput = string | CoordinateTuple | CoordinateObject;

const LAT_KEYS = ['lat', 'latitude'];
const LON_KEYS = ['lon', 'longitude'];

export function isCoordinateTuple(
  input: CoordinateInput,
): input is CoordinateTuple {
  return (
    Array.isArray(input) &&
    input.length === 2 &&
    typeof input[0] === 'number' &&
    typeof input[1] === 'number'
  );
}

export function isCoordinateObject(
  input: CoordinateInput,
): input is CoordinateObject {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return false;
  }
  const keys = Object.keys(input).map((k) => k.toLowerCase());
  const hasLat = LAT_KEYS.some((k) => keys.includes(k));
  const hasLon = LON_KEYS.some((k) => keys.includes(k));
  return hasLat && hasLon;
}

/**
 * Normalizes a coordinate object to a consistent lat/lon format.
 *
 * Accepts coordinate objects with case-insensitive key variations (lat/LAT/latitude/LATITUDE
 * and lon/LON/longitude/LONGITUDE) and returns a normalized object with lowercase 'lat' and 'lon' keys.
 * Returns null if required keys are not found.
 *
 * @param obj - Coordinate object with lat/lon keys (case-insensitive)
 * @returns Normalized object with lat and lon keys, or null if invalid
 *
 * @example
 * ```typescript
 * normalizeObjectToLatLon({ lat: 40.7128, lon: -74.0060 });
 * // => { lat: 40.7128, lon: -74.0060 }
 * ```
 *
 * @example
 * ```typescript
 * normalizeObjectToLatLon({ LATITUDE: 40.7128, LONGITUDE: -74.0060 });
 * // => { lat: 40.7128, lon: -74.0060 }
 * ```
 *
 * @example
 * ```typescript
 * normalizeObjectToLatLon({ x: 10, y: 20 });
 * // => null (missing required keys)
 * ```
 */
export function normalizeObjectToLatLon(obj: CoordinateObject): {
  lat: number;
  lon: number;
} | null {
  const normalized: Record<string, number> = {};
  for (const [key, value] of Object.entries(obj)) {
    normalized[key.toLowerCase()] = value;
  }

  const latKey = LAT_KEYS.find((k) => k in normalized);
  const lonKey = LON_KEYS.find((k) => k in normalized);

  if (!(latKey && lonKey)) {
    return null;
  }

  const lat = normalized[latKey];
  const lon = normalized[lonKey];

  if (lat === undefined || lon === undefined) {
    return null;
  }

  return { lat, lon };
}

export function tupleToLatLon(
  format: Format,
  tuple: CoordinateTuple,
): { lat: number; lon: number } {
  // LATLON = [lat, lon], LONLAT = [lon, lat]
  if (format === 'LATLON') {
    return { lat: tuple[0], lon: tuple[1] };
  }
  return { lat: tuple[1], lon: tuple[0] };
}
