# Dataset

TypeScript library for validating and accessing dataset configurations with type-safe lenses and runtime validation.

This library provides a unified interface for managing dataset configurations across multiple geospatial service protocols (VTS, WMS, WFS, FS) and data formats (GeoJSON, Apache Arrow). It contains Zod schema validation and functional lens utilities for immutable property access.

## Installation

```bash
npm install @accelint/dataset
```

## Migration Guide: Pre-Release → v0.1.0

**This section is only relevant if upgrading from pre-release versions. New users can skip to [Core Concepts](#core-concepts).**

### Breaking Changes

#### 1. Array Suffix Removal for Categorical Fields

The `[]` suffix notation has been removed from `LayerDatasetFieldTypes`. This suffix was exclusively used to distinguish fields with `availableValues` (categorical/enumerated fields) from unrestricted fields.

**Before:**
```typescript
type LayerDatasetFieldTypes = 'bool' | 'bool[]' | 'str' | 'str[]' | ...;
```

**After:**
```typescript
type LayerDatasetFieldTypes = 'bool' | 'str' | ...;
```

Categorical fields are now identified solely by the presence of the availableValues property, not by their type suffix.

#### 2. Geometry Type Expansion

`(f32, f32)` has been replaced with specific geometry types aligned with GeoJSON specification:

**Before:**
```typescript
const geometryType: LayerDatasetFieldTypes = '(f32, f32)';
```

**After:**
```typescript
type GeometryTypes =
  | 'point'
  | 'multipoint'
  | 'linestring'
  | 'multilinestring'
  | 'polygon'
  | 'multipolygon';
```

#### 3. Field Type Map Restructuring

If you were using field type mappings for UI components (e.g., React Query Builder), update your mapping logic:

**Before:**
```typescript
export const fieldMap: FieldMap = {
  '(f32, f32)': { operators: [...] },
  'str': { operators: ['=', '!=', 'contains', ...], inputType: 'text' },
  'str[]': { operators: ['=', '!=', 'in', ...], inputType: 'text' },
};

const rqbFields = dataset.fields.map(f => fieldMap[f.dataType]);
```

**After:**
```typescript
export const fieldMap: FieldMap = {
  'str': { operators: ['=', '!=', 'contains', 'in', ...], inputType: 'text' },
  'point': { operators: ['intersects', 'within', ...] },
  'polygon': { operators: ['intersects', 'contains', ...] },
  // ... other geometry types
};

// If lookup table still uses the old `'x[]'` keys
const getPrefixedFieldConfig = (field: LayerDatasetField) => {
  const key = `${field.dataType}${field.availableValues ? '[]' : ''}`;

  return fieldTypeMap[key];
};

const rqbPrefixFields = dataset.fields.map(getPrefixedFieldConfig);

// If using updated lookup table
const getFieldConfig = (field: LayerDatasetField) => {
  if (field.availableValues?.length > 0) {
    // Swap out the scalar operators for the enumeration operators
    return { ...fieldMap[field.type], operators: ['=', '!=', 'in', 'not in'] };
  }

  return fieldMap[field.type];
};

const rqbFields = dataset.fields.map(getFieldConfig);
```

## Core Concepts

### Dataset Structure

A dataset configuration consists of:

- **Service Integration**: Protocol type, URLs, versioning, table identification
- **Data Specification**: Format type, field schemas, geometry properties
- **Presentation Metadata**: Rendering hints, fetch mechanics, and other properties
- **Validation Rules**: Type constraints, nullable fields, available values

### Type System Architecture

The library uses a discriminated union pattern to provide type-safe handling of different service protocol and data format combinations. Each dataset is uniquely identified by its `serviceType` and `dataType` properties, enabling exhaustive pattern matching and compile-time guarantees.

## Usage

### Validation

```typescript
import { validateDatasetConfig } from '@accelint/dataset';

const dataset = validateDatasetConfig(rawConfig);
```

### Lens-Based Property Access

```typescript
import {
  datasetId,
  datasetServiceUrls,
  datasetFields,
  metaDataGeometryProperty
} from '@accelint/dataset';

// Access properties immutably
const id = datasetId(dataset);
const urls = datasetServiceUrls(dataset);
const geomProp = metaDataGeometryProperty(dataset);

// Compose lenses for nested access
const defaultFields = datasetDefaultFields(dataset);
```

### Complete Example

```typescript
import { validateDatasetConfig, datasetVisible, datasetFields } from '@accelint/dataset';

const config = {
  id: 'buildings-layer',
  level: 'user',
  visible: true,
  mutatable: false,
  name: 'City Buildings',
  description: 'Building footprints from municipal data',
  serviceType: 'WFS',
  dataType: 'GEOJSON',
  presentationTypes: {
    default: ['polygon']
  },
  fields: [
    {
      id: 'height',
      visible: true,
      nullable: false,
      type: 'f32',
      label: 'Building Height (m)'
    },
    {
      id: 'status',
      visible: true,
      nullable: true,
      type: 'str',
      label: 'Status',
      availableValues: [
        { name: 'active', label: 'Active' },
        { name: 'inactive', label: 'Inactive' },
        { name: 'pending', label: 'Pending Review' }
      ]
    }
  ],
  metadata: {
    table: 'buildings',
    serviceUrls: ['https://gis.city.gov/wfs'],
    serviceVersion: '2.0.0',
    geometryProperty: 'geometry',
    defaultFields: ['height', 'status'],
    filterDialect: 'cql'
  }
};

const validated = validateDatasetConfig(config);
const isVisible = datasetVisible(config); // true
const fields = datasetFields(config);     // Array<LayerDatasetField>
```

## Field Types

Supported data types for dataset fields:

### Scalar Types
- `bool` - Boolean values
- `f32` - 32-bit floating point
- `f64` - 64-bit floating point
- `i32` - 32-bit signed integer
- `i64` - 64-bit signed integer
- `str` - UTF-8 string
- `date` - Date without time component
- `datetime` - Date with time and timezone
- `time` - Time of day without date

### Geometry Types
- `point` - Single coordinate pair (longitude, latitude)
- `multipoint` - Collection of point geometries
- `linestring` - Sequence of connected line segments
- `multilinestring` - Collection of linestring geometries
- `polygon` - Closed area defined by linear rings
- `multipolygon` - Collection of polygon geometries

### Categorical Fields

Fields with finite, enumerable options populate the `availableValues` property with an array of structured options:

```typescript
// Categorical field with predefined options
{
  id: 'status',
  type: 'str',
  availableValues: [
    { name: 'active', label: 'Active' },
    { name: 'inactive', label: 'Inactive' }
  ]
}

// Unrestricted text field
{
  id: 'description',
  type: 'str'
}
```

## Service Types

- **VTS**: Vector Tile Service
- **WMS**: Web Map Service
- **WFS**: Web Feature Service
- **FS**: Feature Service
- **Unknown**: Unspecified protocol

## Data Types

- **GEOJSON**: RFC 7946 GeoJSON format
- **ARROW**: Apache Arrow columnar format
- **Unknown**: Unspecified data format

## Layer Configuration Types

Built-in layer types for visualization:

- **icon**: For point data with custom symbols
- **point**: For circular point visualization
- **path**: For line/polyline data
- **polygon**: For filled area shapes
- **raster**: For tiled imagery

Custom layer types can be registered via extension mechanisms without modifying this core type definition.

## Error Handling

Validation errors include full property paths:

```typescript
try {
  validateDatasetConfig(invalidConfig);
} catch (error) {
  // Error: Validation failed:
  // metadata.serviceVersion: Invalid version: must be x.y.z
  // fields.0.type: Invalid enum value
}
```

## API Reference

### Validation Functions

#### `validateDatasetConfig(data: unknown): AnyDataset`

Pre-configured validator for dataset configurations. Convenience export that pre-applies `anyDatasetSchema` to the `validateSchema` function.

**Example:**
```typescript
const dataset = validateDatasetConfig(rawDataset);
```

### Lens Functions

All lens functions follow functional programming principles, returning immutable accessors for dataset properties.

#### Dataset Root Properties

- **`datasetId(dataset: AnyDataset): string`**
  - Extract the unique identifier from a dataset

- **`datasetLevel(dataset: AnyDataset): 'generated' | 'user'`**
  - Extract the provenance level from a dataset

- **`datasetVisible(dataset: AnyDataset): boolean`**
  - Extract the visibility state from a dataset

- **`datasetMutatable(dataset: AnyDataset): boolean`**
  - Extract the mutability flag from a dataset

- **`datasetName(dataset: AnyDataset): string`**
  - Extract the display name from a dataset

- **`datasetDescription(dataset: AnyDataset): string`**
  - Extract the description from a dataset

- **`datasetServiceType(dataset: AnyDataset): LayerServiceType`**
  - Extract the service protocol type (`'VTS' | 'WMS' | 'WFS' | 'FS' | 'Unknown'`)

- **`datasetDataType(dataset: AnyDataset): LayerDataType`**
  - Extract the data format type (`'GEOJSON' | 'ARROW' | 'Unknown'`)

- **`datasetPresentationTypes(dataset: AnyDataset): Record<string, LayerConfigType[] | null>`**
  - Extract presentation types mapping field names to visualization types

- **`datasetFields(dataset: AnyDataset): LayerDatasetField[]`**
  - Extract field definitions from a dataset

- **`datasetMetaData(dataset: AnyDataset): LayerDatasetMetadata`**
  - Extract complete metadata object from a dataset

#### Dataset Metadata Properties (Direct Access)

These functions provide direct access to nested metadata properties by composing lenses internally:

- **`datasetTable(dataset: AnyDataset): string`**
  - Extract the database table name

- **`datasetServiceUrls(dataset: AnyDataset): string[] | undefined`**
  - Extract service endpoint URLs

- **`datasetServiceVersion(dataset: AnyDataset): SemVerVersion | undefined`**
  - Extract service version (format: `x.y.z`)

- **`datasetServiceLayer(dataset: AnyDataset): string | undefined`**
  - Extract layer identifier for service requests

- **`datasetIdProperty(dataset: AnyDataset): string | undefined`**
  - Extract unique feature identifier property name

- **`datasetGeometryProperty(dataset: AnyDataset): string`**
  - Extract geometry field name in the dataset schema

- **`datasetMinZoom(dataset: AnyDataset): number | undefined`**
  - Extract minimum zoom level for rendering

- **`datasetMaxZoom(dataset: AnyDataset): number | undefined`**
  - Extract maximum zoom level for rendering

- **`datasetPositionFormat(dataset: AnyDataset): 'XY' | 'XYZ' | undefined`**
  - Extract coordinate dimensionality

- **`datasetMaxRequests(dataset: AnyDataset): number | undefined`**
  - Extract maximum concurrent requests limit

- **`datasetRefetchInterval(dataset: AnyDataset): number | undefined`**
  - Extract refetch interval in milliseconds

- **`datasetDefaultFields(dataset: AnyDataset): string[]`**
  - Extract default field names for queries

- **`datasetBatchSize(dataset: AnyDataset): number | undefined`**
  - Extract batch size for paginated requests

- **`datasetFilterDialect(dataset: AnyDataset): 'cql' | 'gml' | undefined`**
  - Extract query language dialect for server-side filtering

#### Metadata-Only Lens Functions

For cases where you already have the metadata object extracted:

- **`metaDataTable(metadata: LayerDatasetMetadata): string`**
- **`metaDataServiceUrls(metadata: LayerDatasetMetadata): string[] | undefined`**
- **`metaDataServiceVersion(metadata: LayerDatasetMetadata): SemVerVersion | undefined`**
- **`metaDataServiceLayer(metadata: LayerDatasetMetadata): string | undefined`**
- **`metaDataIdProperty(metadata: LayerDatasetMetadata): string | undefined`**
- **`metaDataGeometryProperty(metadata: LayerDatasetMetadata): string`**
- **`metaDataMinZoom(metadata: LayerDatasetMetadata): number | undefined`**
- **`metaDataMaxZoom(metadata: LayerDatasetMetadata): number | undefined`**
- **`metaDataPositionFormat(metadata: LayerDatasetMetadata): 'XY' | 'XYZ' | undefined`**
- **`metaDataMaxRequests(metadata: LayerDatasetMetadata): number | undefined`**
- **`metaDataRefetchInterval(metadata: LayerDatasetMetadata): number | undefined`**
- **`metaDataDefaultFields(metadata: LayerDatasetMetadata): string[]`**
- **`metaDataBatchSize(metadata: LayerDatasetMetadata): number | undefined`**
- **`metaDataFilterDialect(metadata: LayerDatasetMetadata): 'cql' | 'gml' | undefined`**

### Type Exports

The library exports TypeScript types for all dataset variants:

#### Base Types
- `LayerServiceType` - Service protocol enumeration
- `LayerDataType` - Data format enumeration
- `LayerConfigType` - Visualization layer types
- `LayerDatasetFieldTypes` - Field data types
- `FilterDialect` - Query language dialects
- `SemVerVersion` - Semantic version string type
- `LayerDatasetField` - Field configuration schema
- `LayerDatasetMetadata` - Metadata configuration schema
- `LayerDataset<DataType, ServiceType, ExtensionType>` - Generic dataset type

#### Concrete Dataset Types
- `GeoJsonFSDataset`, `GeoJsonVTSDataset`, `GeoJsonWFSDataset`, `GeoJsonWMSDataset`, `GeoJsonUnknownDataset`
- `ArrowFSDataset`, `ArrowVTSDataset`, `ArrowWFSDataset`, `ArrowWMSDataset`, `ArrowUnknownDataset`
- `UnknownFSDataset`, `UnknownVTSDataset`, `UnknownWFSDataset`, `UnknownWMSDataset`, `UnknownUnknownDataset`

#### Union Types
- `AnyGeoJsonDataset` - All GeoJSON variants
- `AnyArrowDataset` - All Arrow variants
- `AnyVTSDataset` - All VTS variants
- `AnyWFSDataset` - All WFS variants
- `AnyWMSDataset` - All WMS variants
- `AnyFSDataset` - All filesystem variants
- `AnyUnknownDataset` - All unknown service type variants
- `AnyUnknownDataDataset` - All unknown data type variants
- `AnyDataset` - Complete union of all dataset types

## License

Apache License 2.0 - Copyright 2025 Hypergiant Galactic Systems Inc.
