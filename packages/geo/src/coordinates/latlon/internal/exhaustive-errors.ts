// __private-exports
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

import { cartesian } from '@/cartesian';

type Values = {
  invalid: Record<string, string[]>;
  valid: Record<string, string>;
};

const values: Values = {
  invalid: {
    BLAT: ['X', 'random garbage'],
    BLON: ['X', 'random garbage'],
    DLAT: ['91', 'nope'],
    DDLAT: ['90.1', 'nope'],
    DLON: ['181', 'nope'],
    DDLON: ['180.1', 'nope'],
    M: ['-1', '61', 'nope'],
    MM: ['-0.1', '60.1', 'nope'],
    SS: ['-0.1', '60.1', 'nope'],
  },
  valid: {
    '/': '/',
    BLAT: 'N',
    BLON: 'E',
    DLAT: '89',
    DDLAT: '89.999999999',
    DLON: '179',
    DDLON: '179.999999999',
    M: '59',
    MM: '59.999999999',
    SS: '59.999999999',
  },
};

const systems = [
  {
    designation: 'DD',
    LAT: ['DDLAT', 'BLAT DDLAT', 'DDLAT BLAT'],
    LON: ['DDLON', 'BLON DDLON', 'DDLON BLON'],
  },
  {
    designation: 'DDM',
    LAT: ['DLAT MM', 'BLAT DLAT MM', 'DLAT MM BLAT'],
    LON: ['DLON MM', 'BLON DLON MM', 'DLON MM BLON'],
  },
  {
    designation: 'DMS',
    LAT: ['DLAT M SS', 'BLAT DLAT M SS', 'DLAT M SS BLAT'],
    LON: ['DLON M SS', 'BLON DLON M SS', 'DLON M SS BLON'],
  },
];

/**
 * A collection of input strings each with exactly one error in a unique
 * position for each format (LATLON and LONLAT) in each system (DD, DDM, DMS).
 */
export const EXHAUSTIVE_ERRORS = Object.fromEntries(
  systems.map(({ designation, ...system }) => {
    // for both format options
    const options = ['LAT LON', 'LON LAT'].map((format) => [
      // create object key: 'LATLON' or 'LONLAT'
      format.replace(' ', ''),

      // cross-join each variation of LAT with each variation of LON in the system
      cartesian(
        ...format.split(' ').map((key) => system[key as keyof typeof system]),
      )
        // input not including this isn't an error so no need for variation
        .map((pair) => pair.join(' / '))
        // fill the generated template with actual values
        .flatMap((t) => fillTemplate(t, values)),
    ]);

    return [designation, Object.fromEntries(options)];
  }),
);

function fillTemplate(template: string, values: Values) {
  return template
    .split(' ')
    .flatMap((key, i, original) => {
      if (!values.invalid[key]) {
        return '';
      }

      return (values.invalid[key] as string[]).map((opt) =>
        [...original.slice(0, i), opt, ...original.slice(i + 1)]
          .map((token) => (token in values.valid ? values.valid[token] : token))
          .join(' '),
      );
    })
    .filter(Boolean);
}
