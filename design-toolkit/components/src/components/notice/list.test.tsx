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
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notice } from './';
import { NoticeEventTypes } from './events';
import type { NoticeListProps, NoticeQueueEvent } from './types';

const bus = Broadcast.getInstance<NoticeQueueEvent>();

function setup(props: NoticeListProps) {
  render(<Notice.List {...props} />);

  return props;
}

describe('Notice.List', () => {
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
});
