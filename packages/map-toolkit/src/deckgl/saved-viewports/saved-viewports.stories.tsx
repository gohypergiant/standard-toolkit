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

import { Broadcast } from '@accelint/bus';
import { useOn } from '@accelint/bus/react';
import { uuid } from '@accelint/core';
import {
  globalBind,
  type KeyCombination,
  Keycode,
  keyToId,
  keyToString,
} from '@accelint/hotkey-manager';
import { useCallback, useEffect, useState } from 'react';
import { CameraEventTypes } from '../../camera/events';
import { BaseMap as BaseMapComponent } from '../base-map';
import { MapEvents } from '../base-map/events';
import { createSavedViewport } from '../saved-viewports';
import { STORAGE_ID } from '../saved-viewports/storage';
import type { MapViewState } from '@deck.gl/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CameraEvent } from '../../camera/types';
import type { MapViewportEvent, MapViewportPayload } from '../base-map/types';

const meta: Meta = {
  title: 'DeckGL/Saved Viewports',
};

export default meta;
type Story = StoryObj<typeof meta>;
const SAVED_VIEWPORTS_STORY_ID = uuid();

/* Example component that uses the saved viewports functionality */
globalBind();
// Track current viewport (replace with more robust state management as needed)
const cameraBus = Broadcast.getInstance<CameraEvent>();
let currentViewport: MapViewportPayload;
const getCurrentViewport = () => currentViewport;
const setCurrentViewport = (newState: MapViewState) => {
  currentViewport = {
    ...currentViewport,
    ...newState,
  };
  // Emit camera event to actually move the map
  cameraBus.emit(CameraEventTypes.setCenter, {
    id: SAVED_VIEWPORTS_STORY_ID,
    latitude: newState.latitude ?? currentViewport.latitude,
    longitude: newState.longitude ?? currentViewport.longitude,
    zoom: newState.zoom,
  });
};

const DIGIT_KEYS: KeyCombination[] = [
  {
    id: '',
    code: Keycode.Digit0,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit1,
    alt: false,
    ctrl: false,
    shift: true,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit2,
    alt: false,
    ctrl: false,
    shift: true,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit3,
    alt: false,
    ctrl: false,
    shift: true,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit4,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit5,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit6,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit7,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit8,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
  {
    id: '',
    code: Keycode.Digit9,
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
    autoMacStyle: false,
  },
];

type NonEmptyArray<T> = [T, ...T[]];

const useSavedViewportHotkey = createSavedViewport({
  threshold: 1000,
  getCurrentViewport,
  setCurrentViewport,
  key: DIGIT_KEYS as NonEmptyArray<KeyCombination>,
});

const getSlotIndex = (e: KeyboardEvent) => {
  const matchKey: KeyCombination = {
    id: e.key,
    code: e.code as Keycode,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey,
    autoMacStyle: false,
  };
  return DIGIT_KEYS.findIndex((key) => {
    return keyToString(key) === keyToString(matchKey);
  });
};

function ViewportsToolbar() {
  useSavedViewportHotkey();
  const [savedViewports, setSavedViewports] = useState<
    Record<string, MapViewState>
  >({});
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const getViewPort = (key: KeyCombination) => {
    const storageKey = keyToId(key);
    return savedViewports[storageKey];
  };

  const loadViewports = useCallback(() => {
    const savedViewportsJson = localStorage.getItem(STORAGE_ID) ?? '{}';
    setSavedViewports(JSON.parse(savedViewportsJson));
  }, []);

  const clearAllViewports = () => {
    localStorage.removeItem(STORAGE_ID);
    setSavedViewports({});
    setActiveSlot(null);
  };

  // Listen for viewport changes to clear active slot indicator
  useOn<MapViewportEvent>(MapEvents.viewport, (event) => {
    const newState = {
      ...currentViewport,
      ...event.payload,
    };
    currentViewport = newState;
    setActiveSlot(null);
  });

  useEffect(() => {
    loadViewports();

    // Listen for viewport restoration events
    const handleKeyUp = (e: KeyboardEvent) => {
      const slotIndex = getSlotIndex(e);
      if (slotIndex === -1) {
        return;
      }
      loadViewports();
      setActiveSlot(slotIndex);
    };

    // Listen for save events (hold key)
    const handleKeyDown = (e: KeyboardEvent) => {
      const slotIndex = getSlotIndex(e);
      if (slotIndex !== -1) {
        // Debounce viewport reload during hold
        const timeout = setTimeout(() => loadViewports(), 100);
        return () => clearTimeout(timeout);
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loadViewports]);

  const hasSavedViewports = Object.keys(savedViewports).length > 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        gap: '2px',
        padding: '8px',
        zIndex: 1000,
      }}
    >
      {DIGIT_KEYS.map((key, index) => {
        const viewport = getViewPort(key);
        const hasViewport = viewport !== undefined;
        const isActive = activeSlot === index;

        return (
          <div
            key={key.code}
            style={{
              flex: 1,
              backgroundColor: hasViewport
                ? 'rgba(34, 197, 94, 0.2)'
                : 'rgba(255, 255, 255, 0.1)',
              border: isActive
                ? '2px solid rgba(59, 130, 246, 1)'
                : hasViewport
                  ? '1px solid rgba(34, 197, 94, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              padding: '8px',
              color: 'white',
              fontSize: '11px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              Slot {index}
              {isActive && (
                <span
                  style={{
                    marginLeft: '4px',
                    color: 'rgba(59, 130, 246, 1)',
                    fontSize: '10px',
                  }}
                >
                  ✓ Active
                </span>
              )}
            </div>
            {hasViewport ? (
              <div style={{ fontSize: '10px', lineHeight: '1.3' }}>
                <div>Lat: {viewport.latitude?.toFixed(4)}</div>
                <div>Lng: {viewport.longitude?.toFixed(4)}</div>
                <div>Zoom: {viewport.zoom?.toFixed(2)}</div>
              </div>
            ) : (
              <div
                style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {`Press and hold ${keyToString(key)} to save
                viewport`}
              </div>
            )}
          </div>
        );
      })}
      {hasSavedViewports && (
        <button
          type='button'
          onClick={clearAllViewports}
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '4px',
            padding: '8px',
            color: 'white',
            fontSize: '11px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}

export const SavedViewports: Story = {
  render: () => {
    return (
      <>
        <ViewportsToolbar />
        <BaseMapComponent
          className='h-dvh w-dvw'
          id={SAVED_VIEWPORTS_STORY_ID}
        />
      </>
    );
  },
};
