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

import { type UniqueId, uuid } from '@accelint/core';
import { DEFAULT_CONFIG } from './constants';
import type {
  BroadcastConfig,
  EmitOptions,
  ExtractEvent,
  Listener,
  Payload,
} from './types';

/** Broadcast event class allows for emitting and listening for events */
export class Broadcast<
  P extends { type: string; payload?: unknown; target?: UniqueId } = Payload<
    string,
    // biome-ignore lint/suspicious/noExplicitAny: intentional
    any
  >,
> {
  protected channelName: string;
  protected channel: BroadcastChannel | null = null;
  protected listeners: Record<string, Listener<P>[]> = {};
  protected listenerCounter = 0;

  // biome-ignore lint/suspicious/noExplicitAny: Can't use generics in static properties
  private static instance: Broadcast<any> | null = null;
  #uuid: UniqueId;

  /** Broadcast class constructor. */
  constructor(config?: BroadcastConfig) {
    this.channelName = config?.channelName ?? DEFAULT_CONFIG.channelName;
    this.#uuid = uuid();

    this.init();
  }

  /**
   * Get the singleton instance of Broadcaster.
   *
   * @param config - Optional custom configuration.
   */
  static getInstance<
    // biome-ignore lint/suspicious/noExplicitAny: intentional
    T extends { type: string; payload?: unknown } = Payload<string, any>,
  >(config?: BroadcastConfig) {
    Broadcast.instance ??= new Broadcast<T>(config);

    return Broadcast.instance as Broadcast<T>;
  }

  get uuid(): UniqueId {
    return this.#uuid;
  }

  /**
   * Initialize the BroadcastChannel and set up event listeners.
   */
  protected init() {
    this.channel = new BroadcastChannel(this.channelName);
    this.channel.onmessage = this.onMessage.bind(this);
    this.channel.onmessageerror = this.onError.bind(this);
  }

  private matchesContext(contextId?: UniqueId) {
    return !contextId || contextId === this.#uuid;
  }

  /**
   * Process incoming messages.
   *
   * @param event - Incoming message event.
   */
  protected onMessage(event: MessageEvent<P>) {
    console.log(event);
    this.handleListeners(event.data);
  }

  /**
   * Handle errors from the BroadcastChannel.
   *
   * @param error - Error event.
   */
  protected onError(error: MessageEvent<Error>) {
    console.error('BroadcastChannel message error', error);
  }

  /**
   * Iterate through listeners for the given topic and invoke callbacks if criteria match.
   *
   * @param data - The event payload containing `type`, optional `payload`, and optional `targetId`.
   *
   * @remarks
   * If `targetId` is provided, delivery is scoped to a specific browser context.
   * We assume exactly one bus instance per context, so events are delivered only when
   * `target === this.uuid`. If omitted, the event is treated as a broadcast within
   * this context (audience filtering may occur elsewhere).
   */
  protected handleListeners(data: P) {
    console.log(this.listeners);
    const handler = this.listeners[data.type];

    if (!handler) {
      return;
    }

    /**
     * Note: We assume here that if a `targetId` is passed it is intended to specify a specific browser context.
     * Since there is only one bus per browser context we can infer based on the instance member uuid.
     *
     */
    if (!this.matchesContext(data.target)) {
      return;
    }

    for (const item of handler) {
      const { callback, once } = item;

      callback(data);

      if (once) {
        delete this.listeners[data.type];
      }
    }
  }

  /**
   * Removes a listener by id.
   *
   * @param topic - The event topic.
   * @param listenerId - id of the listener.
   */
  protected removeListener(type: P['type'], id: number) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(
        (handler) => handler.id !== id,
      );
    }
  }

  /**
   * Check for the existence of a event type and create it if missing.
   *
   * @param type - The event type.
   */
  protected addListener(type: P['type'], listener: Listener<P>) {
    this.listeners[type] ??= [];
    this.listeners[type].push(listener);
  }

  /**
   * Register a callback to be executed when a message of the specified event type is received.
   *
   * @template T - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param callback - The callback function.
   *
   * @example
   * bus.on(EVENTS.MAP_CLICK, (e) => {
   *   if (!e.payload.picked) {
   *     setSelected(null);
   *   }
   * });
   */
  on<T extends P['type']>(
    type: T,
    callback: (data: ExtractEvent<P, T>) => void,
  ) {
    const id = this.listenerCounter++;

    this.addListener(type, { callback, id, once: false } as Listener<P>);

    return () => this.removeListener(type, id);
  }

  /**
   * Register a callback to be executed only once for a specified event type.
   *
   * @template T - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param callback - The callback function.
   */
  once<T extends P['type']>(
    type: T,
    callback: (data: ExtractEvent<P, T>) => void,
  ) {
    const id = this.listenerCounter++;

    this.addListener(type, { callback, id, once: true } as Listener<P>);

    return () => this.removeListener(type, id);
  }

  /**
   * Unregister all callbacks for the specified event type.
   *
   * @template T - The Payload type, inferred from the event.
   * @param type - The event type.
   */
  off<T extends P['type']>(
    type: T,
    callback: (data: ExtractEvent<P, T>) => void,
  ) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(
        (listener) => listener.callback !== callback,
      );
    }
  }

  /**
   * Emit an event to all listening contexts.
   *
   * @template T - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param payload - The event payload.
   * @param options.echo - If true (default), also deliver to this context via channel.onmessage.
   *
   * @example
   * bus.emit(
   *   EVENTS.LAYER_CLICK,
   *   {
   *     worldSpace: pickInfo.coordinate,
   *     screenSpace: pickInfo.pixel,
   *     index: pickInfo.index,
   *     object: pickInfo.object,
   *   },
   * );
   */
  emit<T extends P['type']>(type: T): void;
  emit<T extends P['type']>(
    type: T,
    payload: ExtractEvent<P, T> extends { payload: infer Data }
      ? Data
      : undefined,
    options?: EmitOptions,
  ): void;
  emit<T extends P['type']>(
    type: T,
    payload?: ExtractEvent<P, T> extends { payload: infer Data }
      ? Data
      : undefined,
    options?: EmitOptions,
  ) {
    if (!this.channel) {
      console.warn('Cannot emit: BroadcastChannel is not initialized.');
      return;
    }

    if (!this.channel.onmessage) {
      console.warn('No listeners registered for this event type:', type);
      return;
    }

    const target = options?.target ?? 'all';
    const message = { type, payload } as Payload as P;

    switch (target) {
      case 'all':
        this.channel.postMessage(message);
        this.channel.onmessage({ data: message } as MessageEvent<P>);
        break;
      case 'self':
        this.channel.onmessage({ data: message } as MessageEvent<P>);
        break;
      case 'others':
        this.channel.postMessage(message);
        break;
      default: {
        const withTarget = { ...message, target };
        // Note: handles the case where target id matches this browser context.
        this.matchesContext(target)
          ? this.channel.onmessage({ data: withTarget } as MessageEvent<P>)
          : this.channel.postMessage(withTarget);
        break;
      }
    }
  }

  /**
   * Delete an even and unregister all callbacks associated with it.
   *
   * @param type - The event to delete.
   */
  deleteEvent(type: P['type']) {
    delete this.listeners[type];
  }

  /**
   * Destroy the BroadcastChannel.
   * After calling this, no further messages will be received.
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    this.listeners = {};
    this.listenerCounter = 0;

    Broadcast.instance = null;
  }

  /**
   * Get a list of all available events.
   */
  getEvents(): P['type'][] {
    return Object.keys(this.listeners);
  }
}
