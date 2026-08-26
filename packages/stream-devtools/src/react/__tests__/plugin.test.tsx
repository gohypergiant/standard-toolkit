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

import { StreamClient } from '@accelint/stream';
import { StreamClientProvider } from '@accelint/stream/react';
import { cleanup, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { streamDevtoolsPlugin } from '../index';
import { streamDevtoolsNoOpPlugin } from '../plugin';
import type { ReactElement } from 'react';

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

describe('streamDevtoolsPlugin (react)', () => {
  let client: StreamClient;

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', NoopResizeObserver);
    client = new StreamClient();
  });

  afterEach(() => {
    cleanup();
    client.clear();
    vi.unstubAllGlobals();
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
});
