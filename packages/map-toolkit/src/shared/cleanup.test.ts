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

import { type UniqueId, uuid } from '@accelint/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cameraStore from '../camera/store';
import * as cursorCoordinatesStore from '../cursor-coordinates/store';
import * as displayShapeStore from '../deckgl/shapes/display-shape-layer/store';
import * as drawShapeStore from '../deckgl/shapes/draw-shape-layer/store';
import * as editShapeStore from '../deckgl/shapes/edit-shape-layer/store';
import * as mapCursorStore from '../map-cursor/store';
import * as mapModeStore from '../map-mode/store';
import * as viewportStore from '../viewport/store';
import { clearAllMapStores } from './cleanup';

describe('clearAllMapStores', () => {
  let testId: UniqueId;

  beforeEach(() => {
    testId = uuid();
  });

  it('calls all store cleanup functions', () => {
    // Spy on all cleanup functions
    const clearCameraSpy = vi.spyOn(cameraStore, 'clearCameraState');
    const clearCursorCoordinatesSpy = vi.spyOn(
      cursorCoordinatesStore,
      'clearCursorCoordinateState',
    );
    const clearSelectionSpy = vi.spyOn(
      displayShapeStore,
      'clearSelectionState',
    );
    const clearDrawingSpy = vi.spyOn(drawShapeStore, 'clearDrawingState');
    const clearEditingSpy = vi.spyOn(editShapeStore, 'clearEditingState');
    const clearCursorSpy = vi.spyOn(mapCursorStore, 'clearCursorState');
    const clearMapModeSpy = vi.spyOn(mapModeStore, 'clearMapModeState');
    const clearViewportSpy = vi.spyOn(viewportStore, 'clearViewportState');

    // Arrange: Initialize stores to create state
    cameraStore.cameraStore.get(testId);
    mapModeStore.modeStore.get(testId);

    // Verify state exists
    expect(cameraStore.cameraStore.exists(testId)).toBe(true);
    expect(mapModeStore.modeStore.exists(testId)).toBe(true);

    // Act: Clear all stores
    clearAllMapStores(testId);

    // Assert: State is actually cleared
    expect(cameraStore.cameraStore.exists(testId)).toBe(false);
    expect(mapModeStore.modeStore.exists(testId)).toBe(false);

    // Verify all cleanup functions were called with correct mapId
    expect(clearCameraSpy).toHaveBeenCalledWith(testId);
    expect(clearCursorCoordinatesSpy).toHaveBeenCalledWith(testId);
    expect(clearSelectionSpy).toHaveBeenCalledWith(testId);
    expect(clearDrawingSpy).toHaveBeenCalledWith(testId);
    expect(clearEditingSpy).toHaveBeenCalledWith(testId);
    expect(clearCursorSpy).toHaveBeenCalledWith(testId);
    expect(clearMapModeSpy).toHaveBeenCalledWith(testId);
    expect(clearViewportSpy).toHaveBeenCalledWith(testId);

    // Verify each was called exactly once
    expect(clearCameraSpy).toHaveBeenCalledTimes(1);
    expect(clearCursorCoordinatesSpy).toHaveBeenCalledTimes(1);
    expect(clearSelectionSpy).toHaveBeenCalledTimes(1);
    expect(clearDrawingSpy).toHaveBeenCalledTimes(1);
    expect(clearEditingSpy).toHaveBeenCalledTimes(1);
    expect(clearCursorSpy).toHaveBeenCalledTimes(1);
    expect(clearMapModeSpy).toHaveBeenCalledTimes(1);
    expect(clearViewportSpy).toHaveBeenCalledTimes(1);
  });

  it('stops cleanup if a store cleanup throws', () => {
    // clearMapModeState is called first in the cleanup order
    const clearMapModeSpy = vi
      .spyOn(mapModeStore, 'clearMapModeState')
      .mockImplementation(() => {
        throw new Error('Cleanup failed');
      });

    // clearCursorState is called second (after clearMapModeState)
    const clearCursorSpy = vi.spyOn(mapCursorStore, 'clearCursorState');

    // Should throw because clearMapModeState throws
    expect(() => clearAllMapStores(testId)).toThrow('Cleanup failed');

    // clearMapModeState should have been called (and threw)
    expect(clearMapModeSpy).toHaveBeenCalledWith(testId);

    // Subsequent cleanup functions won't be called due to the exception
    expect(clearCursorSpy).not.toHaveBeenCalled();
  });
});
