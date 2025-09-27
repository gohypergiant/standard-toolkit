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
import { INITIAL_VIEW_STATE } from '../constants';

const mapOptions: MapOptions = {
  container: 'maplibre',
  center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
  zoom: INITIAL_VIEW_STATE.zoom,
  doubleClickZoom: false,
  dragRotate: false,
  pitchWithRotate: false,
  rollEnabled: false,
};

export function useMapLibre(deck: IControl | null, styleUrl: string) {
  const mapRef = useRef<MapLibre | null>(null);
  // using a ref in the initial setup so that it doesn't cause a re-run of the effect on change
  const styleRef = useRef(styleUrl);

  // Initialize MapLibre instance once
  useEffect(() => {
    if (deck && !mapRef.current) {
      mapRef.current = new MapLibre({
        ...mapOptions,
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
