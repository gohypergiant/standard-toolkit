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

import { uuid } from '@accelint/core';
import { describe, expect, it } from 'vitest';
import { matchesDequeueFilter } from './utils';
import type { NoticeContent } from './types';

describe('matchesDequeueFilter', () => {
  const baseNotice: NoticeContent = {
    id: uuid(),
    message: 'Test message',
    target: uuid(),
    color: 'info' as const,
    metadata: { operation: 'upload', batchId: 'batch-1' },
  };

  it('should match by id', () => {
    expect(matchesDequeueFilter({ id: baseNotice.id }, baseNotice)).toBe(true);
    expect(matchesDequeueFilter({ id: uuid() }, baseNotice)).toBe(false);
  });

  it('should match by target', () => {
    expect(
      matchesDequeueFilter({ target: baseNotice.target }, baseNotice),
    ).toBe(true);
    expect(matchesDequeueFilter({ target: uuid() }, baseNotice)).toBe(false);
  });

  it('should match by color', () => {
    expect(matchesDequeueFilter({ color: 'info' }, baseNotice)).toBe(true);
    expect(matchesDequeueFilter({ color: 'critical' }, baseNotice)).toBe(false);
  });

  it('should match by exact metadata', () => {
    expect(
      matchesDequeueFilter(
        { metadata: { operation: 'upload', batchId: 'batch-1' } },
        baseNotice,
      ),
    ).toBe(true);
    expect(
      matchesDequeueFilter(
        { metadata: { operation: 'download', batchId: 'batch-1' } },
        baseNotice,
      ),
    ).toBe(false);
  });

  it('should match by partial metadata', () => {
    expect(
      matchesDequeueFilter({ metadata: { operation: 'upload' } }, baseNotice),
    ).toBe(true);
    expect(
      matchesDequeueFilter({ metadata: { batchId: 'batch-1' } }, baseNotice),
    ).toBe(true);
    expect(
      matchesDequeueFilter({ metadata: { operation: 'download' } }, baseNotice),
    ).toBe(false);
  });

  it('should match when all criteria match (AND logic)', () => {
    expect(
      matchesDequeueFilter(
        {
          id: baseNotice.id,
          color: 'info',
          metadata: { operation: 'upload' },
        },
        baseNotice,
      ),
    ).toBe(true);
  });

  it('should not match when any criterion fails', () => {
    expect(
      matchesDequeueFilter(
        {
          id: baseNotice.id,
          color: 'critical', // Wrong color
          metadata: { operation: 'upload' },
        },
        baseNotice,
      ),
    ).toBe(false);
  });

  it('should match when no criteria provided (match all)', () => {
    expect(matchesDequeueFilter({}, baseNotice)).toBe(true);
  });

  it('should not match when notice has no metadata', () => {
    const noticeWithoutMetadata: NoticeContent = {
      id: uuid(),
      message: 'Test message',
      color: 'info' as const,
    };
    expect(
      matchesDequeueFilter(
        { metadata: { operation: 'upload' } },
        noticeWithoutMetadata,
      ),
    ).toBe(false);
  });
});
