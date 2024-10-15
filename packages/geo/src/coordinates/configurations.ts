// __private-exports

import { DD_LAT, DD_LON, SEPARATORS, DMS_LAT, DMS_LON } from './regex';

/**
 * NOTE: these pairs are setup to support different lon/lat ordering
 * 0 = latitude first, 1 = longitude first
 */

export const dd = [
  new RegExp(DD_LAT + SEPARATORS + DD_LON, 'i'),
  new RegExp(DD_LON + SEPARATORS + DD_LAT, 'i'),
] as const;

export const dms = [
  new RegExp(DMS_LAT + SEPARATORS + DMS_LON, 'i'),
  new RegExp(DMS_LON + SEPARATORS + DMS_LAT, 'i'),
] as const;
