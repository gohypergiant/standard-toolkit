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

import { uuid } from '@accelint/core';
import {
  mockBroadcastChannel,
  resetMockBroadcastChannel,
} from '@accelint/vitest-config/mocks/broadcast-channel';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Broadcast } from './index';
import type { StructuredCloneable } from 'type-fest';
import type { Payload } from './types';

describe('broadcast', () => {
  beforeEach(() => {
    mockBroadcastChannel();

    // Make sure to completely reset instance between tests
    Broadcast.getInstance().destroy();
  });

  afterEach(() => {
    resetMockBroadcastChannel();
  });

  it('sets channel name from config', () => {
    const bus = new Broadcast({ channelName: 'custom-channel' });
    // @ts-expect-error Accessing protected property
    expect(bus.channelName).toBe('custom-channel');
  });

  it('onmessage', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();
    // @ts-expect-error Accessing protected property
    bus.handleListeners = fn;

    // Simulate an error event
    const event = new MessageEvent('message', {
      data: 'test',
    });

    // @ts-expect-error Accessing protected property
    bus.channel.onmessage(event);

    expect(fn).toHaveBeenCalled();
  });

  it('onmessageerror', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const consoleMock = vi.spyOn(console, 'error');

    // Simulate an error event
    const event = new MessageEvent('message', {
      data: 'test',
    });

    // @ts-expect-error Accessing protected property
    bus.channel.onmessageerror(event);

    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenCalledWith(
      'BroadcastChannel message error',
      event,
    );
  });

  it('setEventEmitOptions', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();

    bus.setEventEmitOptions('test', { target: 'self' });
    expect(
      // @ts-expect-error Accessing protected property
      bus.emitOptions.get('test'),
    ).toEqual({ target: 'self' });

    bus.setEventEmitOptions('test', null);
    expect(
      // @ts-expect-error Accessing protected property
      bus.emitOptions.get('test'),
    ).toBeUndefined();
  });

  it('setEventsEmitOptions', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();

    bus.setEventsEmitOptions(new Map([['test', { target: 'self' }]]));
    expect(
      // @ts-expect-error Accessing protected property
      bus.emitOptions.get('test'),
    ).toEqual({ target: 'self' });
  });

  it('setGlobalEmitOptions', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();

    bus.setGlobalEmitOptions({ target: 'self' });
    expect(
      // @ts-expect-error Accessing protected property
      bus.emitOptions.get(bus.id),
    ).toEqual({ target: 'self' });
  });

  it('on', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'test');

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith({
      type: 'test',
      payload: 'test',
      source: bus.id,
    });
  });

  it('once', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.once('test', fn);
    bus.emit('test', 'test');
    bus.emit('test', 'test');
    bus.emit('test', 'test');

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith({
      type: 'test',
      payload: 'test',
      source: bus.id,
    });
  });

  it('on & once', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const on = vi.fn();
    const once = vi.fn();

    bus.on('test', on);
    bus.once('test', once);

    bus.emit('test', 'A');
    bus.emit('test', 'B');
    bus.emit('test', 'C');

    expect(on).toHaveBeenCalledTimes(3);
    expect(on).toHaveBeenNthCalledWith(1, {
      type: 'test',
      payload: 'A',
      source: bus.id,
    });
    expect(on).toHaveBeenNthCalledWith(2, {
      type: 'test',
      payload: 'B',
      source: bus.id,
    });
    expect(on).toHaveBeenNthCalledWith(3, {
      type: 'test',
      payload: 'C',
      source: bus.id,
    });

    expect(once).toHaveBeenCalledOnce();
    expect(once).toHaveBeenCalledWith({
      type: 'test',
      payload: 'A',
      source: bus.id,
    });
  });

  it('off', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.off('test', fn);
    bus.emit('test', 'test');

    expect(fn).not.toHaveBeenCalled();
  });

  it('deleteEvent', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.deleteEvent('test');
    bus.emit('test', 'test');

    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.destroy();
    bus.emit('test', 'test');

    expect(fn).not.toHaveBeenCalled();
  });

  it('should deliver to all', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'all', { target: 'all' });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      type: 'test',
      payload: 'all',
      source: bus.id,
    });
  });

  it('should deliver to self', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'self', { target: 'self' });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      type: 'test',
      payload: 'self',
      source: bus.id,
      target: bus.id,
    });
  });

  it('should deliver to others', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'echo', { target: 'others' });

    expect(fn).not.toHaveBeenCalled();
  });

  it('should default to all as target audience', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'default');

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      type: 'test',
      payload: 'default',
      source: bus.id,
    });
  });

  it('should deliver to specific target', () => {
    const bus = Broadcast.getInstance<Payload<'test', string>>();
    const fn = vi.fn();
    const target = uuid();

    bus.on('test', fn);
    bus.emit('test', 'test', { target });

    expect(fn).not.toHaveBeenCalled();

    // @ts-expect-error Accessing protected property
    expect(bus.channel.postMessage).toHaveBeenCalledWith({
      type: 'test',
      payload: 'test',
      source: bus.id,
      target,
    });
  });

  it.for([
    [''],
    [new Boolean(1)],
    [null],
    [undefined],
    [true],
    [1],
    [BigInt(9007199254740991)],
    [Number.NaN],
    [Number.POSITIVE_INFINITY],
    [[]],
    [new ArrayBuffer(8)],
    [new DataView(new ArrayBuffer(8))],
    [new Date('2025-01-01T00:00:00.000Z')],
    [/ab+c/i],
    [new Error('Test error')],
    [
      new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]),
    ],
    [new Set([1, 2, 3])],
    [new Uint8Array([1, 2, 3, 4])],
    [{}],
    [{ nested: { deeply: { value: 42 } } }],
  ])('should serialize %s correctly', ([testValue]) => {
    const bus =
      Broadcast.getInstance<
        Payload<'test', Exclude<StructuredCloneable, undefined>>
      >();

    let returnedData = {};
    const fn = vi.fn().mockImplementation((data) => {
      returnedData = data;
    });

    const payload = {
      type: 'test',
      value: testValue,
    };

    bus.on('test', fn);
    bus.emit('test', payload);

    expect(fn).toHaveBeenCalled();
    expect(returnedData).toStrictEqual({
      type: 'test',
      payload: payload,
      source: bus.id,
      target: undefined,
    });
  });
});
