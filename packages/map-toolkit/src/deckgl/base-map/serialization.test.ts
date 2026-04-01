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

import type { PickingInfo } from '@deck.gl/core';
import type { MjolnirGestureEvent, MjolnirPointerEvent } from 'mjolnir.js';
import { describe, expect, it } from 'vitest';
import { serializeMjolnirEvent, serializePickingInfo } from './serialization';

describe('serializePickingInfo', () => {
  it('should extract layer IDs and omit non-serializable properties', () => {
    const info = {
      color: new Uint8Array([255, 0, 0, 255]),
      coordinate: [0, 0],
      index: 0,
      picked: true,
      x: 100,
      y: 200,
      pixel: [100, 200],
      layer: { id: 'my-layer' },
      sourceLayer: { id: 'my-source-layer' },
      viewport: { id: 'main' },
      object: { name: 'test-feature' },
    } as unknown as PickingInfo;

    const result = serializePickingInfo(info);

    expect(result.layerId).toBe('my-layer');
    expect(result.sourceLayerId).toBe('my-source-layer');
    expect(result).not.toHaveProperty('viewport');
    expect(result).not.toHaveProperty('layer');
    expect(result).not.toHaveProperty('sourceLayer');
    expect(result.object).toStrictEqual({ name: 'test-feature' });
  });

  it('should handle missing layer and sourceLayer', () => {
    const info = {
      color: null,
      index: -1,
      picked: false,
      x: 0,
      y: 0,
      pixel: [0, 0],
      layer: null,
      sourceLayer: null,
      viewport: { id: 'main' },
    } as unknown as PickingInfo;

    const result = serializePickingInfo(info);

    expect(result.layerId).toBeUndefined();
    expect(result.sourceLayerId).toBeUndefined();
    expect(result).not.toHaveProperty('viewport');
  });
});

describe('serializeMjolnirEvent', () => {
  const mockTarget = document.createElement('div');
  const mockRootElement = document.createElement('div');
  // biome-ignore lint/suspicious/noEmptyBlockStatements: stub for non-serializable function properties
  const noop = () => {};

  it('should strip non-serializable properties from pointer events', () => {
    const pointerEvent: MjolnirPointerEvent = {
      type: 'pointermove',
      pointerType: 'mouse',
      center: { x: 100, y: 200 },
      srcEvent: new MouseEvent('mousemove'),
      target: mockTarget,
      rootElement: mockRootElement,
      offsetCenter: { x: 50, y: 100 },
      handled: false,
      stopPropagation: noop,
      stopImmediatePropagation: noop,
      preventDefault: noop,
    };

    const result = serializeMjolnirEvent(pointerEvent);

    expect(result).not.toHaveProperty('stopPropagation');
    expect(result).not.toHaveProperty('stopImmediatePropagation');
    expect(result).not.toHaveProperty('preventDefault');
    expect(result).not.toHaveProperty('srcEvent');
    expect(result).not.toHaveProperty('rootElement');
    expect(result).not.toHaveProperty('target');
    expect(result.type).toBe('pointermove');
    expect(result.center).toStrictEqual({ x: 100, y: 200 });
    expect(result.offsetCenter).toStrictEqual({ x: 50, y: 100 });
  });

  it('should strip changedPointers and pointers from gesture events', () => {
    const gestureEvent = {
      type: 'tap',
      center: { x: 150, y: 250 },
      srcEvent: new MouseEvent('click'),
      target: mockTarget,
      rootElement: mockRootElement,
      offsetCenter: { x: 75, y: 125 },
      handled: false,
      stopPropagation: noop,
      stopImmediatePropagation: noop,
      preventDefault: noop,
      changedPointers: [{ clientX: 0, clientY: 0 }],
      pointers: [{ clientX: 0, clientY: 0 }],
      deltaX: 0,
      deltaY: 0,
      deltaTime: 100,
      distance: 0,
      angle: 0,
      velocityX: 0,
      velocityY: 0,
      velocity: 0,
      direction: 0,
      offsetDirection: 0,
      scale: 1,
      rotation: 0,
      maxPointers: 1,
      pointerType: 'mouse',
      timeStamp: Date.now(),
      overallVelocity: 0,
      overallVelocityX: 0,
      overallVelocityY: 0,
      additionalEvent: '',
      eventType: 0,
    } as unknown as MjolnirGestureEvent;

    const result = serializeMjolnirEvent(gestureEvent);

    expect(result).not.toHaveProperty('changedPointers');
    expect(result).not.toHaveProperty('pointers');
    expect(result).not.toHaveProperty('stopPropagation');
    expect(result).not.toHaveProperty('stopImmediatePropagation');
    expect(result).not.toHaveProperty('preventDefault');
    expect(result).not.toHaveProperty('srcEvent');
    expect(result).not.toHaveProperty('rootElement');
    expect(result).not.toHaveProperty('target');
    expect(result.type).toBe('tap');
    expect(result.center).toStrictEqual({ x: 150, y: 250 });
  });

  it('should preserve serializable data properties on pointer events', () => {
    const pointerEvent: MjolnirPointerEvent = {
      type: 'pointerdown',
      pointerType: 'touch',
      center: { x: 300, y: 400 },
      srcEvent: new MouseEvent('mousedown'),
      target: mockTarget,
      rootElement: mockRootElement,
      offsetCenter: { x: 150, y: 200 },
      leftButton: true,
      rightButton: false,
      middleButton: false,
      handled: true,
      stopPropagation: noop,
      stopImmediatePropagation: noop,
      preventDefault: noop,
    };

    const result = serializeMjolnirEvent(pointerEvent);

    expect(result.pointerType).toBe('touch');
    expect(result.leftButton).toBe(true);
    expect(result.rightButton).toBe(false);
    expect(result.handled).toBe(true);
  });
});
