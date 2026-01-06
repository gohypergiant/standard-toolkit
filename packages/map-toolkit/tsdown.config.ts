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

import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [],
  entry: [
    'src/**/*.{ts,tsx}',
    '!src/test',
    '!src/**/*.{d,stories,test,test-d,bench}.{ts,tsx}',
    '!src/decorators',
    '!**/__fixtures__',
    // Exclude internal implementation details from public API
    '!src/deckgl/shapes/draw-shape-layer/modes/draw-*.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/base-transform-mode.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/bounding-transform-mode.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/circle-transform-mode.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/rotate-mode-with-snap.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/scale-mode-with-free-transform.ts',
    '!src/deckgl/shapes/edit-shape-layer/modes/vertex-transform-mode.ts',
    '!src/deckgl/shapes/draw-shape-layer/store.ts',
    '!src/deckgl/shapes/edit-shape-layer/store.ts',
    '!src/deckgl/shapes/display-shape-layer/store.ts',
    '!src/deckgl/shapes/draw-shape-layer/utils/**',
    '!src/deckgl/shapes/display-shape-layer/utils/**',
    '!src/deckgl/shapes/display-shape-layer/shape-label-layer.ts',
    '!src/deckgl/shapes/draw-shape-layer/constants.ts',
    '!src/deckgl/shapes/edit-shape-layer/constants.ts',
    '!src/deckgl/shapes/display-shape-layer/constants.ts',
    // Shared internal utilities (not part of public API)
    '!src/deckgl/shapes/shared/utils/geometry-measurements.ts',
    '!src/deckgl/shapes/shared/utils/mode-utils.ts',
    '!src/deckgl/shapes/shared/utils/pick-filtering.ts',
    '!src/deckgl/shapes/shared/utils/layer-config.ts',
    // Shared internal hooks (used by draw/edit layers, not public API)
    '!src/deckgl/shapes/shared/hooks/**',
  ],
  // NOTE: optionalDependencies must be included here
  // SEE: https://tsdown.dev/options/dependencies#default-behavior
  external: [
    '@accelint/hotkey-manager',
    '@deck.gl-community/editable-layers',
    '@deck.gl/core',
    '@deck.gl/extensions',
    '@deck.gl/layers',
    '@deckgl-fiber-renderer/dom',
    '@deckgl-fiber-renderer/shared',
    '@deckgl-fiber-renderer/types',
    '@math.gl/web-mercator',
    '@turf/helpers',
    '@turf/turf',
    '@vis.gl/react-maplibre',
    'maplibre-gl',
    'milsymbol',
    'mjolnir.js',
    'react',
    'react-dom',
    'react-map-gl',
    // NOTE: subpath imports are treated uniquely in tsdown so they must be explicitly included
    'react-map-gl/maplibre',
  ],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  unbundle: true,
  treeshake: true,
  platform: 'neutral',
  minify: false,
  exports: true,
  // NOTE: our license header is currently not formatted correctly to support https://rolldown.rs/options/output#legalcomments
  outputOptions: {
    banner: `/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */\n\n`,
  },
});
