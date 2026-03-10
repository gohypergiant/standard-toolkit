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
 * Fiber renderer entry point for GARS grid layer.
 *
 * Import this module once in your app to enable `<garsLayer />` JSX syntax
 * with the `@deckgl-fiber-renderer` renderer.
 *
 * @example
 * ```typescript
 * import '@accelint/map-toolkit/gars/fiber';
 * // <garsLayer definition={garsDefinition} showLabels />
 * ```
 */
import { extend } from '@deckgl-fiber-renderer/dom';
import { GarsLayer } from './';
import type { GARSLayerProps } from './types';

extend({ GarsLayer });

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        garsLayer: GARSLayerProps;
      }
    }
  }
}
