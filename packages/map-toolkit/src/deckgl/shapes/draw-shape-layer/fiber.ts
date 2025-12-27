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
