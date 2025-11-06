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

import {
  TextLayer as DglTextLayer,
  type TextLayerProps as DglTextLayerProps,
} from '@deck.gl/layers';
import { CHARACTER_SETS, type CharacterSetsKeys } from './character-sets.js';
import { defaultSettings } from './default-settings.js';
import type { LiteralUnion } from 'type-fest';

export interface TextLayerProps<TData = unknown>
  extends DglTextLayerProps<TData> {
  // A union type that preserves autocompletion for CharacterSetsKeys while allowing any string.
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
