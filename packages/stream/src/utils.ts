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

import { hashKey, partialMatchKey } from '@tanstack/query-core';
import type { Stream } from './stream';
import type { StreamFilters } from './types';

/** True when the stream passes every provided filter (absent = pass). */
export function matchStream(
  filters: StreamFilters | undefined,
  stream: Stream,
): boolean {
  if (!filters) {
    return true;
  }
  const { exact, predicate, status, streamKey, transport } = filters;

  const keyMatches =
    streamKey === undefined ||
    (exact
      ? hashKey(streamKey) === stream.streamHash
      : partialMatchKey(stream.streamKey, streamKey));
  const statusMatches = status === undefined || stream.state.status === status;
  const transportMatches =
    transport === undefined || stream.transport === transport;
  const predicateMatches = predicate === undefined || predicate(stream);

  return keyMatches && statusMatches && transportMatches && predicateMatches;
}
