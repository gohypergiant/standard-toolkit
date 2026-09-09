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

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StreamCache } from '../stream-cache';
import { StreamClient } from '../stream-client';

describe('StreamClient', () => {
  let client: StreamClient;

  beforeEach(() => {
    client = new StreamClient();
  });

  afterEach(() => {
    client.clear();
  });

  it('should create client with default cache', () => {
    expect(client.getStreamCache()).toBeInstanceOf(StreamCache);
  });

  it('should accept custom cache', () => {
    const customCache = new StreamCache();
    const customClient = new StreamClient({ cache: customCache });

    expect(customClient.getStreamCache()).toBe(customCache);
  });

  it('should filter imperative reads with the same semantics as useStreamState', () => {
    const cache = client.getStreamCache();
    cache.build(
      ['cortex', 'activations', { datasetId: 'dataset-a' }],
      'http://c:8080/a',
    );
    cache.build(
      ['cortex', 'activations', { datasetId: 'dataset-b' }],
      'http://c:8080/b',
    );
    cache.build(['cortex', 'health'], 'http://c:8080/health');

    // Unfiltered: existing behavior unchanged.
    expect(client.getStreamCount()).toBe(3);
    expect(client.getStreams()).toHaveLength(3);

    // Prefix, named-field, status, and predicate filters — the imperative
    // sibling of useStreamState for non-React consumers.
    expect(
      client.getStreamCount({ streamKey: ['cortex', 'activations'] }),
    ).toBe(2);
    expect(
      client.getStreams({
        streamKey: ['cortex', 'activations', { datasetId: 'dataset-b' }],
      }),
    ).toHaveLength(1);
    // Built but never observed: no lazy connect yet, so still connecting.
    expect(client.getStreamCount({ status: 'connecting' })).toBe(3);
    expect(
      client.getStreamCount({
        predicate: (stream) => stream.getObserversCount() > 0,
      }),
    ).toBe(0);
  });
});
