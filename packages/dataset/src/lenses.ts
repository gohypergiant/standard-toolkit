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

import { composeLens, get, lensOptionalProp, lensProp } from '@accelint/core';
import type { AnyDataset, LayerDatasetMetadata } from './types/datasets';

// =============================================================================
// DATASET ROOT PROPERTY LENSES
// =============================================================================

/**
 * Lens focusing on the dataset's id property.
 *
 * @example
 * ```typescript
 * const id = get(idLens)(dataset);
 * ```
 */
const idLens = lensProp<AnyDataset>()('id');

/**
 * Extract the unique identifier from a dataset.
 *
 * @param dataset - The dataset to extract id from
 * @returns The unique dataset identifier string
 *
 * @example
 * ```typescript
 * const id = datasetId(dataset);
 * ```
 */
export const datasetId = get(idLens);

/**
 * Lens focusing on the dataset's level property.
 *
 * @example
 * ```typescript
 * const level = get(levelLens)(dataset);
 * ```
 */
const levelLens = lensProp<AnyDataset>()('level');

/**
 * Extract the provenance level from a dataset.
 *
 * @param dataset - The dataset to extract level from
 * @returns 'generated' | 'user'
 *
 * @example
 * ```typescript
 * const level = datasetLevel(dataset);
 * ```
 */
export const datasetLevel = get(levelLens);

/**
 * Lens focusing on the dataset's visible property.
 *
 * @example
 * ```typescript
 * const isVisible = get(visibleLens)(dataset);
 * ```
 */
const visibleLens = lensProp<AnyDataset>()('visible');

/**
 * Extract the visibility state from a dataset.
 *
 * @param dataset - The dataset to extract visibility from
 * @returns boolean indicating initial visibility
 *
 * @example
 * ```typescript
 * const isVisible = datasetVisible(dataset);
 * ```
 */
export const datasetVisible = get(visibleLens);

/**
 * Lens focusing on the dataset's mutatable property.
 *
 * @example
 * ```typescript
 * const canMutate = get(mutatableLens)(dataset);
 * ```
 */
const mutatableLens = lensProp<AnyDataset>()('mutatable');

/**
 * Extract the mutability flag from a dataset.
 *
 * @param dataset - The dataset to extract mutability from
 * @returns boolean indicating if dataset can be modified
 *
 * @example
 * ```typescript
 * const canMutate = datasetMutatable(dataset);
 * ```
 */
export const datasetMutatable = get(mutatableLens);

/**
 * Lens focusing on the dataset's name property.
 *
 * @example
 * ```typescript
 * const name = get(nameLens)(dataset);
 * ```
 */
const nameLens = lensProp<AnyDataset>()('name');

/**
 * Extract the display name from a dataset.
 *
 * @param dataset - The dataset to extract name from
 * @returns Human-readable dataset name
 *
 * @example
 * ```typescript
 * const name = datasetName(dataset);
 * document.title = `Viewing ${name}`;
 * ```
 */
export const datasetName = get(nameLens);

/**
 * Lens focusing on the dataset's description property.
 *
 * @example
 * ```typescript
 * const description = get(descriptionLens)(dataset);
 * ```
 */
const descriptionLens = lensProp<AnyDataset>()('description');

/**
 * Extract the description from a dataset.
 *
 * @param dataset - The dataset to extract description from
 * @returns Detailed dataset description string
 *
 * @example
 * ```typescript
 * const description = datasetDescription(dataset);
 * ```
 */
export const datasetDescription = get(descriptionLens);

/**
 * Lens focusing on the dataset's serviceType property.
 *
 * @example
 * ```typescript
 * const serviceType = get(serviceTypeLens)(dataset);
 * ```
 */
const serviceTypeLens = lensProp<AnyDataset>()('serviceType');

/**
 * Extract the service type from a dataset.
 *
 * @param dataset - The dataset to extract service type from
 * @returns The service protocol type, 'VTS' | 'WMS' | 'WFS' | 'FS' | 'Unknown'
 *
 * @example
 * ```typescript
 * const serviceType = datasetServiceType(dataset);
 * ```
 */
export const datasetServiceType = get(serviceTypeLens);

/**
 * Lens focusing on the dataset's dataType property.
 *
 * @example
 * ```typescript
 * const dataType = get(dataTypeLens)(dataset);
 * ```
 */
const dataTypeLens = lensProp<AnyDataset>()('dataType');

/**
 * Extract the data format type from a dataset.
 *
 * @param dataset - The dataset to extract data type from
 * @returns The data format type, 'GEOJSON' | 'ARROW' | 'Unknown'
 *
 * @example
 * ```typescript
 * const dataType = datasetDataType(dataset);
 * const parser = dataType === 'ARROW' ? arrowParser : geojsonParser;
 * ```
 */
export const datasetDataType = get(dataTypeLens);

/**
 * Lens focusing on the dataset's presentationTypes property.
 *
 * @example
 * ```typescript
 * const presentationTypes = get(presentationTypesLens)(dataset);
 * // { temperature: ['heatmap', 'point'], elevation: ['contour'] }
 * ```
 */
const presentationTypesLens = lensProp<AnyDataset>()('presentationTypes');

/**
 * Extract presentation types from a dataset.
 *
 * @param dataset - The dataset to extract presentation types from
 * @returns Record mapping field names to available visualization types
 *
 * @example
 * ```typescript
 * const types = datasetPresentationTypes(dataset);
 * const tempVisualizations = types.temperature; // ['heatmap', 'point']
 * ```
 */
export const datasetPresentationTypes = get(presentationTypesLens);

/**
 * Lens focusing on the dataset's fields array.
 *
 * @example
 * ```typescript
 * const fields = get(fieldsLens)(dataset);
 * // [{ id: 'temp', type: 'f32', visible: true, ... }, ...]
 * ```
 */
const fieldsLens = lensProp<AnyDataset>()('fields');

/**
 * Extract field definitions from a dataset.
 *
 * @param dataset - The dataset to extract fields from
 * @returns Array of LayerDatasetField objects
 *
 * @example
 * ```typescript
 * const fields = datasetFields(dataset);
 * const visibleFields = fields.filter(f => f.visible);
 * ```
 */
export const datasetFields = get(fieldsLens);

/**
 * Lens focusing on the dataset's metadata property.
 *
 * @example
 * ```typescript
 * const metadata = get(metadataLens)(dataset);
 * const updatedDataset = set(metadataLens)(newMetadata)(dataset);
 * ```
 */
const metadataLens = lensProp<AnyDataset>()('metadata');

/**
 * Extract metadata from a dataset.
 *
 * @param dataset - The dataset to extract metadata from
 * @returns The LayerDatasetMetadata object
 *
 * @example
 * ```typescript
 * const metadata = datasetMetaData(weatherDataset);
 * console.log(metadata.table); // 'weather_stations'
 * ```
 */
export const datasetMetaData = get(metadataLens);

// =============================================================================
// METADATA PROPERTY LENSES
// =============================================================================

/**
 * Lens focusing on the metadata's table field.
 *
 * @example
 * ```typescript
 * const tableName = get(tableLens)(metadata);
 * ```
 */
const tableLens = lensProp<LayerDatasetMetadata>()('table');

/**
 * Extract the table name from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The database table name
 *
 * @example
 * ```typescript
 * const tableName = metaDataTable(metadata);
 * ```
 */
export const metaDataTable = get(tableLens);

/**
 * Extract the table name directly from a dataset.
 *
 * @param dataset - The dataset to extract table name from
 * @returns The database table name
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → table
 *
 * @example
 * ```typescript
 * const tableName = datasetTable(dataset);
 * const query = `SELECT * FROM ${tableName}`;
 * ```
 */
export const datasetTable = get(composeLens(metadataLens, tableLens));

/**
 * Lens focusing on the metadata's serviceUrls field.
 *
 * @example
 * ```typescript
 * const urls = get(serviceUrlsLens)(metadata);
 * ```
 */
const serviceUrlsLens = lensOptionalProp<LayerDatasetMetadata>()('serviceUrls');

/**
 * Extract service URLs from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns Array of service endpoint URLs or undefined
 *
 * @example
 * ```typescript
 * const urls = metaDataServiceUrls(metadata);
 * ```
 */
export const metaDataServiceUrls = get(serviceUrlsLens);

/**
 * Extract service URLs directly from a dataset.
 *
 * @param dataset - The dataset to extract service URLs from
 * @returns Array of service endpoint URLs or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → serviceUrls
 *
 * @example
 * ```typescript
 * const urls = datasetServiceUrls(dataset);
 * const primaryEndpoint = urls?.[0];
 * ```
 */
export const datasetServiceUrls = get(
  composeLens(metadataLens, serviceUrlsLens),
);

/**
 * Lens focusing on the metadata's serviceVersion field.
 *
 * @example
 * ```typescript
 * const version = get(serviceVersionLens)(metadata);
 * // '1.0.0' | '2.0.0' | undefined
 * ```
 */
const serviceVersionLens =
  lensOptionalProp<LayerDatasetMetadata>()('serviceVersion');

/**
 * Extract the service version from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The service version string or undefined
 *
 * @example
 * ```typescript
 * const version = metaDataServiceVersion(metadata);
 * ```
 */
export const metaDataServiceVersion = get(serviceVersionLens);

/**
 * Extract the service version directly from a dataset.
 *
 * @param dataset - The dataset to extract service version from
 * @returns The service version string or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → serviceVersion
 *
 * @example
 * ```typescript
 * const version = datasetServiceVersion(dataset);
 * const url = `${baseUrl}?version=${version || '2.0.0'}`;
 * ```
 */
export const datasetServiceVersion = get(
  composeLens(metadataLens, serviceVersionLens),
);

/**
 * Lens focusing on the metadata's serviceLayer field.
 *
 * @example
 * ```typescript
 * const layer = get(serviceLayerLens)(metadata);
 * // 'weather:current_conditions' | undefined
 * ```
 */
const serviceLayerLens =
  lensOptionalProp<LayerDatasetMetadata>()('serviceLayer');

/**
 * Extract the service layer identifier from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The service layer identifier or undefined
 *
 * @example
 * ```typescript
 * const layer = metaDataServiceLayer(metadata);
 * ```
 */
export const metaDataServiceLayer = get(serviceLayerLens);

/**
 * Extract the service layer identifier directly from a dataset.
 *
 * @param dataset - The dataset to extract service layer from
 * @returns The service layer identifier or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → serviceLayer
 *
 * @example
 * ```typescript
 * const layer = datasetServiceLayer(dataset);
 * const url = baseUrl.replace('{layer}', layer || 'default');
 * ```
 */
export const datasetServiceLayer = get(
  composeLens(metadataLens, serviceLayerLens),
);

/**
 * Lens focusing on the metadata's idProperty field.
 *
 * @example
 * ```typescript
 * const idProp = get(idPropertyLens)(metadata);
 * // 'gid' | 'feature_id' | undefined
 * ```
 */
const idPropertyLens = lensOptionalProp<LayerDatasetMetadata>()('idProperty');

/**
 * Extract the feature identifier property name from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The id property name or undefined
 *
 * @example
 * ```typescript
 * const idProp = metaDataIdProperty(metadata);
 * ```
 */
export const metaDataIdProperty = get(idPropertyLens);

/**
 * Extract the feature identifier property name directly from a dataset.
 *
 * @template T - The expected feature type with typed property keys
 * @param dataset - The dataset to extract id property from
 * @returns The id property name as a key of T
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → idProperty
 *
 * @example
 * ```typescript
 * type Feature = { gid: number; name: string; geometry: Point };
 * const idKey = datasetIdProperty<Feature>(dataset); // 'gid'
 * const id = feature[idKey];
 * ```
 */
export const datasetIdProperty = <T>(dataset: AnyDataset): keyof T =>
  get(composeLens(metadataLens, idPropertyLens))(dataset) as keyof T;

/**
 * Lens focusing on the metadata's geometryProperty field.
 *
 * @example
 * ```typescript
 * const geomProp = get(geometryPropertyLens)(metadata);
 * // 'geom' | 'the_geom' | 'geometry' | 'location'
 * ```
 */
const geometryPropertyLens =
  lensOptionalProp<LayerDatasetMetadata>()('geometryProperty');

/**
 * Extract the geometry property name from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The geometry property name
 *
 * @example
 * ```typescript
 * const geomProp = metaDataGeometryProperty(metadata);
 * ```
 */
export const metaDataGeometryProperty = get(geometryPropertyLens);

/**
 * Extract the geometry property name directly from a dataset.
 *
 * @template T - The expected feature type with typed property keys
 * @param dataset - The dataset to extract geometry property from
 * @returns The geometry property name as a key of T
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → geometryProperty
 *
 * @example
 * ```typescript
 * type Feature = { id: number; location: Point };
 * const geomKey = datasetGeometryProperty<Feature>(dataset); // 'location'
 * const coords = feature[geomKey];
 * ```
 */
export const datasetGeometryProperty = <T>(dataset: AnyDataset): keyof T =>
  get(composeLens(metadataLens, geometryPropertyLens))(dataset) as keyof T;

/**
 * Lens focusing on the metadata's minZoom field.
 *
 * @example
 * ```typescript
 * const minZoom = get(minZoomLens)(metadata);
 * ```
 */
const minZoomLens = lensOptionalProp<LayerDatasetMetadata>()('minZoom');

/**
 * Extract the minimum zoom level from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The minimum zoom level or undefined
 *
 * @example
 * ```typescript
 * const minZoom = metaDataMinZoom(metadata);
 * ```
 */
export const metaDataMinZoom = get(minZoomLens);

/**
 * Extract the minimum zoom level directly from a dataset.
 *
 * @param dataset - The dataset to extract min zoom from
 * @returns The minimum zoom level or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → minZoom
 *
 * @example
 * ```typescript
 * const minZoom = datasetMinZoom(dataset);
 * ```
 */
export const datasetMinZoom = get(composeLens(metadataLens, minZoomLens));

/**
 * Lens focusing on the metadata's maxZoom field.
 *
 * @example
 * ```typescript
 * const maxZoom = get(maxZoomLens)(metadata);
 * ```
 */
const maxZoomLens = lensOptionalProp<LayerDatasetMetadata>()('maxZoom');

/**
 * Extract the maximum zoom level from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The maximum zoom level or undefined
 *
 * @example
 * ```typescript
 * const maxZoom = metaDataMaxZoom(metadata);
 * ```
 */
export const metaDataMaxZoom = get(maxZoomLens);

/**
 * Extract the maximum zoom level directly from a dataset.
 *
 * @param dataset - The dataset to extract max zoom from
 * @returns The maximum zoom level or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → maxZoom
 *
 * @example
 * ```typescript
 * const maxZoom = datasetMaxZoom(dataset);
 * ```
 */
export const datasetMaxZoom = get(composeLens(metadataLens, maxZoomLens));

/**
 * Lens focusing on the metadata's positionFormat field.
 *
 * @example
 * ```typescript
 * const format = get(positionFormatLens)(metadata);
 * ```
 */
const positionFormatLens =
  lensOptionalProp<LayerDatasetMetadata>()('positionFormat');

/**
 * Extract the position format from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns 'XY' | 'XYZ' | undefined
 *
 * @example
 * ```typescript
 * const format = metaDataPositionFormat(metadata);
 * ```
 */
export const metaDataPositionFormat = get(positionFormatLens);

/**
 * Extract the position format directly from a dataset.
 *
 * @param dataset - The dataset to extract position format from
 * @returns 'XY' | 'XYZ' | undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → positionFormat
 *
 * @example
 * ```typescript
 * const format = datasetPositionFormat(dataset);
 * const accessors = format === 'XYZ' ? xyzAccessors : xyAccessors;
 * ```
 */
export const datasetPositionFormat = get(
  composeLens(metadataLens, positionFormatLens),
);

/**
 * Lens focusing on the metadata's maxRequests field.
 *
 * @example
 * ```typescript
 * const maxReq = get(maxRequestsLens)(metadata);
 * ```
 */
const maxRequestsLens = lensOptionalProp<LayerDatasetMetadata>()('maxRequests');

/**
 * Extract the maximum concurrent requests from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The max requests limit or undefined
 *
 * @example
 * ```typescript
 * const maxReq = metaDataMaxRequests(metadata);
 * ```
 */
export const metaDataMaxRequests = get(maxRequestsLens);

/**
 * Extract the maximum concurrent requests directly from a dataset.
 *
 * @param dataset - The dataset to extract max requests from
 * @returns The max requests limit or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → maxRequests
 *
 * @example
 * ```typescript
 * const maxReq = datasetMaxRequests(dataset);
 * const limit = maxReq || 6;
 * ```
 */
export const datasetMaxRequests = get(
  composeLens(metadataLens, maxRequestsLens),
);

/**
 * Lens focusing on the metadata's refetchInterval field.
 *
 * @example
 * ```typescript
 * const interval = get(refetchIntervalLens)(metadata);
 * // 60000 (1 minute) | 300000 (5 minutes) | undefined
 * ```
 */
const refetchIntervalLens =
  lensOptionalProp<LayerDatasetMetadata>()('refetchInterval');

/**
 * Extract the refetch interval from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The refetch interval in milliseconds or undefined
 *
 * @example
 * ```typescript
 * const interval = metaDataRefetchInterval(metadata);
 * ```
 */
export const metaDataRefetchInterval = get(refetchIntervalLens);

/**
 * Extract the refetch interval directly from a dataset.
 *
 * @param dataset - The dataset to extract refetch interval from
 * @returns The refetch interval in milliseconds or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → refetchInterval
 *
 * @example
 * ```typescript
 * const interval = datasetRefetchInterval(dataset);
 * if (interval) {
 *   setInterval(() => refetchData(), interval);
 * }
 * ```
 */
export const datasetRefetchInterval = get(
  composeLens(metadataLens, refetchIntervalLens),
);

/**
 * Lens focusing on the metadata's defaultFields field.
 *
 * @example
 * ```typescript
 * const fields = get(defaultFieldsLens)(metadata);
 * // ['id', 'name', 'temperature', 'coordinates']
 * ```
 */
const defaultFieldsLens = lensProp<LayerDatasetMetadata>()('defaultFields');

/**
 * Extract the default fields array from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns Array of field names
 *
 * @example
 * ```typescript
 * const fields = metaDataDefaultFields(metadata);
 * ```
 */
export const metaDataDefaultFields = get(defaultFieldsLens);

/**
 * Extract the default fields array directly from a dataset.
 *
 * @param dataset - The dataset to extract default fields from
 * @returns Array of field names
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → defaultFields
 *
 * @example
 * ```typescript
 * const fields = datasetDefaultFields(dataset);
 * const queryFields = fields.join(',');
 * const url = `${endpoint}?fields=${queryFields}`;
 * ```
 */
export const datasetDefaultFields = get(
  composeLens(metadataLens, defaultFieldsLens),
);

/**
 * Lens focusing on the metadata's batchSize field.
 *
 * @example
 * ```typescript
 * const size = get(batchSizeLens)(metadata);
 * ```
 */
const batchSizeLens = lensOptionalProp<LayerDatasetMetadata>()('batchSize');

/**
 * Extract the batch size from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns The batch size or undefined
 *
 * @example
 * ```typescript
 * const size = metaDataBatchSize(metadata);
 * ```
 */
export const metaDataBatchSize = get(batchSizeLens);

/**
 * Extract the batch size directly from a dataset.
 *
 * @param dataset - The dataset to extract batch size from
 * @returns The batch size or undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → batchSize
 *
 * @example
 * ```typescript
 * const size = datasetBatchSize(dataset);
 * const batchSize = size || 10000;
 * ```
 */
export const datasetBatchSize = get(composeLens(metadataLens, batchSizeLens));

/**
 * Lens focusing on the metadata's filterDialect field.
 *
 * @example
 * ```typescript
 * const dialect = get(filterDialectLens)(metadata);
 * ```
 */
const filterDialectLens =
  lensOptionalProp<LayerDatasetMetadata>()('filterDialect');

/**
 * Extract the filter dialect from metadata.
 *
 * @param metadata - The metadata object to extract from
 * @returns 'cql' | 'gml' | undefined
 *
 * @example
 * ```typescript
 * const dialect = metaDataFilterDialect(metadata);
 * ```
 */
export const metaDataFilterDialect = get(filterDialectLens);

/**
 * Extract the filter dialect directly from a dataset.
 *
 * @param dataset - The dataset to extract filter dialect from
 * @returns 'cql' | 'gml' | undefined
 *
 * @remarks
 * Composed lens that navigates: dataset → metadata → filterDialect
 *
 * @example
 * ```typescript
 * const dialect = datasetFilterDialect(dataset);
 * const formatter = dialect === 'gml' ? formatGML : formatCQL;
 * const filter = formatter(conditions);
 * ```
 */
export const datasetFilterDialect = get(
  composeLens(metadataLens, filterDialectLens),
);
