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

import { uuid } from '@accelint/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { measurementStore } from './store';
import type { UniqueId } from '@accelint/core';

describe('measurementStore', () => {
  let mapId: UniqueId;

  beforeEach(() => {
    mapId = uuid();
  });

  afterEach(() => {
    measurementStore.clear(mapId);
  });

  describe('default state', () => {
    it('initializes with null points and isMeasuring false', () => {
      const state = measurementStore.get(mapId);

      expect(state.pointA).toBe(null);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('start action', () => {
    it('sets pointA and marks isMeasuring true', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(true);
    });

    it('resets pointB when starting a new measurement', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.start([5, 5]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([5, 5]);
      expect(state.pointB).toBe(null);
    });
  });

  describe('updateEnd action', () => {
    it('sets pointB without changing pointA or isMeasuring', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toEqual([11, 21]);
      expect(state.isMeasuring).toBe(true);
    });
  });

  describe('complete action', () => {
    it('sets isMeasuring to false while preserving pointA and pointB', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.complete();

      const state = measurementStore.get(mapId);

      expect(state.pointA).toEqual([10, 20]);
      expect(state.pointB).toEqual([11, 21]);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('clear action', () => {
    it('resets all state to defaults', () => {
      const actions = measurementStore.actions(mapId);
      actions.start([10, 20]);
      actions.updateEnd([11, 21]);
      actions.complete();
      actions.clear();

      const state = measurementStore.get(mapId);

      expect(state.pointA).toBe(null);
      expect(state.pointB).toBe(null);
      expect(state.isMeasuring).toBe(false);
    });
  });

  describe('multi-instance isolation', () => {
    it('keeps state isolated between different map IDs', () => {
      const mapId2 = uuid();

      try {
        const actions1 = measurementStore.actions(mapId);
        const actions2 = measurementStore.actions(mapId2);

        actions1.start([10, 20]);
        actions2.start([30, 40]);
        actions2.updateEnd([31, 41]);

        const state1 = measurementStore.get(mapId);
        const state2 = measurementStore.get(mapId2);

        expect(state1.pointA).toEqual([10, 20]);
        expect(state1.pointB).toBe(null);
        expect(state2.pointA).toEqual([30, 40]);
        expect(state2.pointB).toEqual([31, 41]);
      } finally {
        measurementStore.clear(mapId2);
      }
    });
  });
});
