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

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StreamClient } from '../../index';
import { MockEventSource } from '../../test/utils';
import { StreamClientProvider } from '../stream-client-provider';
import { useStream } from '../use-stream';
import type { ReactNode } from 'react';

const URI = 'http://localhost:3000/stream';
const KEY = ['swap-test'];

describe('useStream client swap', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rebuilds the observer against the new cache when the provider StreamClient changes', async () => {
    // The rebuild sets the hook's OWN state during render — React's
    // sanctioned adjust-state-on-prop-change pattern. React only warns when
    // a render updates a DIFFERENT component's state; pin that this path
    // stays silent (a regression here would spam every HMR client swap).
    const errorSpy = vi.spyOn(console, 'error');
    const clientA = new StreamClient();
    const clientB = new StreamClient();
    let currentClient = clientA;

    const { result, rerender, unmount } = renderHook(
      () => useStream({ streamKey: KEY, uri: URI }),
      {
        wrapper: ({ children }: { children?: ReactNode }) => (
          <StreamClientProvider client={currentClient}>
            {children}
          </StreamClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(clientA.getStreamCache().get(KEY)?.getObserversCount()).toBe(1);
    });
    expect(clientB.getStreamCache().get(KEY)).toBeUndefined();

    // Provider swaps clients (dev-mode HMR resets the browser singleton and
    // the next provider render mints a fresh client). The mounted hook must
    // migrate: without the rebuild it streams against the dead cache forever.
    currentClient = clientB;
    rerender();

    await waitFor(() => {
      expect(clientB.getStreamCache().get(KEY)?.getObserversCount()).toBe(1);
    });
    // The old cache's stream lost its observer and entered the gc linger.
    expect(clientA.getStreamCache().get(KEY)?.getObserversCount()).toBe(0);
    expect(result.current.status).toBeDefined();

    // No render-phase-update warning and no cross-component-update warning.
    const reactRenderWarnings = errorSpy.mock.calls.filter(
      (call) =>
        String(call[0]).includes('Cannot update a component') ||
        String(call[0]).includes('Too many re-renders'),
    );
    expect(reactRenderWarnings).toEqual([]);

    unmount();
  });

  it('keeps the same observer and stream across rerenders with an unchanged client', async () => {
    const client = new StreamClient();

    const { rerender, unmount } = renderHook(
      () => useStream({ streamKey: KEY, uri: URI }),
      {
        wrapper: ({ children }: { children?: ReactNode }) => (
          <StreamClientProvider client={client}>
            {children}
          </StreamClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(client.getStreamCache().get(KEY)?.getObserversCount()).toBe(1);
    });
    const stream = client.getStreamCache().get(KEY);
    const eventSource = stream?.getEventSource();

    rerender();
    rerender();

    // No churn: same stream, same live connection, still one observer.
    expect(client.getStreamCache().get(KEY)).toBe(stream);
    expect(stream?.getEventSource()).toBe(eventSource);
    expect(stream?.getObserversCount()).toBe(1);

    unmount();
  });
});
