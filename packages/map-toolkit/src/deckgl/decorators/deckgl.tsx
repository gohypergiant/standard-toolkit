// __private-exports

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
import { MAP_STYLE, PARAMETERS } from '../constants';
import { useMapLibre } from '../hooks/use-maplibre';
import type { Decorator } from '@storybook/react';
import type { IControl } from 'maplibre-gl';

interface MapDecoratorProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
}

/**
 * A decorator that wraps stories in a map container with configurable properties
 *
 * @param options - Configuration options for the map container
 * @returns A Storybook decorator function
 */
export const withDeckGL = (mapOptions: MapDecoratorProps = {}): Decorator => {
  return (Story) => {
    const deckglInstance = useDeckgl();

    // Use the custom hook to handle MapLibre
    useMapLibre(deckglInstance as IControl, MAP_STYLE, mapOptions);

    return (
      // biome-ignore lint/correctness/useUniqueElementIds: Needed for maplibre.
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
