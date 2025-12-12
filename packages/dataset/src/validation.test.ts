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
import { z } from 'zod';
import { validateDatasetConfig, validateSchema } from './validation';
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

// == Positive space

describe('validateDatasetConfig - Service/Data Type Combinations', () => {
  it.each([
    ['GEOJSON', 'VTS'],
    ['GEOJSON', 'WMS'],
    ['GEOJSON', 'WFS'],
    ['GEOJSON', 'FS'],
    ['ARROW', 'VTS'],
    ['ARROW', 'WMS'],
    ['ARROW', 'FS'],
    ['Unknown', 'Unknown'],
  ] as const)('should validate %s/%s combination', (dataType, serviceType) => {
    const ds = genericDatasetConfig(dataType, serviceType);

    expect(() => validateDatasetConfig(ds)).not.toThrow();
  });
});

describe('validateDatasetConfig - Optional Fields', () => {
  it('should validate with minimal required fields', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      metadata: {
        table: 'test',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      },
    };

    expect(() => validateDatasetConfig(ds)).not.toThrow();
  });

  it('should validate with all optional fields present', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      metadata: {
        table: 'test',
        serviceUrls: ['https://example.com'],
        serviceVersion: '1.0.0',
        serviceLayer: 'layer1',
        idProperty: 'id',
        geometryProperty: 'geom',
        minZoom: 0,
        maxZoom: 20,
        positionFormat: 'XYZ' as const,
        maxRequests: 10,
        refetchInterval: 5000,
        defaultFields: ['geom'],
        batchSize: 100,
        filterDialect: 'cql' as const,
      },
    };

    expect(() => validateDatasetConfig(ds)).not.toThrow();
  });
});

describe('validateDatasetConfig - Field Validation', () => {
  it('should validate fields with availableValues', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      fields: [
        {
          id: 'status',
          visible: true,
          nullable: false,
          type: 'str' as const,
          label: 'Status',
          availableValues: [
            { name: 'active', label: 'Active' },
            { name: 'inactive', label: 'Inactive' },
          ],
        },
      ],
    };

    expect(() => validateDatasetConfig(ds)).not.toThrow();
  });

  it('should validate all field types', () => {
    const fieldTypes = [
      'bool',
      'date',
      'datetime',
      'f32',
      'f64',
      'i32',
      'i64',
      'linestring',
      'multilinestring',
      'multipoint',
      'multipolygon',
      'point',
      'polygon',
      'str',
      'time',
    ] as const;

    fieldTypes.forEach((type) => {
      const ds = {
        ...genericDatasetConfig('ARROW', 'WFS'),
        fields: [
          {
            id: `field_${type}`,
            visible: true,
            nullable: true,
            type,
            label: `Test ${type}`,
          },
        ],
      };

      expect(() => validateDatasetConfig(ds)).not.toThrow();
    });
  });
});

// == Negative space

describe('validateDatasetConfig - Version Validation', () => {
  it('should reject invalid version formats', () => {
    const invalidVersions = ['1.0', '1', 'v1.0.0', '1.0.0-beta', '1.0.0.0'];

    invalidVersions.forEach((version) => {
      const ds = {
        ...genericDatasetConfig('ARROW', 'WFS'),
        metadata: {
          ...genericDatasetConfig('ARROW', 'WFS').metadata,
          serviceVersion: version,
        },
      };

      expect(() => validateDatasetConfig(ds)).toThrow(
        'Invalid version: must be x.y.z',
      );
    });
  });
});

describe('validateDatasetConfig - Required Fields', () => {
  it('should reject missing geometryProperty', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      metadata: {
        table: 'test',
        defaultFields: ['field1'],
        // geometryProperty is missing
      },
    };

    expect(() => validateDatasetConfig(ds)).toThrow();
  });
});

describe('validateDatasetConfig - Field Type Validation', () => {
  it('should reject invalid field types', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      fields: [
        {
          id: 'bad',
          visible: true,
          nullable: false,
          type: 'invalid_type', // Not in enum
          label: 'Bad',
        },
      ],
    };

    expect(() => validateDatasetConfig(ds)).toThrow();
  });
});

describe('validateDatasetConfig - Enum Validation', () => {
  it('should reject invalid positionFormat', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      metadata: {
        ...genericDatasetConfig('ARROW', 'WFS').metadata,
        positionFormat: 'XYZW', // Not XY or XYZ
      },
    };

    expect(() => validateDatasetConfig(ds)).toThrow();
  });

  it('should reject invalid filterDialect', () => {
    const ds = {
      ...genericDatasetConfig('ARROW', 'WFS'),
      metadata: {
        ...genericDatasetConfig('ARROW', 'WFS').metadata,
        filterDialect: 'sql', // Not cql or gml
      },
    };

    expect(() => validateDatasetConfig(ds)).toThrow();
  });
});

// == Generic func

describe('validateSchema', () => {
  it('should create a reusable validator', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    const validate = validateSchema(schema);

    const valid = { name: 'Alice', age: 30 };
    expect(validate(valid)).toEqual(valid);
  });

  it('should format multiple validation errors', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email(),
    });
    const validate = validateSchema(schema);

    const invalid = { name: 123, age: 'thirty', email: 'not-an-email' };

    expect(() => validate(invalid)).toThrow('Validation failed:');
    expect(() => validate(invalid)).toThrow('name:');
    expect(() => validate(invalid)).toThrow('age:');
    expect(() => validate(invalid)).toThrow('email:');
  });

  it('should handle nested validation errors', () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string(),
        }),
      }),
    });
    const validate = validateSchema(schema);

    const invalid = { user: { profile: { name: 123 } } };

    expect(() => validate(invalid)).toThrow('user.profile.name:');
  });

  it('should re-throw non-Zod errors', () => {
    const schema = z.string().refine(() => {
      throw new TypeError('Custom error');
    });
    const validate = validateSchema(schema);

    expect(() => validate('test')).toThrow(TypeError);
    expect(() => validate('test')).toThrow('Custom error');
  });
});
