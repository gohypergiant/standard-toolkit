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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mockBroadcastChannel,
  resetMockBroadcastChannel,
} from 'vitest-broadcast-channel-mock';
import { Broadcast } from './index';

describe('broadcast', () => {
  beforeEach(() => {
    mockBroadcastChannel();
  });

  afterEach(() => {
    resetMockBroadcastChannel();
  });

  it('on', () => {
    const bus = Broadcast.getInstance();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.emit('test', 'test');

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith({
      payload: 'test',
      type: 'test',
    });
    expect(bus.getEvents()).toContain('test');
  });

  it('once', () => {
    const bus = Broadcast.getInstance();
    const fn = vi.fn();

    bus.once('test', fn);
    bus.emit('test', 'test');
    bus.emit('test', 'test');
    bus.emit('test', 'test');

    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith({
      payload: 'test',
      type: 'test',
    });
    expect(bus.getEvents()).not.toContain('test');
  });

  it('off', () => {
    const bus = Broadcast.getInstance();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.off('test', fn);
    bus.emit('test', 'test');

    expect(fn).not.toHaveBeenCalled();
    expect(bus.getEvents()).toContain('test');
  });

  it('destroy', () => {
    const bus = Broadcast.getInstance();
    const fn = vi.fn();

    bus.on('test', fn);
    bus.destroy();
    bus.emit('test', 'test');

    expect(fn).not.toHaveBeenCalled();
    expect(bus.getEvents()).toEqual([]);
  });
});
