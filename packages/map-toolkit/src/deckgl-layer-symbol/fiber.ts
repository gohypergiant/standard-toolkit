import { extend } from '@deckgl-fiber-renderer/dom';
import { SymbolLayer, type SymbolLayerProps } from './index';

extend({ SymbolLayer });

declare global {
  namespace React {
    // biome-ignore lint/style/useNamingConvention: Built-in React namespace.
    namespace JSX {
      interface IntrinsicElements {
        symbolLayer: SymbolLayerProps;
      }
    }
  }
}
