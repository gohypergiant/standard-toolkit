/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import MGRS from 'geographiclib-mgrs';
import { createCoordinate } from './src/create-coordinate.js';

const testMGRS = '33VVE7220287839';

console.log('Testing MGRS:', testMGRS);
console.log('');

// geographiclib result
const glResult = MGRS.toPoint(testMGRS);
console.log('geographiclib result:');
console.log('  lon:', glResult[0]);
console.log('  lat:', glResult[1]);
console.log('');

// Our implementation - let's trace through the steps
const mgrs = createCoordinate('mgrs', testMGRS);
console.log('Our MGRS parse:');
console.log('  zoneNumber:', mgrs.zoneNumber);
console.log('  zoneLetter:', mgrs.zoneLetter);
console.log('  gridCol:', mgrs.gridCol);
console.log('  gridRow:', mgrs.gridRow);
console.log('  easting:', mgrs.easting);
console.log('  northing:', mgrs.northing);
console.log('  precision:', mgrs.precision);
console.log('');

const utm = mgrs.toUTM();
console.log('Our UTM result:');
console.log('  zoneNumber:', utm.zoneNumber);
console.log('  hemisphere:', utm.hemisphere);
console.log('  easting:', utm.easting);
console.log('  northing:', utm.northing);
console.log('');

const wgs = mgrs.toWGS();
console.log('Our WGS result:');
console.log('  lon:', wgs.lon);
console.log('  lat:', wgs.lat);
console.log('');

console.log('Differences:');
console.log('  lat diff:', Math.abs(wgs.lat - glResult[1]), 'degrees');
console.log(
  '  lat diff:',
  Math.abs(wgs.lat - glResult[1]) * 111000,
  'meters (approx)',
);
console.log('  lon diff:', Math.abs(wgs.lon - glResult[0]), 'degrees');
console.log(
  '  lon diff:',
  Math.abs(wgs.lon - glResult[0]) *
    111000 *
    Math.cos((wgs.lat * Math.PI) / 180),
  'meters (approx)',
);
