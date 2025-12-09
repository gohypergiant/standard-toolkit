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

/**
 * Supported semver style protocol versions for WMS/WFS service endpoints.
 *
 * @remarks
 * Version selection affects:
 * - Available request parameters and response formats
 * - Spatial reference system support
 * - Query capabilities and filter syntax
 * - Performance characteristics and feature completeness
 *
 * Examples:
 * @see {@link https://docs.geoserver.org/stable/en/user/services/wms/reference.html} WMS Reference
 * @see {@link https://docs.geoserver.org/stable/en/user/services/wfs/reference.html} WFS Reference
 */
export type SemVerVersion = `${string}.${string}.${string}`;

/**
 * Service protocols supported for dataset integration.
 *
 * @remarks
 * Each service type has distinct characteristics:
 * - **`'VTS'`**: Vector Tile Service - High performance, pre-processed tiles
 * - **`'WMS'`**: Web Map Service - Raster tiles with feature information
 * - **`'WFS'`**: Web Feature Service - Vector feature data with query capabilities
 * - **`'FS'`**: File System - Static files, local uploads, CDN-hosted data
 * - **`'Unknown'`**: Fallback for unrecognized or pending service detection
 */
export type LayerServiceType = 'VTS' | 'WMS' | 'WFS' | 'FS' | 'Unknown';

/**
 * Supported data formats for dataset responses and processing.
 *
 * @remarks
 * Format selection affects parsing, performance, and feature availability:
 * - **`'GEOJSON'`**: RFC 7946 compliant JSON format, universally supported, human-readable
 * - **`'ARROW'`**: Apache Arrow columnar format, high performance, efficient memory usage
 * - **`'Unknown'`**: Format detection pending, error state, or unsupported formats
 *
 * @future Planned additions: JSON, GEOARROW, PARQUET, GEOPARQUET
 *
 * @example
 * ```typescript
 * const geoJsonType: LayerDataType = 'GEOJSON';
 * const arrowType: LayerDataType = 'ARROW';
 * ```
 */
export type LayerDataType = 'GEOJSON' | 'ARROW' | 'Unknown';

/**
 * Built-in layer types for Deck.gl visualization layers.
 *
 * @remarks
 * Each type corresponds to a specific Deck.gl layer implementation:
 * - **`'icon'`**: MaskedIconLayer for point data with custom symbols from atlases
 * - **`'point'`**: ScatterplotLayer for simple circular point visualization
 * - **`'path'`**: PathLayer for line/polyline data representing routes, boundaries
 * - **`'polygon'`**: PolygonLayer for filled area shapes representing regions, zones
 *
 * **Extension Support:**
 * Custom layer types can be added via ImplementationConfig.extension without
 * modifying this core type definition.
 *
 * @see {@link https://deck.gl/docs/api-reference/layers | Deck.gl Layer Documentation}
 * @see {@link ImplementationConfig} - For registering custom layer types
 */
export type LayerConfigType = 'icon' | 'point' | 'path' | 'polygon' | 'raster';

/**
 * Query language dialect for server-side spatial filtering operations.
 *
 * @remarks
 * Supported dialects:
 * - `cql`: Common Query Language (ECQL) - text-based, human-readable syntax
 *   Example: `temperature > 20 AND status = 'active'`
 * - `gml`: OGC Filter Encoding - XML-based GML format
 *   Example: `<PropertyIsEqualTo><PropertyName>status</PropertyName><Literal>active</Literal></PropertyIsEqualTo>`
 *
 * @see {@link https://docs.geoserver.org/stable/en/user/filter/ecql_reference.html | GeoServer ECQL Reference}
 * @see {@link https://www.ogc.org/standard/filter/ | OGC Filter Encoding Specification}
 */
export type FilterDialect = 'cql' | 'gml';

/**
 * Supported data types for layer dataset fields.
 *
 * @remarks
 * Primitive types:
 * - `bool`: Boolean values
 * - `i32`: 32-bit signed integer
 * - `i64`: 64-bit signed integer
 * - `str`: UTF-8 string
 * - `f32`: 32-bit floating point
 * - `f64`: 64-bit floating point
 *
 * Temporal types:
 * - `date`: Date without time component
 * - `datetime`: Date with time and timezone
 * - `time`: Time of day without date
 *
 * Geometry types:
 * - `point`: Single coordinate pair (longitude, latitude)
 * - `multipoint`: Collection of point geometries
 * - `linestring`: Sequence of connected line segments
 * - `multilinestring`: Collection of linestring geometries
 * - `polygon`: Closed area defined by linear rings
 * - `multipolygon`: Collection of polygon geometries
 *
 * @example
 * ```typescript
 * const temperatureField: LayerDatasetFieldTypes = 'f32';
 * const locationField: LayerDatasetFieldTypes = '(f32, f32)';
 * const isActiveField: LayerDatasetFieldTypes = 'bool';
 * ```
 */
export type LayerDatasetFieldTypes =
  | 'bool'
  | 'date'
  | 'datetime'
  | 'f32'
  | 'f64'
  | 'i32'
  | 'i64'
  | 'str'
  | 'time'
  | 'point'
  | 'multipoint'
  | 'linestring'
  | 'multilinestring'
  | 'polygon'
  | 'multipolygon';

/**
 * Configuration for a single field within a dataset.
 * Defines field metadata, visibility, and data constraints.
 *
 * @example
 * ```typescript
 * const temperatureField: LayerDatasetField = {
 *   id: 'temp_celsius',
 *   visible: true,
 *   nullable: false,
 *   type: 'f32',
 *   label: 'Temperature (°C)',
 * };
 *
 * const statusField: LayerDatasetField = {
 *   id: 'status',
 *   visible: true,
 *   nullable: true,
 *   type: 'str',
 *   label: 'Status',
 *   availableValues: {
 *     'active': 'Active',
 *     'inactive': 'Inactive',
 *     'pending': 'Pending Review'
 *   }
 * };
 * ```
 */
export type LayerDatasetField = {
  /**
   * Unique identifier for this field within the dataset.
   */
  id: string;

  /**
   * Controls field visibility in filter UI components.
   * Hidden fields are still available for queries but not shown to users.
   */
  visible: boolean;

  /**
   * Whether this field accepts null/undefined values.
   */
  nullable: boolean;

  /**
   * Data type specification for this field.
   * @see {@link LayerDatasetFieldTypes}
   */
  type: LayerDatasetFieldTypes;

  /**
   * Human-readable display name for this field in UI components.
   * @example 'Temperature (°C)', 'Population Density', 'Last Updated'
   */
  label: string;

  /**
   * Predefined options for select/dropdown components.
   * Key-value pairs where key is the internal value and value is display text.
   * Only populated for fields with finite, enumerable options.
   *
   * @example
   * ```typescript
   * {
   *   'urban': 'Urban Area',
   *   'suburban': 'Suburban Area',
   *   'rural': 'Rural Area'
   * }
   * ```
   */
  // biome-ignore lint/suspicious/noExplicitAny: This is intentional
  availableValues?: Record<string, any>;
};

/**
 * Metadata configuration for dataset service integration and rendering.
 * Contains service endpoint information, zoom constraints, and field specifications.
 *
 * @example
 * ```typescript
 * const metadata: LayerDatasetMetadata = {
 *   table: 'weather_stations',
 *   serviceUrls: ['https://api.weather.gov/geoserver'],
 *   serviceVersion: '2.0.0',
 *   idProperty: 'station_id',
 *   geometryProperty: 'geometry',
 *   minZoom: 5,
 *   maxZoom: 18,
 *   positionFormat: 'XY',
 *   maxRequests: 6,
 *   refetchInterval: 300000, // 5 minutes
 *   defaultFields: ['station_id', 'temperature', 'humidity', 'geometry']
 * };
 * ```
 */
export type LayerDatasetMetadata = {
  /**
   * Original database table name underlying this dataset.
   */
  table: string;

  /**
   * List of service endpoint URL templates.
   * May contain placeholders for serviceLayer substitution.
   */
  serviceUrls?: string[];

  /**
   * Geoserver service version override.
   * Allows per-dataset version specification for services requiring explicit versioning (e.g., WFS).
   *
   * @example '1.0.0', '1.1.0', '1.3.0', '2.0.0'
   */
  serviceVersion?: SemVerVersion;

  /**
   * Layer identifier for service requests.
   *
   * CURRENTLY UNUSED.
   *
   * @remarks
   * When provided:
   * - Substituted into serviceUrls templates
   * - Enables dynamic URL construction
   *
   * When undefined:
   * - serviceUrls assumed to be complete endpoints
   * - No template processing performed
   *
   * @example 'weather:current_conditions', 'census:population_2020'
   */
  serviceLayer?: string;

  /**
   * Unique feature identifier property name for tile-based rendering.
   *
   * @remarks
   * Used by deck.gl MVTLayer.uniqueIdProperty to maintain feature identity
   * across tile boundaries and zoom levels.
   *
   * @see {@link https://deck.gl/docs/api-reference/geo-layers/mvt-layer#uniqueidproperty | deck.gl MVTLayer.uniqueIdProperty}
   *
   * @example 'gid', 'feature_id', 'object_id'
   */
  idProperty?: string;

  /**
   * Primary geometry field name for spatial rendering.
   *
   * @remarks
   * Specifies which field contains the geographic coordinates/shapes.
   *
   * **Future enhancement**: Support multiple geometries per dataset through
   * presentableFields configuration linked to presentationTypes.
   *
   * @example 'geom', 'the_geom', 'geometry', 'location'
   */
  geometryProperty: string;

  /**
   * Minimum zoom level for dataset visibility.
   * Controls zoom slider minimum value in UI components.
   */
  minZoom?: number;

  /**
   * Maximum zoom level for dataset visibility.
   * Controls zoom slider maximum value in UI components.
   */
  maxZoom?: number;

  /**
   * Coordinate system format for position data.
   *
   * @remarks
   * - `XY`: 2D coordinates (longitude, latitude)
   * - `XYZ`: 3D coordinates (longitude, latitude, elevation)
   *
   * @see {@link https://deck.gl/docs/api-reference/core/layer#positionformat | deck.gl Layer.positionFormat}
   *
   * @defaultValue 'XY'
   * @example 'XY'
   */
  positionFormat?: 'XYZ' | 'XY';

  /**
   * Concurrent request limit for tile loading.
   *
   * @remarks
   * Controls maximum simultaneous requests to prevent overwhelming
   * the service endpoint or client network capacity.
   *
   * @see {@link https://deck.gl/docs/api-reference/geo-layers/tile-layer#maxrequests | deck.gl TileLayer.maxRequests}
   *
   * @minimum 1
   * @defaultValue 6
   * @example 4
   */
  maxRequests?: number;

  /**
   * Data refresh interval in milliseconds.
   * Defines how frequently the dataset should poll for updates.
   *
   * @example 60000 // 1 minute
   * @example 300000 // 5 minutes
   */
  refetchInterval?: number;

  /**
   * Essential fields for client-side operations.
   *
   * @remarks
   * Includes fields required for:
   * - Tooltip display
   * - Client-side filtering/computation
   * - User interface rendering
   *
   * @future Replace with user-configurable field selection.
   *
   * @example ['id', 'name', 'temperature', 'coordinates']
   */
  defaultFields: string[];

  /**
   * Size of batch to use when requesting Arrow data.
   *
   * @remarks
   * Includes fields required for:
   * - Tooltip display
   * - Client-side filtering/computation
   * - User interface rendering
   *
   * @defaultValue 10000
   * @example 25000
   */
  batchSize?: number;

  /**
   * Filter expression dialect for spatial query operations.
   *
   * @remarks
   * Specifies the query language format for server-side feature filtering:
   *
   * - `cql`: Common Query Language (ECQL) - text-based, human-readable syntax
   * - `gml`: OGC Filter Encoding (XML/GML format)
   *
   * @see {@link https://docs.geoserver.org/stable/en/user/filter/ecql_reference.html | GeoServer ECQL Reference}
   * @see {@link https://www.ogc.org/standard/filter/ | OGC Filter Encoding Specification}
   *
   * @defaultValue 'cql'
   */
  filterDialect?: FilterDialect;
};

/**
 * Core dataset configuration combining service integration and data specification.
 *
 * @template DataType - Must extend LayerDataType ('GEOJSON' | 'ARROW' | 'Unknown')
 * @template ServiceType - Must extend LayerServiceType (from GeoserverServiceType)
 * @template ExtensionType - String union of available visual extension types.
 *
 * @remarks
 * This constraint system enables type-safe dataset definitions and
 * compile-time validation of service/data type combinations.
 *
 * @example
 * ```typescript
 * // Define a GeoJSON dataset from WFS service
 * const wfsDataset: LayerDataset<'GEOJSON', 'WFS'> = {
 *   id: 'SoMeLoNgIdStRiNg',
 *   level: 'generated',
 *   visible: true,
 *   mutatable: false,
 *   name: 'Weather Stations',
 *   description: 'Real-time weather monitoring stations',
 *   serviceType: 'WFS',
 *   dataType: 'GEOJSON',
 *   presentationTypes: {
 *     temperature: ['icon', 'point'],
 *   },
 *   fields: [
 *     {
 *       id: 'temp',
 *       visible: true,
 *       nullable: false,
 *       type: 'f32',
 *       label: 'Temperature'
 *     }
 *   ],
 *   metadata: {
 *     table: 'weather_stations',
 *     geometryProperty: 'location',
 *     defaultFields: ['id', 'temp', 'location']
 *   }
 * };
 * ```
 */
export type LayerDataset<
  DataType extends LayerDataType,
  ServiceType extends LayerServiceType,
  ExtensionType = '',
> = {
  /**
   * Unique dataset identifier across the application.
   */
  id: string;

  /**
   * Dataset provenance indicator.
   *
   * @remarks
   * - `generated`: System-created dataset (automated processes, imports)
   * - `user`: User-uploaded or configured dataset (manual creation)
   */
  level: 'generated' | 'user';

  /**
   * Initial visibility state for layer creation workflows.
   */
  visible: boolean;

  /**
   * Mutability flag for dataset modification operations.
   * Controls whether users can edit dataset configuration or data.
   *
   * @remarks
   * CURRENTLY UNUSED.
   */
  mutatable: boolean;

  /**
   * Human-readable dataset name for UI display.
   */
  name: string;

  /**
   * Detailed dataset description for documentation and components.
   */
  description: string;

  /**
   * Service integration type.
   * Determines endpoint protocol and request formatting.
   *
   * @readonly This value is set at dataset creation and cannot be modified
   * @example 'WFS', 'WMS', 'VTS'
   */
  readonly serviceType: ServiceType;

  /**
   * Expected response data format.
   * Must be compatible with the specified serviceType.
   *
   * @readonly This value is set at dataset creation and cannot be modified
   * @example 'GEOJSON', 'ARROW'
   */
  readonly dataType: DataType;

  /**
   * Available presentation modes per field.
   *
   * @remarks
   * Structure: `Record<fieldName, (LayerConfigType | ExtensionType)[] | null>`
   *
   * - Key: Field name from the dataset
   * - Value: Array of supported visualization types
   *
   * @future Support multiple geometry fields with independent
   * presentation configurations (e.g., point location + coverage area).
   *
   * @example
   * ```typescript
   * {
   *   temperature: ['heatmap', 'point', 'choropleth'],
   *   population: ['choropleth', 'point'],
   *   elevation: ['contour', '3d-surface'],
   * }
   * ```
   */
  presentationTypes: Record<string, (LayerConfigType | ExtensionType)[] | null>;

  /**
   * Complete field schema for this dataset.
   */
  fields: LayerDatasetField[];

  /**
   * Service integration and rendering metadata.
   */
  metadata: LayerDatasetMetadata;
};

// =============================================================================
// CONCRETE DATASET TYPE DEFINITIONS
// =============================================================================

/**
 * Filesystem-sourced GeoJSON dataset.
 * @example File uploads, local data imports
 */
export type GeoJsonFSDataset<ExtensionType = ''> = LayerDataset<
  'GEOJSON',
  'FS',
  ExtensionType
>;

/**
 * GeoJSON dataset from unknown/unspecified source.
 * @example Legacy datasets, third-party integrations
 */
export type GeoJsonUnknownDataset<ExtensionType = ''> = LayerDataset<
  'GEOJSON',
  'Unknown',
  ExtensionType
>;

/**
 * Vector Tile Service GeoJSON dataset.
 * @example Mapbox Vector Tiles, custom tile servers
 */
export type GeoJsonVTSDataset<ExtensionType = ''> = LayerDataset<
  'GEOJSON',
  'VTS',
  ExtensionType
>;

/**
 * Web Feature Service GeoJSON dataset.
 * @example OGC WFS endpoints, PostGIS through GeoServer
 */
export type GeoJsonWFSDataset<ExtensionType = ''> = LayerDataset<
  'GEOJSON',
  'WFS',
  ExtensionType
>;

/**
 * Web Map Service GeoJSON dataset.
 * @example Raster tiles with feature information
 */
export type GeoJsonWMSDataset<ExtensionType = ''> = LayerDataset<
  'GEOJSON',
  'WMS',
  ExtensionType
>;

/**
 * Filesystem-sourced Arrow dataset.
 * @example Parquet files, Arrow IPC files
 */
export type ArrowFSDataset<ExtensionType = ''> = LayerDataset<
  'ARROW',
  'FS',
  ExtensionType
>;

/**
 * Arrow dataset from unknown/unspecified source.
 * @example Legacy columnar data, migration scenarios
 */
export type ArrowUnknownDataset<ExtensionType = ''> = LayerDataset<
  'ARROW',
  'Unknown',
  ExtensionType
>;

/**
 * Vector Tile Service Arrow dataset.
 * @example High-performance columnar vector tiles
 */
export type ArrowVTSDataset<ExtensionType = ''> = LayerDataset<
  'ARROW',
  'VTS',
  ExtensionType
>;

/**
 * Web Feature Service Arrow dataset.
 * @example Modern WFS implementations with Arrow support
 */
export type ArrowWFSDataset<ExtensionType = ''> = LayerDataset<
  'ARROW',
  'WFS',
  ExtensionType
>;

/**
 * Web Map Service Arrow dataset.
 * @example Hybrid raster/vector services with columnar data
 */
export type ArrowWMSDataset<ExtensionType = ''> = LayerDataset<
  'ARROW',
  'WMS',
  ExtensionType
>;

/**
 * Filesystem dataset with unknown data format.
 * @example Format detection pending, unsupported file types
 */
export type UnknownFSDataset<ExtensionType = ''> = LayerDataset<
  'Unknown',
  'FS',
  ExtensionType
>;

/**
 * Dataset with both unknown source and data format.
 * @example Temporary import states, error conditions
 */
export type UnknownUnknownDataset<ExtensionType = ''> = LayerDataset<
  'Unknown',
  'Unknown',
  ExtensionType
>;

/**
 * Vector Tile Service dataset with unknown data format.
 * @example Custom tile formats, experimental protocols
 */
export type UnknownVTSDataset<ExtensionType = ''> = LayerDataset<
  'Unknown',
  'VTS',
  ExtensionType
>;

/**
 * Web Feature Service dataset with unknown data format.
 * @example Non-standard WFS responses
 */
export type UnknownWFSDataset<ExtensionType = ''> = LayerDataset<
  'Unknown',
  'WFS',
  ExtensionType
>;

/**
 * Web Map Service dataset with unknown data format.
 * @example Custom WMS implementations
 */
export type UnknownWMSDataset<ExtensionType = ''> = LayerDataset<
  'Unknown',
  'WMS',
  ExtensionType
>;

// =============================================================================
// SERVICE TYPE UNIONS
// =============================================================================

/**
 * Union of all Vector Tile Service dataset variants.
 */
export type AnyVTSDataset<ExtensionType = string> =
  | GeoJsonVTSDataset<ExtensionType>
  | ArrowVTSDataset<ExtensionType>
  | UnknownVTSDataset<ExtensionType>;

/**
 * Union of all unknown service type dataset variants.
 */
export type AnyUnknownDataset<ExtensionType = string> =
  | GeoJsonUnknownDataset<ExtensionType>
  | ArrowUnknownDataset<ExtensionType>
  | UnknownUnknownDataset<ExtensionType>;

/**
 * Union of all Web Feature Service dataset variants.
 */
export type AnyWFSDataset<ExtensionType = string> =
  | GeoJsonWFSDataset<ExtensionType>
  | ArrowWFSDataset<ExtensionType>
  | UnknownWFSDataset<ExtensionType>;

/**
 * Union of all Web Map Service dataset variants.
 */
export type AnyWMSDataset<ExtensionType = string> =
  | GeoJsonWMSDataset<ExtensionType>
  | ArrowWMSDataset<ExtensionType>
  | UnknownWMSDataset<ExtensionType>;

/**
 * Union of all filesystem dataset variants.
 */
export type AnyFSDataset<ExtensionType = string> =
  | GeoJsonFSDataset<ExtensionType>
  | ArrowFSDataset<ExtensionType>
  | UnknownFSDataset<ExtensionType>;

// =============================================================================
// DATA TYPE UNIONS
// =============================================================================

/**
 * Union of all Apache Arrow dataset variants.
 */
export type AnyArrowDataset<ExtensionType = string> =
  | ArrowFSDataset<ExtensionType>
  | ArrowUnknownDataset<ExtensionType>
  | ArrowVTSDataset<ExtensionType>
  | ArrowWFSDataset<ExtensionType>
  | ArrowWMSDataset<ExtensionType>;

/**
 * Union of all GeoJSON dataset variants.
 */
export type AnyGeoJsonDataset<ExtensionType = string> =
  | GeoJsonFSDataset<ExtensionType>
  | GeoJsonUnknownDataset<ExtensionType>
  | GeoJsonVTSDataset<ExtensionType>
  | GeoJsonWFSDataset<ExtensionType>
  | GeoJsonWMSDataset<ExtensionType>;

/**
 * Union of all unknown data type dataset variants.
 */
export type AnyUnknownDataDataset<ExtensionType = string> =
  | UnknownFSDataset<ExtensionType>
  | UnknownUnknownDataset<ExtensionType>
  | UnknownVTSDataset<ExtensionType>
  | UnknownWFSDataset<ExtensionType>
  | UnknownWMSDataset<ExtensionType>;

/**
 * Complete union of all possible dataset type combinations.
 * Use for generic dataset handling where specific type constraints are not required.
 */
export type AnyDataset<ExtensionType = string> =
  | ArrowFSDataset<ExtensionType>
  | ArrowUnknownDataset<ExtensionType>
  | ArrowVTSDataset<ExtensionType>
  | ArrowWFSDataset<ExtensionType>
  | ArrowWMSDataset<ExtensionType>
  | GeoJsonFSDataset<ExtensionType>
  | GeoJsonUnknownDataset<ExtensionType>
  | GeoJsonVTSDataset<ExtensionType>
  | GeoJsonWFSDataset<ExtensionType>
  | GeoJsonWMSDataset<ExtensionType>
  | UnknownFSDataset<ExtensionType>
  | UnknownUnknownDataset<ExtensionType>
  | UnknownVTSDataset<ExtensionType>
  | UnknownWFSDataset<ExtensionType>
  | UnknownWMSDataset<ExtensionType>;
