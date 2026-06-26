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

import { extend } from '@deckgl-fiber-renderer/dom';
import { MaskedIconLayer, type MaskedIconLayerProps } from './index';
import type { CoffinCornerExtensionProps } from '../extensions';

extend({ MaskedIconLayer });

declare global {
  namespace React {
    // biome-ignore lint/style/useNamingConvention: Built-in React namespace.
    namespace JSX {
      interface IntrinsicElements {
        /**
         * A Deck.gl Fiber layer that recolors each icon's maskable region in
         * real time from a per-instance `getFillColor`, without a separate atlas
         * per color. Pair with `MaskedCoffinCornerExtension` for selection and
         * hover brackets that composite over the recolored icon.
         *
         * @example
         * ```tsx
         * <maskedIconLayer
         *   id="points"
         *   data={points}
         *   iconAtlas={atlas}
         *   iconMapping={mapping}
         *   getPosition={(d) => d.position}
         *   getIcon={() => 'marker'}
         *   getSize={32}
         *   billboard
         *   pickable
         *   getFillColor={(d) => d.color}
         * />
         * ```
         */
        maskedIconLayer: CoffinCornerExtensionProps<MaskedIconLayerProps>;
      }
    }
  }
}
