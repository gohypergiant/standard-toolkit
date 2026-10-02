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

function makeFakes(rbzListening = true) {
  const scrollZoom = makeToggle();
  const boxZoom = makeToggle();
  const doubleClickZoom = makeToggle();
  const dragPan = makeToggle();
  const map = { scrollZoom, boxZoom, doubleClickZoom, dragPan };
  const mapRef = {
    current: { getMap: () => map },
  } as unknown as RefObject<MapRef | null>;
  const rbz = {
    disable: vi.fn(),
    startListening: vi.fn(),
    stopListening: vi.fn(),
    isListening: vi.fn(() => rbzListening),
  };
  const rbzRef = { current: rbz } as unknown as RefObject<RbzHandler | null>;

  return { scrollZoom, boxZoom, doubleClickZoom, dragPan, mapRef, rbz, rbzRef };
}

function emitZoom(type: 'enableZoom' | 'disableZoom', id: UniqueId): void {
  act(() => {
    Broadcast.getInstance<MapEventType>().emit(MapEvents[type], { id });
  });
}

describe('MapControls zoom suppression', () => {
  it('disables scroll and box zoom and stops RBZ listening on disableZoom', () => {
    const id = uuid();
    const fakes = makeFakes();
    render(
      <MapControls
        id={id}
        mapRef={fakes.mapRef}
        rbzRef={fakes.rbzRef}
        boxZoom={false}
      />,
    );

    emitZoom('disableZoom', id);

    expect(fakes.scrollZoom.disable).toHaveBeenCalledTimes(1);
    expect(fakes.boxZoom.disable).toHaveBeenCalledTimes(1);
    expect(fakes.rbz.stopListening).toHaveBeenCalledTimes(1);
    expect(fakes.doubleClickZoom.disable).not.toHaveBeenCalled();
  });

  it('restores scroll zoom and RBZ listening but leaves box zoom off when it is configured off', () => {
    const id = uuid();
    const fakes = makeFakes();
    render(
      <MapControls
        id={id}
        mapRef={fakes.mapRef}
        rbzRef={fakes.rbzRef}
        boxZoom={false}
      />,
    );

    emitZoom('disableZoom', id);
    emitZoom('enableZoom', id);

    expect(fakes.scrollZoom.enable).toHaveBeenCalledTimes(1);
    expect(fakes.rbz.startListening).toHaveBeenCalledTimes(1);
    expect(fakes.boxZoom.enable).not.toHaveBeenCalled();
    expect(fakes.doubleClickZoom.enable).not.toHaveBeenCalled();
  });

  it('restores box zoom on enableZoom when it is configured on', () => {
    const id = uuid();
    const fakes = makeFakes(false);
    render(
      <MapControls
        id={id}
        mapRef={fakes.mapRef}
        rbzRef={fakes.rbzRef}
        boxZoom={true}
      />,
    );

    emitZoom('disableZoom', id);
    emitZoom('enableZoom', id);

    expect(fakes.boxZoom.enable).toHaveBeenCalledTimes(1);
  });

  it('does not restart RBZ listening when it was not listening at disable time', () => {
    const id = uuid();
    const fakes = makeFakes(false);
    render(
      <MapControls
        id={id}
        mapRef={fakes.mapRef}
        rbzRef={fakes.rbzRef}
        boxZoom={false}
      />,
    );

    emitZoom('disableZoom', id);
    emitZoom('enableZoom', id);

    expect(fakes.rbz.stopListening).not.toHaveBeenCalled();
    expect(fakes.rbz.startListening).not.toHaveBeenCalled();
  });

  it('ignores zoom events addressed to another map', () => {
    const id = uuid();
    const fakes = makeFakes();
    render(
      <MapControls
        id={id}
        mapRef={fakes.mapRef}
        rbzRef={fakes.rbzRef}
        boxZoom={false}
      />,
    );

    emitZoom('disableZoom', uuid());

    expect(fakes.scrollZoom.disable).not.toHaveBeenCalled();
    expect(fakes.rbz.stopListening).not.toHaveBeenCalled();
  });
});
