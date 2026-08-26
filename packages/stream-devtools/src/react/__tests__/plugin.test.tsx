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

/** @jsxImportSource react */
/** @vitest-environment jsdom */

import { StreamClient, StreamObserver } from '@accelint/stream';
import { StreamClientProvider } from '@accelint/stream/react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { streamDevtoolsPlugin } from '../index';
import { streamDevtoolsNoOpPlugin } from '../plugin';
import type { ReactElement } from 'react';

/** Minimal constructible EventSource: opens immediately, exposes handlers. */
class InstantEventSource {
  static CLOSED = 2;
  onopen: ((event: unknown) => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  readyState = 0;
  url: string;

  constructor(url: string) {
    this.url = url;
    queueMicrotask(() => {
      this.readyState = 1;
      this.onopen?.({});
    });
  }

  close() {
    this.readyState = InstantEventSource.CLOSED;
  }
}

/** jsdom has no ResizeObserver; the panel's width tracking needs one. */
class NoopResizeObserver {
  observe() {
    // intentional no-op
  }
  unobserve() {
    // intentional no-op
  }
  disconnect() {
    // intentional no-op
  }
}

const URI = 'http://localhost:3000/stream';

/** The shell portals plugin renders inside the app tree — provider context applies. */
function renderPanel(client: StreamClient, theme: 'light' | 'dark' = 'dark') {
  return render(
    <StreamClientProvider client={client}>
      {streamDevtoolsPlugin.render(document.createElement('div'), { theme })}
    </StreamClientProvider>,
  );
}

describe('streamDevtoolsPlugin (react)', () => {
  let client: StreamClient;

  beforeEach(() => {
    vi.stubGlobal('EventSource', InstantEventSource);
    vi.stubGlobal('ResizeObserver', NoopResizeObserver);
    client = new StreamClient();
  });

  afterEach(() => {
    cleanup();
    client.clear();
    vi.unstubAllGlobals();
  });

  it('mounts the Solid panel with the client from provider context', async () => {
    expect(streamDevtoolsPlugin.name).toBe('Streams');
    expect(streamDevtoolsPlugin.id).toBe('accelint-stream');

    const { unmount } = renderPanel(client);

    // async: the core class lazy-imports the panel before mounting
    const empty = await screen.findByText('No SSE streams');
    expect(empty).toBeInstanceOf(HTMLElement);
    expect(screen.getByText('SSE')).toBeInstanceOf(HTMLElement);
    expect(screen.getByText('WebSockets')).toBeInstanceOf(HTMLElement);

    unmount();
    expect(screen.queryByText('No SSE streams')).toBeNull();
  });

  it('does not remount when a parent re-render repeats the same prop values', async () => {
    // the plugin panel gets a fresh props OBJECT every provider re-render;
    // only value changes may tear down the Solid root (the wrapper's
    // memoized element pins this)
    const panel = streamDevtoolsPlugin.render(document.createElement('div'), {
      theme: 'dark',
    });
    const { rerender } = render(
      <StreamClientProvider client={client}>{panel}</StreamClientProvider>,
    );

    const first = await screen.findByText('No SSE streams');
    first.dataset.probe = 'stable';

    rerender(
      <StreamClientProvider client={client}>{panel}</StreamClientProvider>,
    );

    // give a would-be remount time to complete before asserting stability
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText('No SSE streams').dataset.probe).toBe('stable');
  });

  it('no-op twin renders nothing and touches nothing', () => {
    const { container } = render(
      streamDevtoolsNoOpPlugin.render(document.createElement('div'), {
        theme: 'dark',
      }) as ReactElement,
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders guidance instead of crashing when no provider is present', () => {
    render(
      streamDevtoolsPlugin.render(document.createElement('div'), {
        theme: 'dark',
      }) as ReactElement,
    );

    expect(screen.getByText(/No StreamClient in context/)).toBeInstanceOf(
      HTMLElement,
    );
  });

  it('mounts under StrictMode', async () => {
    // upstream createReactPanel freezes shell props at first mount under
    // StrictMode (accepted limitation, same as TanStack's own panels) —
    // but the panel must still mount and render
    render(
      <StrictMode>
        <StreamClientProvider client={client}>
          {streamDevtoolsPlugin.render(document.createElement('div'), {
            theme: 'dark',
          })}
        </StreamClientProvider>
      </StrictMode>,
    );

    expect(await screen.findByText('No SSE streams')).toBeInstanceOf(
      HTMLElement,
    );
  });

  it('keeps recording between panel mounts (per-client store outlives the panel)', async () => {
    // first mount attaches the store to this client
    const first = renderPanel(client);
    await screen.findByText('No SSE streams');
    first.unmount();

    // lifecycle happens while the panel is closed — the store must catch it
    const observer = new StreamObserver(client.getStreamCache(), {
      streamKey: ['devtools'],
      uri: URI,
    });
    const unsubscribe = observer.subscribe(vi.fn());
    const streamHash =
      client.getStreamCache().get(['devtools'])?.streamHash ?? '';
    expect(streamHash).not.toBe('');

    renderPanel(client);
    const row = await screen.findByText(streamHash);
    fireEvent.click(row);

    await screen.findByText('Timeline');
    // 'observer added' is recordable only by a store that was alive while
    // the panel was closed — a fresh store seeds an 'added' entry from the
    // cache but can never reconstruct this one, so this assertion fails if
    // the per-client store cache is dropped (mutation-verified)
    expect(screen.getByText('observer added')).toBeInstanceOf(HTMLElement);

    unsubscribe();
  });

  it('rebinds to a new client when the provider value changes', async () => {
    const clientB = new StreamClient();
    const observer = new StreamObserver(clientB.getStreamCache(), {
      streamKey: ['b-only'],
      uri: URI,
    });
    const unsubscribe = observer.subscribe(vi.fn());
    const hashB = clientB.getStreamCache().get(['b-only'])?.streamHash ?? '';
    expect(hashB).not.toBe('');

    // hold ONE element across rerenders — in a real shell the plugin
    // element is stable while context changes, so this only passes if the
    // effect re-runs on the client dep, not on props identity
    // (mutation-verified: deps of [props] alone fail this test)
    const panel = streamDevtoolsPlugin.render(document.createElement('div'), {
      theme: 'dark',
    });

    const { rerender } = render(
      <StreamClientProvider client={client}>{panel}</StreamClientProvider>,
    );
    await screen.findByText('No SSE streams');

    rerender(
      <StreamClientProvider client={clientB}>{panel}</StreamClientProvider>,
    );
    expect(await screen.findByText(hashB)).toBeInstanceOf(HTMLElement);

    unsubscribe();
    clientB.clear();
  });
});
