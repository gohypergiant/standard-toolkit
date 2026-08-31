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
import { cleanup, render, screen } from '@testing-library/react';
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

  it('no-op twin renders nothing and touches nothing', () => {
    const { container } = render(
      streamDevtoolsNoOpPlugin.render(document.createElement('div'), {
        devtoolsOpen: true,
        theme: 'dark',
      }) as ReactElement,
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders guidance instead of crashing when no provider is present', () => {
    render(
      streamDevtoolsPlugin.render(document.createElement('div'), {
        devtoolsOpen: true,
        theme: 'dark',
      }) as ReactElement,
    );

    expect(screen.getByText(/No StreamClient in context/)).toBeInstanceOf(
      HTMLElement,
    );
  });
});
