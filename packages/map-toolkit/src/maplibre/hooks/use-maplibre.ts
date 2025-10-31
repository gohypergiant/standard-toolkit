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

import { type IControl, Map as MapLibre, type MapOptions } from 'maplibre-gl';
import { useEffect, useRef } from 'react';

/**
 * Hook to integrate a MapLibre GL map with a Deck.gl instance.
 *
 * This hook manages the lifecycle of a MapLibre map, including initialization,
 * style updates, and cleanup. It ensures the Deck.gl control is properly added
 * to the map and handles cleanup when the component unmounts.
 *
 * @param deck - The Deck.gl IControl instance to add to the map
 * @param styleUrl - The MapLibre style URL to use for the map
 * @param options - MapLibre map options (container, center, zoom, etc.)
 * @returns The MapLibre map instance, or null if not yet initialized
 *
 * @example
 * ```tsx
 * function MapComponent() {
 *   const deckglInstance = useDeckgl();
 *   const container = useId();
 *
 *   const mapOptions = useMemo(() => ({
 *     container,
 *     center: [-122.4, 37.8],
 *     zoom: 12,
 *   }), [container]);
 *
 *   useMapLibre(
 *     deckglInstance as IControl,
 *     'https://tiles.example.com/style.json',
 *     mapOptions
 *   );
 *
 *   return <div id={container} />;
 * }
 * ```
 */
export function useMapLibre(
  deck: IControl | null,
  styleUrl: string,
  options: MapOptions,
) {
  const mapRef = useRef<MapLibre | null>(null);
  // Using a ref for options to avoid re-creating the map when options object reference changes
  // The map is only created once on mount, options changes after that are ignored
  const optionsRef = useRef(options);
  // using a ref in the initial setup so that it doesn't cause a re-run of the effect on change
  const styleRef = useRef(styleUrl);

  // Initialize MapLibre instance once
  useEffect(() => {
    if (deck && !mapRef.current) {
      mapRef.current = new MapLibre({
        ...optionsRef.current,
        style: styleRef.current,
      });

      mapRef.current.once('style.load', () => {
        mapRef.current?.setProjection({ type: 'mercator' });
        mapRef.current?.addControl(deck);
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.removeControl(deck);
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [deck]);

  // Update style when it changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setStyle(styleUrl);
    }
  }, [styleUrl]);

  return mapRef.current;
}
