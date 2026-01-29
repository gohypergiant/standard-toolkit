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
import { DisplayShapeLayer } from './index';
import type { DisplayShapeLayerProps } from './types';

extend({ DisplayShapeLayer });

declare global {
  namespace React {
    // biome-ignore lint/style/useNamingConvention: Built-in React namespace.
    namespace JSX {
      interface IntrinsicElements {
        /**
         * A read-only Deck.gl Fiber layer for displaying geographic shapes with interactive features.
         *
         * Supports Point, LineString, Polygon, and Circle geometries with customizable styling,
         * icons, labels, selection, and hover effects. Ideal for rendering shapes from external
         * APIs or displaying geographic data without editing capabilities.
         */
        displayShapeLayer: DisplayShapeLayerProps;
      }
    }
  }
}
