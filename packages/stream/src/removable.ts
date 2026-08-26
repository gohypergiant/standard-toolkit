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
import { environmentManager, timeoutManager } from '@tanstack/query-core';

/**
 * Port of TanStack Query's Removable (query-core/removable.ts): one gc timer —
 * scheduleGc() (re)arms, clearGcTimeout() disarms, optionalRemove() decides
 * on fire.
 *
 * Uses TanStack's own timeoutManager/environmentManager, so a host's custom
 * TimeoutProvider governs stream gc too.
 *
 * gcTime matches TanStack: updateGcTime only ratchets UP; Infinity disables;
 * server default Infinity (SSR must not leak timers into the request).
 * Divergence: browser default 30s, not 5min — a lingering stream holds an
 * OPEN connection, not inert cached data.
 */

/** Browser default linger for an unobserved stream. */
export const DEFAULT_STREAM_GC_TIME = 30_000;

type ManagedTimerId = ReturnType<(typeof timeoutManager)['setTimeout']>;

function isValidTimeout(value: number): boolean {
  return (
    typeof value === 'number' &&
    value >= 0 &&
    value !== Number.POSITIVE_INFINITY
  );
}

export abstract class Removable {
  gcTime!: number;
  #gcTimeout?: ManagedTimerId;

  destroy(): void {
    this.clearGcTimeout();
  }

  protected scheduleGc(): void {
    this.clearGcTimeout();

    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }

  protected updateGcTime(newGcTime: number | undefined): void {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ??
        (environmentManager.isServer()
          ? Number.POSITIVE_INFINITY
          : DEFAULT_STREAM_GC_TIME),
    );
  }

  protected clearGcTimeout(): void {
    if (this.#gcTimeout !== undefined) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = undefined;
    }
  }

  protected abstract optionalRemove(): void;
}
