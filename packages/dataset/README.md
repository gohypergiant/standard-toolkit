# Dataset

TypeScript library for validating and accessing dataset configurations with type-safe lenses and runtime validation.

This library provides a unified interface for managing dataset configurations across multiple geospatial service protocols (VTS, WMS, WFS, FS) and data formats (GeoJSON, Apache Arrow). It contains Zod schema validation and functional lens utilities for immutable property access.

## Installation

```bash
npm install @accelint/dataset
```

## Core Concepts

### Dataset Structure

A dataset configuration consists of:

- **Service Integration**: Protocol type, URLs, versioning, table identification
- **Data Specification**: Format type, field schemas, geometry properties
- **Presentation Metadata**: Rendering hints, fetch mechanics, and other properties
- **Validation Rules**: Type constraints, nullable fields, available values

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
    }
  ],
  metadata: {
    table: 'buildings',
    serviceUrls: ['https://gis.city.gov/wfs'],
    serviceVersion: '2.0.0',
    geometryProperty: 'geometry',
    defaultFields: ['height', 'name'],
    filterDialect: 'cql'
  }
};

const validated = validateDatasetConfig(config);
const isVisible = datasetVisible(config); // true
const fields = datasetFields(config);     // Array<LayerDatasetField>
```

## Field Types

Supported data types for dataset fields:

```
Scalar:   bool, f32, f64, i32, i64, str, date, datetime, time
Arrays:   bool[], f32[], f64[], i32[], i64[], str[], date[], datetime[], time[]
Geometry:   (f32, f32)
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

- `validateSchema<T>(schema: ZodType<T>): (data: unknown) => T` - Curried validator factory
- `validateDatasetConfig(data: unknown): AnyDataset` - Pre-configured dataset validator

### Lens Functions

**Dataset Properties:**
- `datasetId`, `datasetName`, `datasetDescription`
- `datasetVisible`, `datasetMutatable`, `datasetLevel`
- `datasetServiceType`, `datasetDataType`
- `datasetPresentationTypes`, `datasetFields`

**Metadata Properties:**
- `datasetTable`, `datasetServiceUrls`, `datasetServiceVersion`
- `datasetGeometryProperty`, `datasetIdProperty`
- `datasetMinZoom`, `datasetMaxZoom`
- `datasetDefaultFields`, `datasetFilterDialect`

## License

Apache License 2.0 - Copyright 2025 Hypergiant Galactic Systems Inc.
