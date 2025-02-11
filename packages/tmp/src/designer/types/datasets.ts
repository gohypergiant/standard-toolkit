import type { PresentationTypes } from './common';

/** Available types for layer dataset fields. **/
export type DatasetFieldTypes =
  | 'bool'
  | 'i32'
  | 'i64'
  | 'str'
  | 'f32'
  | 'f64'
  // TODO: need to add other geometry type variants
  // IDEA: point(f32,f32), list((f32, f32)), list(list(point(f32, f32)))
  | '(f32, f32)'
  | 'date'
  | 'datetime'
  | 'time';

/** Shape of the fields for a dataset. */
export type DatasetField = {
  /** Unique field ID */
  id: string;

  /** Whether this field should be visible in filter displays. */
  visible: boolean;

  /** Whether this field is nullable. */
  nullable: boolean;

  /** Data type of this field. */
  type: DatasetFieldTypes;

  /** Label for this field. */
  label: string;

  /** Enumeration values for this field that we can present to the user. */
  availableValues?: Record<string, any>;
};

/** Shape of the metadata prop for a data set. */
export type DatasetMetadata = {
  /** The original name of the underlying table. */
  table: string;

  /**
   * List of service url templates.
   * The intent here is to mimic what Deck.gl has done for `WMSLayer.data` property.
   * https://deck.gl/docs/api-reference/geo-layers/wms-layer#data
   * */
  serviceUrls?: string[];

  /** Some services like WFS require a version, this allows us to change it per dataset. */
  serviceVersion?: string;

  /**
   * Column name for the actual unique identifier column for this dataset.
   * Needed to support Deck.gl's `MVTLayer.uniqueIdProperty` property.
   * https://deck.gl/docs/api-reference/geo-layers/mvt-layer#uniqueidproperty
   */
  idProperty?: string;

  /**
   * The position format for this dataset.
   * Needed to support Deck.gl's `Layer.positionFormat` property.
   * https://deck.gl/docs/api-reference/core/layer#positionformat
   */
  positionFormat?: 'XYZ' | 'XY';

  /**
   * The bare minimum "required" fields to render something on the screen.
   * Should also take into consideration data needed for tooltips but not bb cards.
   * In future iterations, this will probably be removed in lieu of user selection.
   */
  defaultFields: string[];
};

/** Available `serviceType's for a dataset. */
export type DatasetServiceType = 'VTS' | 'WMS' | 'WFS' | 'FS' | 'Unknown';

/** Available `dataType`s for a dataset. */
export type DatasetDataType = 'GEOJSON' | 'ARROW' | 'Unknown';
// NOTE: Possible future data types: JSON, GEOARROW, PARQUET, GEOPARQUET, CSV, SHAPEFILE, KML.

// * NOTE: Needed for TS overloads. Generic `T` must be a string value matching
// * one of the `DatasetDataType`s. Generic `S` must be a string value matching
// * one of the `DatasetServiceType`s.

/** Shape of the underlying dataset configuration that power the layers. */
export type LayerDataset<
  T extends DatasetDataType,
  S extends DatasetServiceType,
> = {
  /** Unique ID for this dataset. */
  id: string;

  /**
   * Dictates how the dataset was created.
   * Generated indicating the dataset was created with a script or similar.
   * User indicating a user uploaded this dataset (like a CSV).
   * */
  level: 'generated' | 'user';

  /**
   * Whether or not this dataset will be presented to the user when creating a layer.
   * In some cases you may have a dataset that you just want to know about internally
   * for code or feature integrations as the generated types are quite helpful.
   * */
  visible: boolean;

  /** TBD */
  mutatable: boolean;

  /** Name of the dataset. */
  name: string;

  /** Description of the dataset. */
  description: string;

  /**
   * Service type the dataset uses.
   * @link DatasetServiceType
   */
  readonly serviceType: S;

  /**
   * Response type of the service type.
   * @link DatasetDataType
   */
  readonly dataType: T;

  /**
   * The type of presentations that are available for this dataset.
   * In some cases a dataset may contain multiple geometry columns
   * in the same table. The presentationTypes should account for
   * all potential options as a user will be able to select the
   * geometry field that is powering the presentation.
   */
  presentationTypes: Record<string, PresentationTypes[] | null>;

  /** Fields that are available on this data set. */
  fields: DatasetField[];

  /** Metadata information for this dataset. */
  metadata: DatasetMetadata;
};

/** A Filesystem GeoJson dataset. */
export type GeoJsonFSDataset = LayerDataset<'GEOJSON', 'FS'>;

/** A Unknown GeoJson dataset. */
export type GeoJsonUnknownDataset = LayerDataset<'GEOJSON', 'Unknown'>;

/** A VTS GeoJson dataset. */
export type GeoJsonVTSDataset = LayerDataset<'GEOJSON', 'VTS'>;

/** A WFS GeoJson dataset. */
export type GeoJsonWFSDataset = LayerDataset<'GEOJSON', 'WFS'>;

/** A WMS GeoJson dataset. */
export type GeoJsonWMSDataset = LayerDataset<'GEOJSON', 'WMS'>;

/** A Filesystem Arrow dataset. */
export type ArrowFSDataset = LayerDataset<'ARROW', 'FS'>;

/** A Unknown Arrow dataset. */
export type ArrowUnknownDataset = LayerDataset<'ARROW', 'Unknown'>;

/** A VTS Arrow dataset. */
export type ArrowVTSDataset = LayerDataset<'ARROW', 'VTS'>;

/** A WFS Arrow dataset. */
export type ArrowWFSDataset = LayerDataset<'ARROW', 'WFS'>;

/** A WMS Arrow dataset. */
export type ArrowWMSDataset = LayerDataset<'ARROW', 'WMS'>;

/** A Unknown Arrow dataset. */
export type UnknownFSDataset = LayerDataset<'Unknown', 'FS'>;

/** A Unknown Unknown dataset. */
export type UnknownUnknownDataset = LayerDataset<'Unknown', 'Unknown'>;

/** A VTS Unknown dataset. */
export type UnknownVTSDataset = LayerDataset<'Unknown', 'VTS'>;

/** A WFS Unknown dataset. */
export type UnknownWFSDataset = LayerDataset<'Unknown', 'WFS'>;

/** A WMS Unknown dataset. */
export type UnknownWMSDataset = LayerDataset<'Unknown', 'WMS'>;

// ----- ServiceType Unions

/** Any VTS service type dataset. */
export type AnyVTSDataset =
  | GeoJsonVTSDataset
  | ArrowVTSDataset
  | UnknownVTSDataset;

/** Any Unknown service type dataset. */
export type AnyUnknownDataset =
  | GeoJsonUnknownDataset
  | ArrowUnknownDataset
  | UnknownUnknownDataset;

/** Any WFS service type dataset. */
export type AnyWFSDataset =
  | GeoJsonWFSDataset
  | ArrowWFSDataset
  | UnknownWFSDataset;

/** Any WMS service type dataset. */
export type AnyWMSDataset =
  | GeoJsonWMSDataset
  | ArrowWMSDataset
  | UnknownWMSDataset;

/** Any FS service type dataset. */
export type AnyFSDataset = GeoJsonFSDataset | ArrowFSDataset | UnknownFSDataset;

// ----- DataType Unions

/** Any Arrow data type dataset. */
export type AnyArrowDataset =
  | ArrowFSDataset
  | ArrowUnknownDataset
  | ArrowVTSDataset
  | ArrowWFSDataset
  | ArrowWMSDataset;

/** Any GeoJson data type dataset. */
export type AnyGeoJsonDataset =
  | GeoJsonFSDataset
  | GeoJsonUnknownDataset
  | GeoJsonVTSDataset
  | GeoJsonVTSDataset
  | GeoJsonWFSDataset
  | GeoJsonWMSDataset;

/** Any Unknown data type dataset. */
export type AnyUnknownDataDataset =
  | UnknownFSDataset
  | UnknownUnknownDataset
  | UnknownVTSDataset
  | UnknownVTSDataset
  | UnknownWFSDataset
  | UnknownWMSDataset;

/** Any data type or servie type dataset. */
export type AnyDataset =
  | ArrowFSDataset
  | ArrowUnknownDataset
  | ArrowVTSDataset
  | ArrowWFSDataset
  | ArrowWMSDataset
  | GeoJsonFSDataset
  | GeoJsonUnknownDataset
  | GeoJsonVTSDataset
  | GeoJsonVTSDataset
  | GeoJsonWFSDataset
  | GeoJsonWMSDataset
  | UnknownFSDataset
  | UnknownUnknownDataset
  | UnknownVTSDataset
  | UnknownVTSDataset
  | UnknownWFSDataset
  | UnknownWMSDataset;
