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
import { Deckgl, useDeckgl } from '@deckgl-fiber-renderer/dom';
import { useMapLibre } from '../../deckgl/hooks/use-maplibre';
import type { Decorator } from '@storybook/react-vite';
import type { IControl } from 'maplibre-gl';

interface MapDecoratorProps {
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  padding?: string | number;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
}

export const MAP_STYLE =
  'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const PARAMETERS = {
  depthWriteEnabled: true,
  depthCompare: 'always',
  depthBias: 0,
  blend: true,
  depthTest: false,
  blendColorSrcFactor: 'src-alpha',
  blendColorDstFactor: 'one-minus-src-alpha',
  blendAlphaSrcFactor: 'one',
  blendAlphaDstFactor: 'one-minus-src-alpha',
  blendColorOperation: 'add',
  blendAlphaOperation: 'add',
};

/**
 * A decorator that wraps stories in a map container with configurable properties
 *
 * @param options - Configuration options for the map container
 * @returns A Storybook decorator function
 */
export const withDeckGL = (options: MapDecoratorProps = {}): Decorator => {
  console.log(options);

  return (Story) => {
    const deckglInstance = useDeckgl();

    // Use the custom hook to handle MapLibre
    useMapLibre(deckglInstance as IControl, MAP_STYLE);

    return (
      // biome-ignore lint/correctness/useUniqueElementIds: <explanation>
      <div style={{ height: '100vh', width: '100%' }} id='maplibre'>
        <Deckgl
          controller
          interleaved
          useDevicePixels={false}
          // @ts-expect-error issue with deckgl type
          parameters={PARAMETERS}
        >
          <Story />
        </Deckgl>
      </div>
    );
  };
};
