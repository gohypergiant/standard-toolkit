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
import {
  datasetBatchSize,
  datasetDataType,
  datasetDefaultFields,
  datasetDescription,
  datasetFields,
  datasetFilterDialect,
  datasetGeometryProperty,
  datasetId,
  datasetIdProperty,
  datasetLevel,
  datasetMaxRequests,
  datasetMaxZoom,
  datasetMetaData,
  datasetMinZoom,
  datasetMutatable,
  datasetName,
  datasetPositionFormat,
  datasetPresentationTypes,
  datasetRefetchInterval,
  datasetServiceLayer,
  datasetServiceType,
  datasetServiceUrls,
  datasetServiceVersion,
  datasetTable,
  datasetVisible,
  metaDataBatchSize,
  metaDataDefaultFields,
  metaDataFilterDialect,
  metaDataGeometryProperty,
  metaDataIdProperty,
  metaDataMaxRequests,
  metaDataMaxZoom,
  metaDataMinZoom,
  metaDataPositionFormat,
  metaDataRefetchInterval,
  metaDataServiceLayer,
  metaDataServiceUrls,
  metaDataServiceVersion,
  metaDataTable,
} from './lenses';
import type {
  AnyDataset,
  LayerDataset,
  LayerDatasetMetadata,
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

const fullDatasetConfig = <T extends LayerDataType, S extends LayerServiceType>(
  t: T,
  s: S,
): LayerDataset<T, S> => ({
  id: 'full-test-id',
  level: 'user',
  visible: false,
  mutatable: true,
  name: 'Full test',
  description: 'Testing all properties',
  serviceType: s,
  dataType: t,
  presentationTypes: {
    temperature: ['point', 'icon'],
    elevation: ['polygon'],
  },
  fields: [
    {
      id: 'temp',
      visible: true,
      nullable: false,
      type: 'f32',
      label: 'Temperature',
    },
  ],
  metadata: {
    table: 'full_test_table',
    serviceUrls: ['https://api.test.com/geoserver', 'https://backup.test.com'],
    serviceVersion: '2.0.0',
    serviceLayer: 'test:layer',
    idProperty: 'feature_id',
    geometryProperty: 'location',
    minZoom: 5,
    maxZoom: 18,
    positionFormat: 'XYZ',
    maxRequests: 6,
    refetchInterval: 300000,
    defaultFields: ['feature_id', 'temp', 'location'],
    batchSize: 25000,
    filterDialect: 'gml',
  },
});

describe('Dataset Root Property Lenses', () => {
  const dataset = genericDatasetConfig('ARROW', 'WFS');

  describe('datasetId', () => {
    it('should extract the dataset id', () => {
      const actual = datasetId(dataset);
      expect(actual).toBe('this-test-id');
    });
  });

  describe('datasetLevel', () => {
    it('should extract the dataset level', () => {
      const actual = datasetLevel(dataset);
      expect(actual).toBe('generated');
    });

    it('should extract user level', () => {
      const userDataset = fullDatasetConfig('GEOJSON', 'WMS');
      const actual = datasetLevel(userDataset);
      expect(actual).toBe('user');
    });
  });

  describe('datasetVisible', () => {
    it('should extract the visibility state', () => {
      const actual = datasetVisible(dataset);
      expect(actual).toBe(true);
    });

    it('should extract false visibility', () => {
      const hiddenDataset = fullDatasetConfig('GEOJSON', 'VTS');
      const actual = datasetVisible(hiddenDataset);
      expect(actual).toBe(false);
    });
  });

  describe('datasetMutatable', () => {
    it('should extract the mutatable flag', () => {
      const actual = datasetMutatable(dataset);
      expect(actual).toBe(false);
    });

    it('should extract true mutatable', () => {
      const mutableDataset = fullDatasetConfig('ARROW', 'FS');
      const actual = datasetMutatable(mutableDataset);
      expect(actual).toBe(true);
    });
  });

  describe('datasetName', () => {
    it('should extract the dataset name', () => {
      const actual = datasetName(dataset);
      expect(actual).toBe('Unit test');
    });
  });

  describe('datasetDescription', () => {
    it('should extract the dataset description', () => {
      const actual = datasetDescription(dataset);
      expect(actual).toBe('Testing');
    });
  });

  describe('datasetServiceType', () => {
    it('should extract the service type', () => {
      const actual = datasetServiceType(dataset);
      expect(actual).toBe('WFS');
    });

    it('should extract different service types', () => {
      const vtsDataset = genericDatasetConfig('GEOJSON', 'VTS');
      expect(datasetServiceType(vtsDataset)).toBe('VTS');

      const wmsDataset = genericDatasetConfig('GEOJSON', 'WMS');
      expect(datasetServiceType(wmsDataset)).toBe('WMS');

      const fsDataset = genericDatasetConfig('ARROW', 'FS');
      expect(datasetServiceType(fsDataset)).toBe('FS');
    });
  });

  describe('datasetDataType', () => {
    it('should extract the data type', () => {
      const actual = datasetDataType(dataset);
      expect(actual).toBe('ARROW');
    });

    it('should extract different data types', () => {
      const geojsonDataset = genericDatasetConfig('GEOJSON', 'WFS');
      expect(datasetDataType(geojsonDataset)).toBe('GEOJSON');

      const unknownDataset = genericDatasetConfig('Unknown', 'Unknown');
      expect(datasetDataType(unknownDataset)).toBe('Unknown');
    });
  });

  describe('datasetPresentationTypes', () => {
    it('should extract presentation types', () => {
      const actual = datasetPresentationTypes(dataset);
      expect(actual).toStrictEqual({ geometry: ['point', 'icon'] });
    });

    it('should extract multiple presentation types', () => {
      const fullDataset = fullDatasetConfig('GEOJSON', 'WFS');
      const actual = datasetPresentationTypes(fullDataset);
      expect(actual).toStrictEqual({
        temperature: ['point', 'icon'],
        elevation: ['polygon'],
      });
    });
  });

  describe('datasetFields', () => {
    it('should extract empty fields array', () => {
      const actual = datasetFields(dataset);
      expect(actual).toStrictEqual([]);
    });

    it('should extract populated fields array', () => {
      const fullDataset = fullDatasetConfig('ARROW', 'WMS');
      const actual = datasetFields(fullDataset);
      expect(actual).toHaveLength(1);
      expect(actual[0]).toStrictEqual({
        id: 'temp',
        visible: true,
        nullable: false,
        type: 'f32',
        label: 'Temperature',
      });
    });
  });

  describe('datasetMetaData', () => {
    it('should extract the complete metadata object', () => {
      const actual = datasetMetaData(dataset);
      expect(actual).toStrictEqual({
        table: 'unittest',
        positionFormat: 'XY',
        maxRequests: -1,
        geometryProperty: 'geometry',
        defaultFields: ['geometry'],
        filterDialect: 'cql',
      });
    });
  });
});

describe('Metadata Property Lenses (Direct Access)', () => {
  const metadata: LayerDatasetMetadata = {
    table: 'test_table',
    serviceUrls: ['https://api.example.com'],
    serviceVersion: '1.1.0',
    serviceLayer: 'test:stations',
    idProperty: 'station_id',
    geometryProperty: 'geom',
    minZoom: 3,
    maxZoom: 20,
    positionFormat: 'XYZ',
    maxRequests: 4,
    refetchInterval: 60000,
    defaultFields: ['station_id', 'temp', 'geom'],
    batchSize: 15000,
    filterDialect: 'gml',
  };

  describe('metaDataTable', () => {
    it('should extract the table name', () => {
      const actual = metaDataTable(metadata);
      expect(actual).toBe('test_table');
    });
  });

  describe('metaDataServiceUrls', () => {
    it('should extract service URLs', () => {
      const actual = metaDataServiceUrls(metadata);
      expect(actual).toStrictEqual(['https://api.example.com']);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataServiceUrls(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataServiceVersion', () => {
    it('should extract service version', () => {
      const actual = metaDataServiceVersion(metadata);
      expect(actual).toBe('1.1.0');
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataServiceVersion(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataServiceLayer', () => {
    it('should extract service layer', () => {
      const actual = metaDataServiceLayer(metadata);
      expect(actual).toBe('test:stations');
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataServiceLayer(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataIdProperty', () => {
    it('should extract id property', () => {
      const actual = metaDataIdProperty(metadata);
      expect(actual).toBe('station_id');
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataIdProperty(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataGeometryProperty', () => {
    it('should extract geometry property', () => {
      const actual = metaDataGeometryProperty(metadata);
      expect(actual).toBe('geom');
    });
  });

  describe('metaDataMinZoom', () => {
    it('should extract min zoom', () => {
      const actual = metaDataMinZoom(metadata);
      expect(actual).toBe(3);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataMinZoom(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataMaxZoom', () => {
    it('should extract max zoom', () => {
      const actual = metaDataMaxZoom(metadata);
      expect(actual).toBe(20);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataMaxZoom(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataPositionFormat', () => {
    it('should extract position format', () => {
      const actual = metaDataPositionFormat(metadata);
      expect(actual).toBe('XYZ');
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataPositionFormat(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataMaxRequests', () => {
    it('should extract max requests', () => {
      const actual = metaDataMaxRequests(metadata);
      expect(actual).toBe(4);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataMaxRequests(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataRefetchInterval', () => {
    it('should extract refetch interval', () => {
      const actual = metaDataRefetchInterval(metadata);
      expect(actual).toBe(60000);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataRefetchInterval(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataDefaultFields', () => {
    it('should extract default fields', () => {
      const actual = metaDataDefaultFields(metadata);
      expect(actual).toStrictEqual(['station_id', 'temp', 'geom']);
    });
  });

  describe('metaDataBatchSize', () => {
    it('should extract batch size', () => {
      const actual = metaDataBatchSize(metadata);
      expect(actual).toBe(15000);
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataBatchSize(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });

  describe('metaDataFilterDialect', () => {
    it('should extract filter dialect', () => {
      const actual = metaDataFilterDialect(metadata);
      expect(actual).toBe('gml');
    });

    it('should return undefined when not present', () => {
      const minimalMetadata: LayerDatasetMetadata = {
        table: 'minimal',
        geometryProperty: 'geom',
        defaultFields: ['geom'],
      };
      const actual = metaDataFilterDialect(minimalMetadata);
      expect(actual).toBeUndefined();
    });
  });
});

describe('Composed Dataset Lenses', () => {
  const dataset = fullDatasetConfig('ARROW', 'WFS');

  describe('datasetTable', () => {
    it('should extract table name from dataset', () => {
      const actual = datasetTable(dataset);
      expect(actual).toBe('full_test_table');
    });
  });

  describe('datasetServiceUrls', () => {
    it('should extract service URLs from dataset', () => {
      const actual = datasetServiceUrls(dataset);
      expect(actual).toStrictEqual([
        'https://api.test.com/geoserver',
        'https://backup.test.com',
      ]);
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetServiceUrls(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetServiceVersion', () => {
    it('should extract service version from dataset', () => {
      const actual = datasetServiceVersion(dataset);
      expect(actual).toBe('2.0.0');
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetServiceVersion(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetServiceLayer', () => {
    it('should extract service layer from dataset', () => {
      const actual = datasetServiceLayer(dataset);
      expect(actual).toBe('test:layer');
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetServiceLayer(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetIdProperty', () => {
    type TestFeature = {
      // biome-ignore lint/style/useNamingConvention: It's fine, this could happen
      feature_id: string;
      temp: number;
      location: [number, number];
    };

    it('should extract id property from dataset with type safety', () => {
      const actual = datasetIdProperty<TestFeature>(dataset);
      expect(actual).toBe('feature_id');
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetIdProperty<TestFeature>(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetGeometryProperty', () => {
    type TestFeature = {
      // biome-ignore lint/style/useNamingConvention: It's fine, this could happen
      feature_id: string;
      temp: number;
      location: [number, number];
    };

    it('should extract geometry property from dataset with type safety', () => {
      const actual = datasetGeometryProperty<TestFeature>(dataset);
      expect(actual).toBe('location');
    });

    it('should extract geometry property for minimal dataset', () => {
      type MinimalFeature = {
        geometry: [number, number];
      };
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetGeometryProperty<MinimalFeature>(minimalDataset);
      expect(actual).toBe('geometry');
    });
  });

  describe('datasetMinZoom', () => {
    it('should extract min zoom from dataset', () => {
      const actual = datasetMinZoom(dataset);
      expect(actual).toBe(5);
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetMinZoom(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetMaxZoom', () => {
    it('should extract max zoom from dataset', () => {
      const actual = datasetMaxZoom(dataset);
      expect(actual).toBe(18);
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetMaxZoom(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetPositionFormat', () => {
    it('should extract position format from dataset', () => {
      const actual = datasetPositionFormat(dataset);
      expect(actual).toBe('XYZ');
    });

    it('should extract XY format', () => {
      const xyDataset = genericDatasetConfig('ARROW', 'WMS');
      const actual = datasetPositionFormat(xyDataset);
      expect(actual).toBe('XY');
    });
  });

  describe('datasetMaxRequests', () => {
    it('should extract max requests from dataset', () => {
      const actual = datasetMaxRequests(dataset);
      expect(actual).toBe(6);
    });

    it('should extract negative value for testing', () => {
      const testDataset = genericDatasetConfig('GEOJSON', 'VTS');
      const actual = datasetMaxRequests(testDataset);
      expect(actual).toBe(-1);
    });
  });

  describe('datasetRefetchInterval', () => {
    it('should extract refetch interval from dataset', () => {
      const actual = datasetRefetchInterval(dataset);
      expect(actual).toBe(300000);
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetRefetchInterval(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetDefaultFields', () => {
    it('should extract default fields from dataset', () => {
      const actual = datasetDefaultFields(dataset);
      expect(actual).toStrictEqual(['feature_id', 'temp', 'location']);
    });

    it('should extract single default field', () => {
      const minimalDataset = genericDatasetConfig('ARROW', 'WFS');
      const actual = datasetDefaultFields(minimalDataset);
      expect(actual).toStrictEqual(['geometry']);
    });
  });

  describe('datasetBatchSize', () => {
    it('should extract batch size from dataset', () => {
      const actual = datasetBatchSize(dataset);
      expect(actual).toBe(25000);
    });

    it('should return undefined when not present', () => {
      const minimalDataset = genericDatasetConfig('GEOJSON', 'FS');
      const actual = datasetBatchSize(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });

  describe('datasetFilterDialect', () => {
    it('should extract filter dialect from dataset', () => {
      const actual = datasetFilterDialect(dataset);
      expect(actual).toBe('gml');
    });

    it('should extract cql dialect', () => {
      const cqlDataset = genericDatasetConfig('GEOJSON', 'WFS');
      const actual = datasetFilterDialect(cqlDataset);
      expect(actual).toBe('cql');
    });

    it('should return undefined when not present', () => {
      const minimalDataset: AnyDataset = {
        ...genericDatasetConfig('GEOJSON', 'FS'),
        metadata: {
          table: 'test',
          geometryProperty: 'geom',
          defaultFields: ['geom'],
        },
      };
      const actual = datasetFilterDialect(minimalDataset);
      expect(actual).toBeUndefined();
    });
  });
});

describe('Edge Cases', () => {
  describe('Optional property handling', () => {
    it('should handle datasets with minimal metadata', () => {
      const minimalDataset: AnyDataset = {
        id: 'minimal',
        level: 'generated',
        visible: true,
        mutatable: false,
        name: 'Minimal',
        description: 'Minimal dataset',
        serviceType: 'FS',
        dataType: 'GEOJSON',
        presentationTypes: { geometry: null },
        fields: [],
        metadata: {
          table: 'minimal_table',
          geometryProperty: 'geometry',
          defaultFields: ['geometry'],
        },
      };

      expect(datasetServiceUrls(minimalDataset)).toBeUndefined();
      expect(datasetServiceVersion(minimalDataset)).toBeUndefined();
      expect(datasetServiceLayer(minimalDataset)).toBeUndefined();
      expect(datasetIdProperty(minimalDataset)).toBeUndefined();
      expect(datasetMinZoom(minimalDataset)).toBeUndefined();
      expect(datasetMaxZoom(minimalDataset)).toBeUndefined();
      expect(datasetPositionFormat(minimalDataset)).toBeUndefined();
      expect(datasetMaxRequests(minimalDataset)).toBeUndefined();
      expect(datasetRefetchInterval(minimalDataset)).toBeUndefined();
      expect(datasetBatchSize(minimalDataset)).toBeUndefined();
      expect(datasetFilterDialect(minimalDataset)).toBeUndefined();
    });

    it('should handle datasets with all optional metadata populated', () => {
      const dataset = fullDatasetConfig('ARROW', 'WFS');

      expect(datasetServiceUrls(dataset)).toBeDefined();
      expect(datasetServiceVersion(dataset)).toBeDefined();
      expect(datasetServiceLayer(dataset)).toBeDefined();
      expect(datasetIdProperty(dataset)).toBeDefined();
      expect(datasetMinZoom(dataset)).toBeDefined();
      expect(datasetMaxZoom(dataset)).toBeDefined();
      expect(datasetPositionFormat(dataset)).toBeDefined();
      expect(datasetMaxRequests(dataset)).toBeDefined();
      expect(datasetRefetchInterval(dataset)).toBeDefined();
      expect(datasetBatchSize(dataset)).toBeDefined();
      expect(datasetFilterDialect(dataset)).toBeDefined();
    });
  });
});
