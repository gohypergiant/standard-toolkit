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
import { uuid } from '@accelint/core';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MapControls } from './controls';
import { MapEvents } from './events';
import type { UniqueId } from '@accelint/core';
import type { RefObject } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import type { RbzHandler } from '@/maplibre/rbz-handler';
import type { MapEventType } from './types';

function makeToggle() {
  return { enable: vi.fn(), disable: vi.fn() };
}

function makeFakes() {
  const scrollZoom = makeToggle();
  const boxZoom = makeToggle();
  const doubleClickZoom = makeToggle();
  const dragPan = makeToggle();
  const map = { scrollZoom, boxZoom, doubleClickZoom, dragPan };
  const mapRef = {
    current: { getMap: () => map },
  } as unknown as RefObject<MapRef | null>;
  const rbz = { startListening: vi.fn(), stopListening: vi.fn() };
  const rbzRef = { current: rbz } as unknown as RefObject<RbzHandler | null>;

  return { scrollZoom, boxZoom, doubleClickZoom, dragPan, mapRef, rbz, rbzRef };
}

type Fakes = ReturnType<typeof makeFakes>;

/**
 * Renders MapControls wired to the fakes and returns the map id it listens
 * for. `boxZoom` is forwarded as given, so omitting it exercises the default.
 */
function renderControls(fakes: Fakes, boxZoom?: boolean): UniqueId {
  const id = uuid();

  render(
    <MapControls
      id={id}
      mapRef={fakes.mapRef}
      rbzRef={fakes.rbzRef}
      boxZoom={boxZoom}
    />,
  );

  return id;
}

function emitControl(
  type: 'enableZoom' | 'disableZoom' | 'enablePan' | 'disablePan',
  id: UniqueId,
): void {
  act(() => {
    Broadcast.getInstance<MapEventType>().emit(MapEvents[type], { id });
  });
}

describe('MapControls zoom suppression', () => {
  it('disables scroll and box zoom and stops RBZ listening on disableZoom', () => {
    const fakes = makeFakes();
    const id = renderControls(fakes);

    emitControl('disableZoom', id);

    expect(fakes.scrollZoom.disable).toHaveBeenCalledTimes(1);
    expect(fakes.boxZoom.disable).toHaveBeenCalledTimes(1);
    expect(fakes.rbz.stopListening).toHaveBeenCalledTimes(1);
    expect(fakes.doubleClickZoom.disable).not.toHaveBeenCalled();
  });

  it('restores scroll zoom and RBZ listening but leaves box zoom off when it is configured off', () => {
    const fakes = makeFakes();
    const id = renderControls(fakes, false);

    emitControl('disableZoom', id);
    emitControl('enableZoom', id);

    expect(fakes.scrollZoom.enable).toHaveBeenCalledTimes(1);
    expect(fakes.rbz.startListening).toHaveBeenCalledTimes(1);
    expect(fakes.boxZoom.enable).not.toHaveBeenCalled();
    expect(fakes.doubleClickZoom.enable).not.toHaveBeenCalled();
  });

  it('restores box zoom on enableZoom when it is configured on', () => {
    const fakes = makeFakes();
    const id = renderControls(fakes, true);

    emitControl('disableZoom', id);
    emitControl('enableZoom', id);

    expect(fakes.boxZoom.enable).toHaveBeenCalledTimes(1);
  });

  it('restores box zoom on enableZoom when the boxZoom prop is omitted', () => {
    const fakes = makeFakes();
    const id = renderControls(fakes);

    emitControl('disableZoom', id);
    emitControl('enableZoom', id);

    expect(fakes.boxZoom.enable).toHaveBeenCalledTimes(1);
  });

  it('ignores zoom events addressed to another map', () => {
    const fakes = makeFakes();
    renderControls(fakes);

    emitControl('disableZoom', uuid());

    expect(fakes.scrollZoom.disable).not.toHaveBeenCalled();
    expect(fakes.rbz.stopListening).not.toHaveBeenCalled();
  });

  it('forwards every disable/enable pair to RBZ when two tools suppress zoom', () => {
    const fakes = makeFakes();
    const id = renderControls(fakes);

    // Last-wins, not refcounted, matching the pan/zoom toggles.
    emitControl('disableZoom', id);
    emitControl('disableZoom', id);
    emitControl('enableZoom', id);
    emitControl('enableZoom', id);

    expect(fakes.rbz.stopListening).toHaveBeenCalledTimes(2);
    expect(fakes.rbz.startListening).toHaveBeenCalledTimes(2);
  });
});

describe('MapControls pan toggling', () => {
  it.each([
    { type: 'disablePan', method: 'disable' },
    { type: 'enablePan', method: 'enable' },
  ] as const)('calls dragPan.$method on $type', ({ type, method }) => {
    const fakes = makeFakes();
    const id = renderControls(fakes);

    emitControl(type, id);

    expect(fakes.dragPan[method]).toHaveBeenCalledTimes(1);
    expect(fakes.scrollZoom[method]).not.toHaveBeenCalled();
  });
});
