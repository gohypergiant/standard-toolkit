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

/**
 * Single-slot cache keyed on `shapeId`. Holds one entry; re-seeds when
 * the key changes; clears explicitly on session boundary.
 *
 * The edit-shape transform modes all share a "lock something to the
 * shape's stable id and reset on shape change" pattern — the most-
 * northern axis-endpoint index for ellipses, the most-northern edge
 * index for rectangles, and the cumulative rotation angle for polygon /
 * line shapes. This cache is the mechanism each of those modes uses to
 * keep its anchor value tied to a specific editing session.
 */
export class SessionCache<TValue> {
  private entry: { shapeId: string; value: TValue } | null = null;

  /** Read the entry if it matches `shapeId`, or seed a fresh one. */
  getOrInit(shapeId: string | undefined, seed: () => TValue): TValue | null {
    if (shapeId === undefined) {
      return null;
    }

    if (this.entry?.shapeId === shapeId) {
      return this.entry.value;
    }

    this.entry = { shapeId, value: seed() };

    return this.entry.value;
  }

  /** Mutate the entry in place if it matches `shapeId`. No-op otherwise. */
  update(shapeId: string, mutator: (value: TValue) => void): void {
    if (this.entry?.shapeId === shapeId) {
      mutator(this.entry.value);
    }
  }

  /**
   * Set the entry for `shapeId`, overwriting any existing entry.
   * Callers use this when they've computed a value out-of-band and need
   * to seed the cache without going through {@link getOrInit}'s lazy
   * pattern — e.g. when a computation might fail (returns null) and the
   * caller wants to keep the cache empty until a successful result is
   * available.
   */
  set(shapeId: string, value: TValue): void {
    this.entry = { shapeId, value };
  }

  /**
   * Read without seeding. When `shapeId` is provided, returns `null`
   * unless the entry matches. When omitted, returns the current entry
   * regardless of key — used by callers that don't have a shapeId at
   * the call site (e.g. `OrientationLock.decorateProps`).
   */
  peek(shapeId?: string): TValue | null {
    if (shapeId !== undefined && this.entry?.shapeId !== shapeId) {
      return null;
    }

    return this.entry?.value ?? null;
  }

  /**
   * Discard the cached entry. The next {@link getOrInit} call will
   * re-seed (or {@link peek} will return `null`). Callers invoke this at
   * the edit-session boundary so a freshly-opened shape starts with no
   * locked anchor / cumulative angle / etc.
   */
  reset(): void {
    this.entry = null;
  }
}
