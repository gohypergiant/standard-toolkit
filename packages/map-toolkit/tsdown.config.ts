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
    '!**/__fixtures__',
  ],
  // NOTE: must include all optionalDependencies, peerDependencies, and their subpath exports
  // to prevent tsdown from bundling them with hardcoded pnpm paths
  external: [
    // peerDependencies
    '@accelint/bus',
    '@accelint/core',
    '@accelint/geo',
    'react',
    // optionalDependencies
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
    'maplibre-gl',
    'milsymbol',
    'mjolnir.js',
    'react-map-gl',
    // subpath exports used in source
    'react-map-gl/maplibre',
    '@vis.gl/react-maplibre',
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
