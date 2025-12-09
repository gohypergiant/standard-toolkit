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

import { describe, expect, it } from 'vitest';
import { validateDatasetConfig } from './validation';
import type {
  LayerDataset,
  LayerDataType,
  LayerServiceType,
} from './types/datasets';

const genericDatasetConfig = <
  T extends LayerDataType,
  S extends LayerServiceType,
>(
  t: T,
  s: S,
): LayerDataset<T, S> => ({
  id: 'this-test-id',
  level: 'generated',
  visible: true,
  mutatable: false,
  name: 'Unit test',
  description: 'Testing',
  serviceType: s,
  dataType: t,
  presentationTypes: { geometry: ['point', 'icon'] },
  fields: [],
  metadata: {
    table: 'unittest',
    positionFormat: 'XY',
    maxRequests: -1,
    geometryProperty: 'geometry',
    defaultFields: ['geometry'],
    filterDialect: 'cql',
  },
});

describe('validateDatasetConfig', () => {
  it('should return a valid dataset config', () => {
    const ds = genericDatasetConfig('ARROW', 'WFS');
    const actual = validateDatasetConfig(ds);

    expect(actual).toStrictEqual(ds);
  });

  it('should throw for an invalid dataset config', () => {
    // @ts-expect-error Intentional wrong for testing
    const ds = genericDatasetConfig('UNIT', 'TEST');

    expect(() => validateDatasetConfig(ds)).toThrow();
    expect(() => validateDatasetConfig(ds)).toThrow(`Validation failed:
serviceType: Invalid option: expected one of "VTS"|"WMS"|"WFS"|"FS"|"Unknown"
dataType: Invalid option: expected one of "GEOJSON"|"ARROW"|"Unknown"`);
  });
});
