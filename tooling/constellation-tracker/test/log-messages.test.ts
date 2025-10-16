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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { logMsg } from '../src/log-messages.js';

describe('logMsg', () => {
  const mockSpinner = {
    text: '',
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn((msg) => {
      mockSpinner.text = msg;
    }),
    warn: vi.fn((msg) => {
      mockSpinner.text = msg;
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSpinner.text = '';
  });

  it('should update spinner text with the provided message', () => {
    // biome-ignore lint/suspicious/noExplicitAny: fine for the test
    logMsg('Test message', mockSpinner as any);

    expect(mockSpinner.start).toHaveBeenCalled();
    expect(mockSpinner.succeed).toHaveBeenCalledWith('Test message');
    expect(mockSpinner.text).toBe('Test message');
  });

  it('should handle empty message', () => {
    // biome-ignore lint/suspicious/noExplicitAny: fine for the test
    logMsg('', mockSpinner as any);

    expect(mockSpinner.start).toHaveBeenCalled();
    expect(mockSpinner.succeed).toHaveBeenCalledWith('');
    expect(mockSpinner.text).toBe('');
  });
});
