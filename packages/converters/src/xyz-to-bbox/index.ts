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

/**
 * @module: converters
 */

/**
 * @see: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 */

/** [z, x, y] */
export type XyzTuple = [number, number, number];

/** [left, bottom, right, top] */
export type BoundingBoxTuple = [number, number, number, number];

const r2d = 180 / Math.PI;
const pi2 = 2 * Math.PI;

function tileToLon(x: number, z: number) {
  return (x / 2 ** z) * 360 - 180;
}

function tileToLat(y: number, z: number) {
  const n = Math.PI - (pi2 * y) / 2 ** z;

  return r2d * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/**
 * Converts a Tile (x, y, z) to a Bounding Box (west, south, east, north).
 *
 * @remarks
 * pure function
 *
 * @example
 * xyzToBbox([71, 96, 8]);
 * // [-80.15625, 39.909736234537185, -78.75, 40.97989806962013]
 */
export const xyzToBbox = (tile: XyzTuple): BoundingBoxTuple => {
  const [x, y, z] = tile;

  const w = tileToLon(x, z);
  const s = tileToLat(y + 1, z);
  const e = tileToLon(x + 1, z);
  const n = tileToLat(y, z);

  return [w, s, e, n];
};
