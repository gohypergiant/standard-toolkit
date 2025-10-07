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

import { render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Broadcast } from '@/broadcast';
import { useEmit, useOn } from './';
import type { Payload } from '../broadcast/types';

type FooEvent = Payload<'foo', { foo: boolean }>;
type BarEvent = Payload<'bar', { bar: boolean }>;
type Events = FooEvent | BarEvent;

const bus = Broadcast.getInstance<Events>();

describe('useOn', () => {
  it('should call callback when event is emitted', () => {
    const callback = vi.fn();

    renderHook(() => useOn<Events>('foo', callback));

    expect(callback).not.toHaveBeenCalled();

    bus.emit('foo', { foo: true });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith({
      type: 'foo',
      payload: { foo: true },
      source: bus.id,
    });
  });
});

describe('useEmit', () => {
  it('should emit event', () => {
    const callback = vi.fn();

    const off = bus.on('bar', callback);

    const { result } = renderHook(() => useEmit<Events>('bar'));

    result.current({ bar: true });

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith({
      type: 'bar',
      payload: { bar: true },
      source: bus.id,
    });

    off();
  });

  it('should throw during render', () => {
    function Test() {
      const emit = useEmit<Events>('bar');

      emit({ foo: true });

      return null;
    }

    expect(() => render(<Test />)).toThrow();
  });
});
