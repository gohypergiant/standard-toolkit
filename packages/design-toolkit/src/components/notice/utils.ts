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

import 'client-only';
import { isEqual } from 'radashi';
import type { NoticeContent, NoticeDequeueEvent } from './types';

/**
 * Checks if a payload matches metadata on a notice.
 * Used for filtering notices during dequeue operations.
 *
 * @param payload - Object with key-value pairs to match against.
 * @param metadata - Metadata object from a notice to check.
 * @returns True if all payload entries match corresponding metadata entries.
 */
export function matchesMetadata(
  payload: Record<string, unknown>,
  metadata?: Record<string, unknown>,
) {
  if (!metadata) {
    return false;
  }

  return Object.entries(payload).every(
    ([key, value]) => key in metadata && isEqual(metadata[key], value),
  );
}

/**
 * Checks if a dequeue payload matches a notice's content.
 * Supports filtering by top-level fields (id, color, target) and nested metadata.
 *
 * @param dequeuePayload - Dequeue event payload with optional id, color, target, metadata.
 * @param noticeContent - Notice content to match against.
 * @returns True if all provided criteria match.
 */
export function matchesDequeueFilter(
  dequeuePayload: NoticeDequeueEvent['payload'],
  noticeContent: NoticeContent,
) {
  // Match top-level id
  if (dequeuePayload.id && dequeuePayload.id !== noticeContent.id) {
    return false;
  }

  // Match top-level target
  if (dequeuePayload.target && dequeuePayload.target !== noticeContent.target) {
    return false;
  }

  // Match top-level color
  if (dequeuePayload.color && dequeuePayload.color !== noticeContent.color) {
    return false;
  }

  // Match metadata fields using existing matchesMetadata logic
  if (!dequeuePayload.metadata) {
    return true;
  }

  return matchesMetadata(dequeuePayload.metadata, noticeContent.metadata);
}
