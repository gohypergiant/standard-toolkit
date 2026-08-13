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

import { Broadcast } from '@accelint/bus';
import { describe, expect, it, vi } from 'vitest';
import { MapCursorEvents } from '@/map-cursor/events';
import { cursorStore } from '@/map-cursor/store';
import { MapModeEvents } from '@/map-mode/events';
import {
  releaseCursor,
  releaseMode,
  releaseModeAndCursor,
  requestCursorChange,
  requestModeAndCursor,
  requestModeChange,
} from './mode-utils';
import type { UniqueId } from '@accelint/core';
import type { MapCursorEventType } from '@/map-cursor/types';
import type { MapModeEventType } from '@/map-mode/types';

const mapModeBus = Broadcast.getInstance<MapModeEventType>();
const mapCursorBus = Broadcast.getInstance<MapCursorEventType>();

const mapId = 'test-map' as UniqueId;
const owner = 'test-owner';

describe('mode-utils', () => {
  describe('requestModeChange', () => {
    it('should emit a mode change request with the correct payload', () => {
      const spy = vi.fn();
      mapModeBus.on(MapModeEvents.changeRequest, spy);

      requestModeChange(mapId, 'draw', owner);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'draw',
            owner,
            id: mapId,
          }),
        }),
      );

      mapModeBus.off(MapModeEvents.changeRequest, spy);
    });
  });

  describe('releaseMode', () => {
    it('should emit a mode change request with "default" mode', () => {
      const spy = vi.fn();
      mapModeBus.on(MapModeEvents.changeRequest, spy);

      releaseMode(mapId, owner);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'default',
            owner,
            id: mapId,
          }),
        }),
      );

      mapModeBus.off(MapModeEvents.changeRequest, spy);
    });
  });

  describe('requestCursorChange', () => {
    it('should emit a cursor change request with the correct payload', () => {
      const spy = vi.fn();
      mapCursorBus.on(MapCursorEvents.changeRequest, spy);

      requestCursorChange(mapId, 'pointer', owner);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            cursor: 'pointer',
            owner,
            id: mapId,
          }),
        }),
      );

      mapCursorBus.off(MapCursorEvents.changeRequest, spy);
    });
  });

  describe('releaseCursor', () => {
    it('should call cursorStore clearCursor with the owner', () => {
      const clearCursorSpy = vi.fn();
      const actionsSpy = vi
        .spyOn(cursorStore, 'actions')
        .mockReturnValue({ clearCursor: clearCursorSpy } as never);

      releaseCursor(mapId, owner);

      expect(actionsSpy).toHaveBeenCalledWith(mapId);
      expect(clearCursorSpy).toHaveBeenCalledWith(owner);

      actionsSpy.mockRestore();
    });
  });

  describe('requestModeAndCursor', () => {
    it('should emit both mode and cursor change requests', () => {
      const modeSpy = vi.fn();
      const cursorSpy = vi.fn();
      mapModeBus.on(MapModeEvents.changeRequest, modeSpy);
      mapCursorBus.on(MapCursorEvents.changeRequest, cursorSpy);

      requestModeAndCursor(mapId, 'edit', 'crosshair', owner);

      expect(modeSpy).toHaveBeenCalledOnce();
      expect(modeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'edit',
            owner,
            id: mapId,
          }),
        }),
      );

      expect(cursorSpy).toHaveBeenCalledOnce();
      expect(cursorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            cursor: 'crosshair',
            owner,
            id: mapId,
          }),
        }),
      );

      mapModeBus.off(MapModeEvents.changeRequest, modeSpy);
      mapCursorBus.off(MapCursorEvents.changeRequest, cursorSpy);
    });
  });

  describe('releaseModeAndCursor', () => {
    it('should release both mode and cursor', () => {
      const modeSpy = vi.fn();
      mapModeBus.on(MapModeEvents.changeRequest, modeSpy);

      const clearCursorSpy = vi.fn();
      const actionsSpy = vi
        .spyOn(cursorStore, 'actions')
        .mockReturnValue({ clearCursor: clearCursorSpy } as never);

      releaseModeAndCursor(mapId, owner);

      expect(modeSpy).toHaveBeenCalledOnce();
      expect(modeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            desiredMode: 'default',
            owner,
            id: mapId,
          }),
        }),
      );

      expect(actionsSpy).toHaveBeenCalledWith(mapId);
      expect(clearCursorSpy).toHaveBeenCalledWith(owner);

      mapModeBus.off(MapModeEvents.changeRequest, modeSpy);
      actionsSpy.mockRestore();
    });
  });
});
