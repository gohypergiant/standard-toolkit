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

import { Broadcast } from '@accelint/bus';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NoticeEventTypes } from './events';
import { NoticeList } from './list';
import type { NoticeListProps, NoticeQueueEvent } from './types';

const bus = Broadcast.getInstance<NoticeQueueEvent>();

function setup(props: NoticeListProps) {
  render(<NoticeList {...props} />);

  return props;
}

describe('NoticeList', () => {
  it('should render message', async () => {
    setup({});
    bus.emit(NoticeEventTypes.queue, {
      message: 'Hello',
    });

    expect(await screen.findByText('Hello')).toBeInTheDocument();
  });

  it('should limit visible messages', async () => {
    setup({ limit: 2 });
    bus.emit(NoticeEventTypes.queue, {
      message: 'Hello 1',
    });
    expect(await screen.findByText('Hello 1')).toBeInTheDocument();
    bus.emit(NoticeEventTypes.queue, {
      message: 'Hello 2',
    });
    expect(await screen.findByText('Hello 2')).toBeInTheDocument();
    bus.emit(NoticeEventTypes.queue, {
      message: 'Hello 3',
    });
    await waitFor(() => {
      expect(screen.queryByText('Hello 3')).not.toBeInTheDocument();
    });
  });

  describe('auto-dismiss behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should auto-dismiss notice after defaultTimeout', async () => {
      setup({ defaultTimeout: 1000 });

      act(() => {
        bus.emit(NoticeEventTypes.queue, {
          message: 'Timed message',
        });
      });

      // Verify notice appears
      expect(screen.getByText('Timed message')).toBeInTheDocument();

      // Advance time by the default timeout duration
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // Verify notice is dismissed
      expect(screen.queryByText('Timed message')).not.toBeInTheDocument();
    });

    it('should use specific timeout when no defaultTimeout is set', async () => {
      setup({}); // No defaultTimeout

      act(() => {
        bus.emit(NoticeEventTypes.queue, {
          message: 'Custom timeout message',
          timeout: 1000,
        });
      });

      // Verify notice appears
      expect(screen.getByText('Custom timeout message')).toBeInTheDocument();

      // Advance time by the specific timeout (1000ms)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // Verify notice is dismissed after specific timeout
      expect(
        screen.queryByText('Custom timeout message'),
      ).not.toBeInTheDocument();
    });

    it('should dismiss multiple notices independently based on their timeouts', async () => {
      setup({});

      act(() => {
        // Emit first notice with 1000ms timeout
        bus.emit(NoticeEventTypes.queue, {
          message: 'First notice',
          timeout: 1000,
        });

        // Emit second notice with 2000ms timeout
        bus.emit(NoticeEventTypes.queue, {
          message: 'Second notice',
          timeout: 2000,
        });
      });

      // Verify both notices appear
      expect(screen.getByText('First notice')).toBeInTheDocument();
      expect(screen.getByText('Second notice')).toBeInTheDocument();

      // Advance time by 1000ms
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // First notice should be dismissed, second should remain
      expect(screen.queryByText('First notice')).not.toBeInTheDocument();
      expect(screen.getByText('Second notice')).toBeInTheDocument();

      // Advance time by another 1000ms (total: 2000ms)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // Second notice should now be dismissed
      expect(screen.queryByText('Second notice')).not.toBeInTheDocument();
    });

    it('should not auto-dismiss notice without timeout', async () => {
      setup({});

      act(() => {
        bus.emit(NoticeEventTypes.queue, {
          message: 'Persistent message',
          // No timeout specified
        });
      });

      // Verify notice appears
      expect(screen.getByText('Persistent message')).toBeInTheDocument();

      // Advance time significantly
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000);
      });

      // Verify notice still exists (not auto-dismissed)
      expect(screen.getByText('Persistent message')).toBeInTheDocument();
    });
  });
});
