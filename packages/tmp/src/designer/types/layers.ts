import type { PresentationTypes } from './common';
import type { FilterGroup } from './filters';

/** Layer alignment X position. */
export type AlignmentX = 'start' | 'middle' | 'end';

/** Layer alignment Y position. */
export type AlignmentY = 'top' | 'center' | 'bottom';

/** Layer text configuration. */
export type TextLayerConfig = {
  color: any; // FIXME: Color type from deckgl?
  background: boolean;
  size: number;
  alignX: AlignmentX;
  alignY: AlignmentY;
  offsetX: number;
  offsetY: number;
  charLimit: number;
};

/** The generic presentation (style) config. */
export type GenericPresentationConfig<T extends PresentationTypes> = {
  /**
   * Type of visualization for this layer.
   * @link LayerConfigType
   */
  type: T;

  /** Opacity for the entire layer (all data). Not applicable for all layer types. */
  opacity: number;

  /**
   * Whether or not the layer can be interacted with.
   * Correlates to the `pickable` deck property.
   * https://deck.gl/docs/api-reference/core/layer#pickable
   */
  interactable: boolean;

  /**
   * Whether or not to automatically highlight objects when hovered.
   * Correlates to the `autoHighlight` deck property.
   * https://deck.gl/docs/api-reference/core/layer#autohighlight
   */
  autoHighlight: boolean;

  /**
   * The unit of dimensions.
   * Various Deck.gl properties.
   * - `PathLayer.widthUnits`
   * - `ScatterplotLayer.radiusUnits`
   * - `LineLayer.widthUnits`
   * - `IconLayer.sizeUnits`
   * - `PolygonLayer.lineWidthUnits`
   *
   * https://deck.gl/docs/developer-guide/coordinate-systems#dimensions
   */
  units: any; // FIXME: deckgl Unit type;
};

// * NOTE: When new are added, do it here 👇

/** Presentation config for an Icon Layer. */
export type IconPresentationConfig = GenericPresentationConfig<'icon'> & {
  /**
   * Icon ID.
   * Correlates to the `getIcon` deck property.
   * https://deck.gl/docs/api-reference/layers/icon-layer#geticon
   */
  iconId?: number;

  /**
   * Icon size.
   * Correlates to the `getSize` deck property.
   * https://deck.gl/docs/api-reference/layers/icon-layer#getsize
   */
  size?: number;

  /**
   * Icon angle.
   * Correlates to the `getAngle` deck property.
   * https://deck.gl/docs/api-reference/layers/icon-layer#getangle
   */
  angle?: number;

  /**
   * Icon offset.
   * Correlates to the `getPixelOffset` deck property.
   * https://deck.gl/docs/api-reference/layers/icon-layer#getpixeloffset
   */
  offset?: [number, number];

  /**
   * Icon color.
   * Correlates to the `getColor` deck property.
   * https://deck.gl/docs/api-reference/layers/icon-layer#getcolor
   */
  color?: any; // FIXME: Color type from deckgl?;

  /**
   * Icon hover color.
   * Correlates to MaskedIconLayer.hoverColor.
   */
  hoverColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Icon click color.
   * Correlates to MaskedIconLayer.clickColor.
   */
  clickColor?: any; // FIXME: Color type from deckgl?;
};

/** Presentation config for a Point Layer. */
export type PointPresentationConfig = GenericPresentationConfig<'point'> & {
  /**
   * Whether filled or not.
   * Correlates to the `filled` deck property.
   * https://deck.gl/docs/api-reference/layers/scatterplot-layer#filled
   */
  filled?: boolean;

  /**
   * Whether stroked or not.
   * Correlates to the `stroked` deck property.
   * https://deck.gl/docs/api-reference/layers/scatterplot-layer#stroked
   */
  stroked?: boolean;

  /**
   * Scatterplot fill color.
   * Correlates to the `getFillColor` deck property.
   * https://deck.gl/docs/api-reference/layers/scatterplot-layer#getfillcolor
   */
  fillColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Scatterplot line color.
   * Correlates to the `getLineColor` deck property.
   * https://deck.gl/docs/api-reference/layers/scatterplot-layer#getlinecolor
   */
  lineColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Item hightlight color.
   * Correlates to the `highlightColor` deck property.
   * https://deck.gl/docs/api-reference/core/layer#highlightcolor
   */
  highlightColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Radius size.
   * Correlates to the `radiusMaxPixels` deck property.
   * https://deck.gl/docs/api-reference/layers/scatterplot-layer#radiusmaxpixels
   */
  size?: number;
};

/** Presentation config for a Path Layer. */
export type PathPresentationConfig = GenericPresentationConfig<'path'> & {
  /**
   * Path line size.
   * Correlates to the `widthMinPixels` deck property.
   * https://deck.gl/docs/api-reference/layers/path-layer#widthminpixels
   */
  size?: number;

  /**
   * Path color.
   * Correlates to the `getColor` deck property.
   * https://deck.gl/docs/api-reference/layers/path-layer#getcolor
   */
  color?: any; // FIXME: Color type from deckgl?;

  /**
   * Item hightlight color.
   * Correlates to the `highlightColor` deck property.
   * https://deck.gl/docs/api-reference/core/layer#highlightcolor
   */
  highlightColor?: any; // FIXME: Color type from deckgl?;
};

/** Presentation config for a Polygon Layer. */
export type PolygonPresentationConfig = GenericPresentationConfig<'polygon'> & {
  /**
   * Whether filled or not.
   * Correlates to the `filled` deck property.
   * https://deck.gl/docs/api-reference/layers/polygon-layer#filled
   */
  filled?: boolean;

  /**
   * Whether stroked or not.
   * Correlates to the `stroked` deck property.
   * https://deck.gl/docs/api-reference/layers/polygon-layer#stroked
   */
  stroked?: boolean;

  /**
   * Polygon line size.
   * Correlates to the `lineWidthMinPixels` deck property.
   * https://deck.gl/docs/api-reference/layers/polygon-layer#linewidthminpixels
   */
  size?: number;

  /**
   * Polygon fill color.
   * Correlates to the `getFillColor` deck property.
   * https://deck.gl/docs/api-reference/layers/polygon-layer#getfillcolor
   */
  fillColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Polygon line color.
   * Correlates to the `getLineColor` deck property.
   * https://deck.gl/docs/api-reference/layers/polygon-layer#getlinecolor
   */
  lineColor?: any; // FIXME: Color type from deckgl?;

  /**
   * Item hightlight color.
   * Correlates to the `highlightColor` deck property.
   * https://deck.gl/docs/api-reference/core/layer#highlightcolor
   */
  highlightColor?: any; // FIXME: Color type from deckgl?;
};

/** Presentation config. */
export type LayerPresentationConfig =
  | IconPresentationConfig
  | PointPresentationConfig
  | PathPresentationConfig
  | PolygonPresentationConfig;

// * END OVERLOAD TYPES ☝️

/** Shape of the underlying layer configuration. */
export type LayerConfig<
  T extends GenericPresentationConfig<PresentationTypes>,
> = {
  /** ID for this layer configuration. */
  id: string;

  /** Dataset foreign key ID. */
  dataset: string;

  /** Label for this layer configuration. */
  label: string;

  /** Presentation configuration for this layer.*/
  presentation: T;

  /** Whether or not this layer is visible. May also dictate whether data is fetched or paused. */
  visible: boolean;

  /**
   * A list of fields required for either client side computation or display.
   * For some service types, such as WFS, this informs the property name
   * query parameter.
   */
  requiredFields: string[];

  /**
   * The min zoom for this dataset.
   * Deck.gl's `TileLayer.minZoom`.
   * https://deck.gl/docs/api-reference/geo-layers/tile-layer#minzoom
   */
  zoomThreshold?: number;

  /** Whether or not to filter this layer by the current viewport */
  filterByViewport?: boolean;

  /**
   * The filters for this Layer configuration. This is from the output of react-query-builder.
   * No filters prop is analogous to "give me all the data for this dataset".
   */
  filters?: { query: FilterGroup };

  /** Text layer configuration. */
  text?: TextLayerConfig;
};
