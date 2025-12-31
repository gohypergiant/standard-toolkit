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

'use client';

import { useEmit } from '@accelint/bus/react';
import { useEffect, useRef } from 'react';
import { MapEvents } from '../../../base-map/events';
import type { UniqueId } from '@accelint/core';
import type {
  MapDisableZoomEvent,
  MapEnableZoomEvent,
} from '../../../base-map/types';

/**
 * Hook to disable map zoom while Shift key is held during shape operations.
 *
 * This prevents MapLibre's boxZoom (Shift+drag) from interfering with
 * Shift modifier constraints like:
 * - Shift for uniform scaling during edit
 * - Shift for rotation snap during edit
 * - Shift for square constraint during rectangle drawing
 *
 * @param mapId - The map instance ID
 * @param isActive - Whether the hook should be active (e.g., when editing/drawing)
 */
export function useShiftZoomDisable(mapId: UniqueId, isActive: boolean): void {
  const emitDisableZoom = useEmit<MapDisableZoomEvent>(MapEvents.disableZoom);
  const emitEnableZoom = useEmit<MapEnableZoomEvent>(MapEvents.enableZoom);
  const isZoomDisabledRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const disableZoom = () => {
      if (!isZoomDisabledRef.current) {
        isZoomDisabledRef.current = true;
        emitDisableZoom({ id: mapId });
      }
    };

    const enableZoom = () => {
      if (isZoomDisabledRef.current) {
        isZoomDisabledRef.current = false;
        emitEnableZoom({ id: mapId });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        disableZoom();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        enableZoom();
      }
    };

    // Also catch Shift state on mousedown to handle edge cases where
    // keydown might have been missed (e.g., focus issues)
    const handleMouseDown = (event: MouseEvent) => {
      if (event.shiftKey) {
        disableZoom();
      }
    };

    // Re-enable zoom if the window loses focus while Shift is held
    const handleBlur = () => {
      enableZoom();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown, { capture: true });
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown, {
        capture: true,
      });
      window.removeEventListener('blur', handleBlur);

      // Ensure zoom is re-enabled when unmounting
      enableZoom();
    };
  }, [isActive, mapId, emitDisableZoom, emitEnableZoom]);
}
