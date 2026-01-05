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

import { vi } from 'vitest';

type MockFunctionResult = ReturnType<typeof vi.fn>;

/**
 * Mock implementation of BroadcastChannel for testing with Vitest 4.x
 */

interface MockChannel {
  addEventListener: MockFunctionResult;
  close: MockFunctionResult;
  name: string;
  onmessage: ((event: MessageEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage: MockFunctionResult;
  removeEventListener: MockFunctionResult;
}

const channels = new Map<string, MockChannel>();

export function mockBroadcastChannel() {
  globalThis.BroadcastChannel = class BroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = vi.fn();
    onmessageerror: ((event: MessageEvent) => void) | null = vi.fn();

    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    dispatchEvent = vi.fn();
    close = vi.fn();

    postMessage = vi.fn((data: unknown) => {
      // Simulate broadcasting to all channels with the same name
      const event = new MessageEvent('message', {
        data,
        origin: globalThis.location?.origin ?? '',
        source: null,
      });

      for (const channel of channels.values()) {
        if (channel.name === this.name) {
          if (channel.onmessage) {
            channel.onmessage(event);
          }
          // Trigger event listeners
          const mockFn = channel.addEventListener as MockFunctionResult;
          const calls = mockFn.mock.calls as [
            string,
            (event: MessageEvent) => void,
          ][];
          const listeners = calls
            .filter((call) => call[0] === 'message')
            .map((call) => call[1]);

          for (const listener of listeners) {
            listener(event);
          }
        }
      }
    });

    constructor(name: string) {
      this.name = name;

      const channel: MockChannel = {
        name,
        onmessage: this.onmessage,
        onmessageerror: this.onmessageerror,
        addEventListener: this.addEventListener,
        removeEventListener: this.removeEventListener,
        postMessage: this.postMessage,
        close: this.close,
      };

      channels.set(name, channel);
    }
  } as unknown as typeof BroadcastChannel;
}

export function resetMockBroadcastChannel() {
  channels.clear();
  delete (globalThis as Record<string, unknown>).BroadcastChannel;
}
