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

import {
  TextLayer as DglTextLayer,
  type TextLayerProps as DglTextLayerProps,
} from '@deck.gl/layers';
import { CHARACTER_SETS, type CharacterSetsKeys } from './character-sets.js';
import { defaultSettings } from './default-settings.js';
import type { LiteralUnion } from 'type-fest';

/**
 * Props for TextLayer component.
 * Extends Deck.gl's TextLayerProps with enhanced character set support.
 */
export interface TextLayerProps<TData = unknown>
  extends DglTextLayerProps<TData> {
  /**
   * Character set to use for text rendering.
   * Can be a predefined CHARACTER_SETS key or a custom string of characters.
   * Defaults to CHARACTER_SETS.EXPANDED for international text support.
   */
  characterSet?: LiteralUnion<CharacterSetsKeys, string>;
}

/**
 * A styled text layer that extends Deck.gl's TextLayer with enhanced styling capabilities.
 *
 * This layer provides:
 * - Customizable font styling (size, weight, family, line height)
 * - Text outline support
 * - Extended character set support
 * - Consistent styling based on design specifications
 *
 * Can be used directly with Deck.gl or as a JSX element with React Fiber:
 * - React Fiber: `<textLayer id="text" data={[...]} ... />`
 * - Direct: `new TextLayer({ id: 'text', data: [...], ... })`
 *
 * @example
 * Direct Deck.gl usage:
 * ```typescript
 * import { Deck } from '@deck.gl/core';
 * import { TextLayer } from '@accelint/map-toolkit/deckgl/text-layer';
 *
 * const layer = new TextLayer({
 *   id: 'text-labels',
 *   data: [
 *     { position: [-122.4, 37.74], text: 'San Francisco' },
 *     { position: [-118.2, 34.05], text: 'Los Angeles' },
 *   ],
 *   getText: d => d.text,
 *   getPosition: d => d.position,
 *   getSize: 14,
 *   fontWeight: 600,
 *   outlineWidth: 2,
 * });
 *
 * new Deck({
 *   initialViewState: { longitude: -120, latitude: 36, zoom: 6 },
 *   controller: true,
 *   layers: [layer],
 * });
 * ```
 *
 * @example
 * React Fiber usage:
 * ```tsx
 * import '@accelint/map-toolkit/deckgl/text-layer/fiber';
 * import { BaseMap } from '@accelint/map-toolkit/deckgl';
 * import { View } from '@deckgl-fiber-renderer/dom';
 *
 * function MapWithLabels() {
 *   const cities = [
 *     { position: [-122.4, 37.74], text: 'San Francisco' },
 *     { position: [-118.2, 34.05], text: 'Los Angeles' },
 *   ];
 *
 *   return (
 *     <BaseMap id="map" className="w-full h-full">
 *       <View id="main" controller />
 *       <textLayer
 *         id="city-labels"
 *         data={cities}
 *         getText={d => d.text}
 *         getPosition={d => d.position}
 *         getSize={14}
 *         fontWeight={600}
 *         outlineWidth={2}
 *       />
 *     </BaseMap>
 *   );
 * }
 * ```
 */
export class TextLayer<TData = unknown> extends DglTextLayer<TData> {
  static CHARACTER_SETS = CHARACTER_SETS;

  static override layerName = 'textLayer';

  constructor(props: TextLayerProps<TData>) {
    const {
      characterSet = CHARACTER_SETS.EXPANDED,
      fontSettings,
      ...rest
    } = props;

    super({
      // set opinionated defaults
      ...defaultSettings,

      // user props override defaults
      ...rest,

      // handle special characterSet logic
      characterSet:
        CHARACTER_SETS[characterSet as CharacterSetsKeys] ?? characterSet,

      fontSettings: {
        // merge fontSettings
        ...defaultSettings.fontSettings,

        // user props override defaults
        ...fontSettings,
      },
    });
  }
}
