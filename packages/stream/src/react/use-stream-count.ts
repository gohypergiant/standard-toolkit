// __private-exports

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

'use client';
import { useStreamState } from './use-stream-state';
import type { Stream, StreamClient, StreamFilters } from '../index';

function selectStreamHash(stream: Stream): string {
  return stream.streamHash;
}

/**
 * Count of streams matching `filters` — similar to `useIsFetching`. Selecting
 * `streamHash` keeps the result membership-stable: re-renders on count
 * change, never on message traffic. Domain sugar belongs in app code:
 * `useStreamCount({ status: 'error' }) > 0`.
 */
export function useStreamCount(
  filters?: StreamFilters,
  client?: StreamClient,
): number {
  return useStreamState({ filters, select: selectStreamHash }, client).length;
}
