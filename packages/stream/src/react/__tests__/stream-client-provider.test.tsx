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
import { describe, expect, it, vi } from 'vitest';
import { StreamClient } from '../../index';
import {
  StreamClientProvider,
  useStreamClient,
} from '../stream-client-provider';

describe('StreamClientProvider', () => {
  it('should provide client via context', () => {
    const client = new StreamClient();

    function TestComponent() {
      const contextClient = useStreamClient();
      return <div>{contextClient === client ? 'success' : 'fail'}</div>;
    }

    render(
      <StreamClientProvider client={client}>
        <TestComponent />
      </StreamClientProvider>,
    );

    expect(screen.getByText('success')).toBeInTheDocument();
  });

  it('should throw when used outside provider', () => {
    function TestComponent() {
      useStreamClient();
      return <div>test</div>;
    }

    expect(() => render(<TestComponent />)).toThrow(
      'No StreamClient set, use StreamClientProvider to set one',
    );
  });

  it('should call mount on client when provider mounts', () => {
    const client = new StreamClient();
    const mountSpy = vi.spyOn(client, 'mount');

    const { unmount } = render(
      <StreamClientProvider client={client}>
        <div>test</div>
      </StreamClientProvider>,
    );

    expect(mountSpy).toHaveBeenCalledOnce();

    const unmountSpy = vi.spyOn(client, 'unmount');
    unmount();

    expect(unmountSpy).toHaveBeenCalledOnce();
  });

  it('should allow client override in useStreamClient', () => {
    const contextClient = new StreamClient();
    const overrideClient = new StreamClient();

    function TestComponent() {
      const client = useStreamClient(overrideClient);
      return <div>{client === overrideClient ? 'override' : 'context'}</div>;
    }

    render(
      <StreamClientProvider client={contextClient}>
        <TestComponent />
      </StreamClientProvider>,
    );

    expect(screen.getByText('override')).toBeInTheDocument();
  });
});
