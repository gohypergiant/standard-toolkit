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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  useSSEStream: vi.fn(),
  useSSEStreams: vi.fn(),
}));

vi.mock('@accelint/stream/react', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@accelint/stream/react')>();

  return {
    ...actual,
    useSSEStream: mocks.useSSEStream,
    useSSEStreams: mocks.useSSEStreams,
  };
});

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}));

vi.mock('@accelint/stream-devtools/react', () => ({
  streamDevtoolsPlugin: {},
}));

import { StreamExampleClient } from './client';

type MockEventRow = {
  key: string;
  firedAt: number;
  datasetId: 'tracks' | 'ships' | 'vehicles';
  name: string;
  entities: {
    id: string;
    callsign: string;
    coordinates: [number, number];
    speedKts: number;
    headingDeg: number;
  }[];
};

type MockMergedFeed = {
  rows: MockEventRow[];
  statuses: {
    id: 'tracks' | 'ships' | 'vehicles';
    status: 'connected' | 'connecting' | 'error' | 'disconnected';
    messageCount: number;
  }[];
};

function createRow(index: number, name: string): MockEventRow {
  return {
    key: `tracks:${index}`,
    firedAt: 1_700_000_000_000 + index,
    datasetId: 'tracks',
    name,
    entities: [
      {
        id: `entity-${index}`,
        callsign: `ALPHA-${index}`,
        coordinates: [-77.0365, 38.8977],
        speedKts: 24,
        headingDeg: 90,
      },
    ],
  };
}

function createMergedFeed(rows: MockEventRow[]): MockMergedFeed {
  return {
    rows,
    statuses: [
      { id: 'tracks', status: 'connected', messageCount: rows.length },
      { id: 'ships', status: 'connected', messageCount: 0 },
      { id: 'vehicles', status: 'connected', messageCount: 0 },
    ],
  };
}

describe('StreamExampleClient', () => {
  let mergedFeed: MockMergedFeed;

  beforeEach(() => {
    mergedFeed = createMergedFeed([
      createRow(2, 'Boarding'),
      createRow(1, 'Departure'),
    ]);

    mocks.useSSEStream.mockReturnValue({
      data: undefined,
      status: 'connected',
      messages: [],
    });

    mocks.useSSEStreams.mockImplementation(() => mergedFeed);
  });

  it('should freeze the rendered rows while a row is expanded and report new arrivals', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<StreamExampleClient />);

    await user.click(screen.getByRole('button', { name: /boarding/i }));

    expect(
      screen.getByRole('heading', { name: 'ALPHA-2', level: 3 }),
    ).toBeInTheDocument();

    // a new event arrives while the row is open
    mergedFeed = createMergedFeed([
      createRow(3, 'Handoff'),
      createRow(2, 'Boarding'),
      createRow(1, 'Departure'),
    ]);

    rerender(<StreamExampleClient />);

    // the pinned view does not shift: the new row is withheld and counted
    expect(
      screen.queryByRole('button', { name: /handoff/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Feed paused - show 1 new event' }),
    ).toBeInTheDocument();
  });

  it('should resume the live feed when the last expanded row collapses', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<StreamExampleClient />);

    await user.click(screen.getByRole('button', { name: /boarding/i }));

    mergedFeed = createMergedFeed([
      createRow(3, 'Handoff'),
      createRow(2, 'Boarding'),
      createRow(1, 'Departure'),
    ]);

    rerender(<StreamExampleClient />);

    await user.click(screen.getByRole('button', { name: /boarding/i }));

    // released: the withheld row renders and the paused button clears
    expect(
      screen.getByRole('button', { name: /handoff/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /feed paused/i }),
    ).not.toBeInTheDocument();
  });

  it('should collapse everything and resume when the paused button is pressed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<StreamExampleClient />);

    await user.click(screen.getByRole('button', { name: /boarding/i }));

    expect(
      screen.getByRole('heading', { name: 'ALPHA-2', level: 3 }),
    ).toBeInTheDocument();

    mergedFeed = createMergedFeed([
      createRow(3, 'Handoff'),
      createRow(2, 'Boarding'),
      createRow(1, 'Departure'),
    ]);

    rerender(<StreamExampleClient />);

    await user.click(screen.getByRole('button', { name: /feed paused/i }));

    // one press collapses the open row and resumes the live feed
    expect(
      screen.getByRole('button', { name: /handoff/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'ALPHA-2', level: 3 }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /feed paused/i }),
    ).not.toBeInTheDocument();
  });
});
