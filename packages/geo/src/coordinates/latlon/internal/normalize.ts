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

export type CoordinateTuple = readonly [number, number];

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
