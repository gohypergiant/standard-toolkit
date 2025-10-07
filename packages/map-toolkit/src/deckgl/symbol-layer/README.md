# `@accelint/map-toolkit/deckgl-layer-symbol`

Adds support for rendering MIL-STD-2525 and others standard symbologies as a Deck.gl layer. This layer is an extension of the [IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer) but swaps the `getIcon` function for a the `getSidc` function.

## Supported Symbology

- FM 1-02.2
- MIL-STD-2525 B/C/D/E
- STANAG APP6 B/D/E

_By default the SIDC will be used to determine which symbology to use._

## Usage

```typescript
import { Deck } from '@deck.gl/core';
import { SymbolLayer } from '@accelint/map-toolkit/deckgl-layer-symbol';

const layer = new SymbolLayer({
  id: 'SymbolLayer',
  data: 'http://some-url.com/data.json',
  // Default accessor uses "sidc" property of data point. Only
  // needed if SIDC data is on a different property
  getSidc: (d) => d.customSidcAccessor,
  // Works the same as default IconLayer getPosition property
  getPosition: (d) => d.position,
});

new Deck({
  initialViewState: {
    longitude: -122.4,
    latitude: 37.74,
    zoom: 11
  },
  controller: true,
  getTooltip: ({object}) => object && object.name,
  layers: [layer]
});
```

### With Fiber Renderer

This allows for easy integration with the [DeckGL Fiber Renderer](https://github.com/deckgl-fiber-renderer/fiber.gl/tree/main).

```typescript
import '@accelint/map-toolkit/deckgl-layer-symbol/fiber';

export function AssetsLayer() {
  const data = useAssetData();

  // Optional object
  const defaultSymbolOptions = {
    colorMode: 'Dark',
    square: true,
  };

  return (
    <symbolLayer
      id={useId()}
      data={data}
      defaultSymbolOptions={defaultSymbolOptions}
    />
  )
}
```

## API

This layer extends the IconLayer and has all the methods and properties of the IconLayer except for `getIcon`, `getColor`, `iconAtlas`, and `iconMapping`. In addition, it has the following methods:

### `getSidc(data: TData) => string | number`

Accessor function to get the SIDC of the data point. By default it will use the `sidc` property of the data point.

### `defaultSymbolOptions: SymbolOptions`

An optional object that allows for customizing the default symbol options for all data points. [See the `milsymbol` package for more information on the available options.](https://github.com/spatialillusions/milsymbol/blob/master/docs/README.md)

### `getSymbolOptions(data: TData) => SymbolOptions | null`

An optional accessor function that allows for customizing the symbol options for each data point. [See the `milsymbol` package for more information on the available options.](https://github.com/spatialillusions/milsymbol/blob/master/docs/README.md)