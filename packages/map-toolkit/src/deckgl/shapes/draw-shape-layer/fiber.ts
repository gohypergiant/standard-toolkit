/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
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
 * DeckGL Fiber Registration for EditableGeoJsonLayer
 *
 * Registers the `EditableGeoJsonLayer` from @deck.gl-community/editable-layers
 * with the DeckGL Fiber renderer, enabling JSX syntax for the layer.
 *
 * ## Why This Is Needed
 * DeckGL Fiber (used by BaseMap) requires explicit registration of deck.gl layers
 * before they can be used as JSX elements. This file extends the fiber renderer
 * to recognize `<editableGeoJsonLayer>` as a valid JSX element.
 *
 * ## Usage
 * Import this file once (typically in DrawShapeLayer) before using the layer in JSX:
 *
 * @example
 * ```tsx
 * // Import to register the layer
 * import '@accelint/map-toolkit/deckgl/shapes/draw-shape-layer/fiber';
 *
 * // Now you can use it in JSX
 * function DrawShapeLayer() {
 *   return (
 *     <editableGeoJsonLayer
 *       id="draw-layer"
 *       mode={drawMode}
 *       onEdit={handleEdit}
 *     />
 *   );
 * }
 * ```
 *
 * ## Note on DrawShapeLayer
 * `DrawShapeLayer` is a React component, not a deck.gl layer class, so it doesn't
 * need fiber registration. It uses `<editableGeoJsonLayer>` internally, which is
 * registered here.
 */

import { EditableGeoJsonLayer } from '@deck.gl-community/editable-layers';
import { extend } from '@deckgl-fiber-renderer/dom';

// Extend the fiber renderer with EditableGeoJsonLayer
extend({ EditableGeoJsonLayer });

// Note: DrawShapeLayer is a React component, not a deck.gl layer class,
// so it doesn't need fiber registration. It uses <editableGeoJsonLayer>
// internally which is registered above.

declare global {
  namespace React {
    // biome-ignore lint/style/useNamingConvention: Built-in React namespace.
    namespace JSX {
      interface IntrinsicElements {
        // biome-ignore lint/suspicious/noExplicitAny: EditableGeoJsonLayer props are complex and vary by mode
        editableGeoJsonLayer: any;
      }
    }
  }
}
