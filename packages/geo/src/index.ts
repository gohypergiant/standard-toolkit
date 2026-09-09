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

/**
 * THIS IS A GENERATED FILE. DO NOT ALTER DIRECTLY.
 */

// biome-ignore-all assist/source/organizeImports: This comment is used to prevent the biome tool from altering the import statements in this file.

export { coordinateSystems, createCoordinate } from './coordinates/coordinate';
export {
  DECIMAL_DEGREES_PRECISION,
  formatDecimalDegrees,
  toDecimalDegreesParts,
} from './coordinates/latlon/decimal-degrees/formatter';
export type { DecimalDegreesParts } from './coordinates/latlon/decimal-degrees/formatter';
export { parseDecimalDegrees } from './coordinates/latlon/decimal-degrees/parser';
export {
  DDM_PRECISION,
  formatDegreesDecimalMinutes,
  toDdmParts,
} from './coordinates/latlon/degrees-decimal-minutes/formatter';
export type { DdmParts } from './coordinates/latlon/degrees-decimal-minutes/formatter';
export { parseDegreesDecimalMinutes } from './coordinates/latlon/degrees-decimal-minutes/parser';
export {
  DMS_PRECISION,
  formatDegreesMinutesSeconds,
  toDmsParts,
} from './coordinates/latlon/degrees-minutes-seconds/formatter';
export type { DmsParts } from './coordinates/latlon/degrees-minutes-seconds/formatter';
export { parseDegreesMinutesSeconds } from './coordinates/latlon/degrees-minutes-seconds/parser';
export {
  createFormatter,
  formatCoordinateSystem,
} from './coordinates/latlon/internal/format';
export type { FormatOptions } from './coordinates/latlon/internal/format';
export {
  isCoordinateObject,
  isCoordinateTuple,
  normalizeObjectToLatLon,
  tupleToLatLon,
} from './coordinates/latlon/internal/normalize';
export type {
  CoordinateInput,
  CoordinateInternalValue,
  CoordinateObject,
  CoordinateTuple,
  LatLonTuple,
  LonLatTuple,
} from './coordinates/latlon/internal/normalize';
export {
  getHemisphere,
  getOrdinal,
} from './coordinates/latlon/internal/ordinal';
export type { Axis, Hemisphere } from './coordinates/latlon/internal/ordinal';
export {
  isFiniteNumber,
  isValidNumericCoordinate,
  validateNumericCoordinate,
  validateSignedRange,
} from './coordinates/latlon/internal/validate';
export { parseMGRS } from './coordinates/mgrs/parser';
export { formatMgrsParts, toMgrsParts } from './coordinates/mgrs/parts';
export type { MgrsParts } from './coordinates/mgrs/parts';
export { parseUTM } from './coordinates/utm/parser';
export {
  GRID_LATITUDE_MAX,
  GRID_LATITUDE_MIN,
  formatUtmParts,
  isGridProjectable,
  isOnEasternAntimeridian,
  isWithinGridBand,
  toUtmParts,
} from './coordinates/utm/parts';
export type { GridPartsResult, UtmParts } from './coordinates/utm/parts';
