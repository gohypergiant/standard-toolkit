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

import { hashKey, notifyManager, replaceEqualDeep } from '@tanstack/query-core';
import { StreamObserver } from './stream-observer';
import { Subscribable } from './subscribable';
import type { StreamCache } from './stream-cache';
import type {
  StreamObserverOptions,
  StreamObserverResult,
} from './stream-observer';

/** Per-stream results, index-aligned with `options.streams`. */
export type StreamsObserverResults<
  T = unknown,
  TData = T,
> = StreamObserverResult<TData, T>[];

/**
 * Derive one value from the per-stream results (`useQueries`' combine).
 * Memoized on the result-array identity and structurally shared, so a
 * deep-equal derivation keeps its reference and listeners are not notified.
 */
export type StreamsCombineFn<T, TData, TCombined> = (
  results: StreamsObserverResults<T, TData>,
) => TCombined;

export type StreamsObserverOptions<
  T = unknown,
  TData = T,
  TCombined = StreamsObserverResults<T, TData>,
> = {
  /** One entry per stream — dynamic length, reconciled on setOptions. */
  streams: readonly StreamObserverOptions<T, TData>[];
  combine?: StreamsCombineFn<T, TData, TCombined>;
};

type StreamsObserverListener<T, TData> = (
  results: StreamsObserverResults<T, TData>,
) => void;

type StreamObserverMatch<T, TData> = {
  options: StreamObserverOptions<T, TData>;
  observer: StreamObserver<T, TData>;
};

/**
 * QueriesObserver analog: owns a dynamic set of child StreamObservers behind
 * one subscribe/getCurrentResult pair, so one `useSyncExternalStore` call can
 * observe N streams where N changes at runtime. Children are reconciled by
 * streamKey hash — a surviving config keeps its observer (and result
 * identity), a removed config's observer releases its stream (normal gc
 * linger), and duplicates of a key get distinct observers in order (each
 * keeps its own select).
 */
export class StreamsObserver<
  T = unknown,
  TData = T,
  TCombined = StreamsObserverResults<T, TData>,
> extends Subscribable<StreamsObserverListener<T, TData>> {
  #cache: StreamCache;
  #observers: StreamObserver<T, TData>[] = [];
  #unsubscribes = new Map<StreamObserver<T, TData>, () => void>();
  #result: StreamsObserverResults<T, TData> = [];
  // combine memoization (QueriesObserver's #combineResult)
  #combinedResult?: TCombined;
  #lastCombine?: StreamsCombineFn<T, TData, TCombined>;
  #lastResult?: StreamsObserverResults<T, TData>;
  #lastStreamHashes?: string[];

  options: StreamsObserverOptions<T, TData, TCombined>;

  constructor(
    cache: StreamCache,
    options: StreamsObserverOptions<T, TData, TCombined>,
  ) {
    super();

    this.#cache = cache;
    this.options = options;
    this.setOptions(options);
  }

  protected override onSubscribe(): void {
    if (this.listeners.size === 1) {
      this.#observers.forEach((observer) => {
        this.#subscribeChild(observer);
      });
    }
  }

  protected override onUnsubscribe(): void {
    if (!this.hasListeners()) {
      this.#observers.forEach((observer) => {
        this.#unsubscribeChild(observer);
      });
    }
  }

  /**
   * Reconcile the child set (QueriesObserver's setQueries): survivors —
   * matched by streamKey hash — receive per-stream setOptions, new configs
   * create observers, removed configs release their stream subscriptions
   * (their streams enter the normal gc linger).
   */
  setOptions(options: StreamsObserverOptions<T, TData, TCombined>): void {
    this.options = options;

    notifyManager.batch(() => {
      const prevObservers = this.#observers;
      const matches = this.#findMatchingObservers(options.streams);

      // set options on survivors first so their updates flow via listeners
      matches.forEach((match) => {
        match.observer.setOptions(match.options);
      });

      const newObservers = matches.map((match) => match.observer);
      const newResult = newObservers.map((observer) =>
        observer.getCurrentResult(),
      );

      const hasStructuralChange =
        newObservers.length !== prevObservers.length ||
        newObservers.some((observer, i) => observer !== prevObservers[i]);
      // child results replace wholesale on change, so identity comparison
      // is enough (QueriesObserver needs shallowEqualObjects here)
      const hasResultChange =
        hasStructuralChange ||
        newResult.some((result, i) => result !== this.#result[i]);

      if (!hasResultChange) {
        return;
      }

      if (hasStructuralChange) {
        this.#observers = newObservers;
      }

      this.#result = newResult;

      if (!this.hasListeners()) {
        return;
      }

      if (hasStructuralChange) {
        prevObservers.forEach((observer) => {
          if (!newObservers.includes(observer)) {
            this.#unsubscribeChild(observer);
          }
        });
        newObservers.forEach((observer) => {
          if (!prevObservers.includes(observer)) {
            this.#subscribeChild(observer);
          }
        });
      }

      this.#notify();
    });
  }

  /**
   * The getSnapshot for `useSyncExternalStore`: index-aligned per-stream
   * results. Entries keep identity when unchanged (copy-on-write at the
   * changed index), and the server snapshot mirrors this same value.
   */
  getCurrentResult(): StreamsObserverResults<T, TData> {
    return this.#result;
  }

  /**
   * Render-time view of `streams` before the effect commits them
   * (QueriesObserver's getOptimisticResult): reconciles against the current
   * children without mutating the committed set, so a config-array shape
   * change is reflected in the same render. Returns the per-stream results
   * and a memoized combine over them.
   */
  getOptimisticResult(
    streams: readonly StreamObserverOptions<T, TData>[],
    combine: StreamsCombineFn<T, TData, TCombined> | undefined,
  ): [
    results: StreamsObserverResults<T, TData>,
    combineResult: () => TCombined,
  ] {
    const matches = this.#findMatchingObservers(streams);
    const result = matches.map((match) => match.observer.getCurrentResult());
    const streamHashes = matches.map((match) =>
      hashKey(match.options.streamKey),
    );

    return [result, () => this.#combineResult(result, combine, streamHashes)];
  }

  /** Child observers, in config order. Copy — reconcile owns the original. */
  getObservers(): StreamObserver<T, TData>[] {
    return [...this.#observers];
  }

  /**
   * Memoized on the committed result identity, the stream hashes (so a
   * shape change recomputes before the commit lands), and the combine fn;
   * structurally shared so a deep-equal derivation keeps its reference.
   */
  #combineResult(
    input: StreamsObserverResults<T, TData>,
    combine: StreamsCombineFn<T, TData, TCombined> | undefined,
    streamHashes?: string[],
  ): TCombined {
    if (!combine) {
      return input as unknown as TCombined;
    }

    const lastHashes = this.#lastStreamHashes;
    const hashesChanged =
      streamHashes !== undefined &&
      lastHashes !== undefined &&
      (lastHashes.length !== streamHashes.length ||
        streamHashes.some((hash, i) => hash !== lastHashes[i]));

    if (
      this.#result !== this.#lastResult ||
      hashesChanged ||
      combine !== this.#lastCombine
    ) {
      this.#lastCombine = combine;
      this.#lastResult = this.#result;

      if (streamHashes !== undefined) {
        this.#lastStreamHashes = streamHashes;
      }

      this.#combinedResult = replaceEqualDeep(
        this.#combinedResult,
        combine(input),
      );
    }

    return this.#combinedResult as TCombined;
  }

  /**
   * Match new configs to existing children by streamKey hash so survivors
   * keep observer state wherever they moved to. Buckets (not a flat map)
   * keep duplicate keys as distinct observers, consumed in order.
   */
  #findMatchingObservers(
    streams: readonly StreamObserverOptions<T, TData>[],
  ): StreamObserverMatch<T, TData>[] {
    const prevByHash = new Map<string, StreamObserver<T, TData>[]>();

    this.#observers.forEach((observer) => {
      const hash = hashKey(observer.options.streamKey);
      const bucket = prevByHash.get(hash);

      if (bucket) {
        bucket.push(observer);
      } else {
        prevByHash.set(hash, [observer]);
      }
    });

    return streams.map((options) => {
      const match = prevByHash.get(hashKey(options.streamKey))?.shift();

      return {
        options,
        observer: match ?? new StreamObserver<T, TData>(this.#cache, options),
      };
    });
  }

  #subscribeChild(observer: StreamObserver<T, TData>): void {
    if (this.#unsubscribes.has(observer)) {
      return;
    }

    this.#unsubscribes.set(
      observer,
      observer.subscribe((result) => {
        this.#onChildUpdate(observer, result);
      }),
    );
  }

  #unsubscribeChild(observer: StreamObserver<T, TData>): void {
    const unsubscribe = this.#unsubscribes.get(observer);

    if (unsubscribe) {
      this.#unsubscribes.delete(observer);
      unsubscribe();
    }
  }

  /** Copy-on-write at the changed index — untouched entries keep identity. */
  #onChildUpdate(
    observer: StreamObserver<T, TData>,
    result: StreamObserverResult<TData, T>,
  ): void {
    const index = this.#observers.indexOf(observer);

    if (index !== -1) {
      const next = this.#result.slice();
      next[index] = result;
      this.#result = next;
      this.#notify();
    }
  }

  #notify(): void {
    if (!this.hasListeners()) {
      return;
    }

    const combine = this.options.combine;

    if (combine) {
      // derived view unchanged → skip, so combine consumers don't re-render
      // on inputs their derivation ignores (QueriesObserver semantics)
      const previousResult = this.#combinedResult;

      if (this.#combineResult(this.#result, combine) === previousResult) {
        return;
      }
    }

    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(this.#result);
      });
    });
  }
}
