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

import { isUUID, type UniqueId, uuid } from '@accelint/core';
import { DEFAULT_CONFIG } from './constants';
import type { StructuredCloneable } from 'type-fest';
import type {
  BroadcastConfig,
  EmitOptions,
  ExtractEvent,
  Listener,
  Payload,
} from './types';

/**
 * Broadcast event class allows for emitting and listening for events across browser contexts using the BroadcastChannel API.
 *
 * @template P - Union type of event payloads, must include `type` string property
 *
 * @example
 * ```typescript
 * type MyEvents =
 *   | Payload<'USER_LOGIN', { userId: string }>
 *   | Payload<'USER_LOGOUT'>;
 *
 * const bus = new Broadcast<MyEvents>();
 * bus.on('USER_LOGIN', (event) => {
 *   console.log('User logged in:', event.payload.userId);
 * });
 * bus.emit('USER_LOGIN', { userId: '123' });
 * ```
 */
export class Broadcast<
  P extends { type: string; payload?: unknown; target?: UniqueId } = Payload<
    string,
    StructuredCloneable
  >,
> {
  protected channel: BroadcastChannel | null = null;
  protected channelName = DEFAULT_CONFIG.channelName;
  protected listeners: Partial<Record<P['type'], Listener<P>[]>> = {};
  protected emitOptions: Map<P['type'], EmitOptions> = new Map();

  readonly id = uuid();

  // biome-ignore lint/suspicious/noExplicitAny: Can't use generics in static properties
  private static instance: Broadcast<any> | null = null;

  /** Broadcast class constructor. */
  constructor(config?: BroadcastConfig) {
    if (config?.channelName) {
      this.channelName = config.channelName;
    }

    this.init();
  }

  /**
   * Get the singleton instance of Broadcast.
   *
   * @template T - Union type of event payloads
   * @param config - Optional custom configuration for channel name and debug settings
   * @returns The singleton Broadcast instance typed with the provided event union
   *
   * @example
   * ```typescript
   * const bus = Broadcast.getInstance<MyEvents>({ channelName: 'my-app' });
   * ```
   */
  static getInstance<
    T extends { type: string; payload?: unknown } = Payload<
      string,
      StructuredCloneable
    >,
  >(config?: BroadcastConfig) {
    Broadcast.instance ??= new Broadcast<T>(config);

    return Broadcast.instance as Broadcast<T>;
  }

  /**
   * Initialize the BroadcastChannel and set up event listeners.
   * Called automatically by the constructor.
   *
   * @example
   * ```typescript
   * // Called internally by constructor
   * protected init() { ... }
   * ```
   */
  protected init() {
    this.channel = new BroadcastChannel(this.channelName);
    this.channel.onmessage = this.onMessage.bind(this);
    this.channel.onmessageerror = this.onError.bind(this);
  }

  /**
   * Process incoming messages from the BroadcastChannel.
   *
   * @param event - Incoming message event containing event data
   *
   * @example
   * ```typescript
   * // Called automatically by BroadcastChannel
   * this.channel.onmessage = this.onMessage.bind(this);
   * ```
   */
  protected onMessage(event: MessageEvent<P>) {
    this.handleListeners(event.data);
  }

  /**
   * Handle errors from the BroadcastChannel.
   *
   * @param error - Error event from BroadcastChannel
   *
   * @example
   * ```typescript
   * // Called automatically by BroadcastChannel
   * this.channel.onmessageerror = this.onError.bind(this);
   * ```
   */
  protected onError(error: MessageEvent<Error>) {
    console.error('BroadcastChannel message error', error);
  }

  /**
   * Iterate through listeners for the given topic and invoke callbacks if criteria match.
   *
   * @param data - The event payload containing `type`, optional `payload`, and optional `target`.
   *
   * @remarks
   * If `target` is provided, delivery is scoped to a specific browser context.
   * We assume exactly one bus instance per context, so events are delivered only when
   * `target === this.id`. If omitted, the event is treated as a broadcast within
   * this context (audience filtering may occur elsewhere).
   *
   * @example
   * ```typescript
   * // Called internally when messages arrive
   * protected handleListeners(data: P) { ... }
   * ```
   */
  protected handleListeners(data: P) {
    const handlers = this.listeners[data.type as P['type']];

    /**
     * If no handler exists or if event targets a specific instance of Broadcast that isn't this instance, do nothing
     */
    if (!handlers?.length || (data.target && data.target !== this.id)) {
      return;
    }

    for (const handler of handlers) {
      const { id, once, callback } = handler;

      callback(data);

      if (once) {
        this.removeListener(data.type, id);
      }
    }
  }

  /**
   * Removes a listener by id.
   *
   * @param type - The event type.
   * @param id - ID of the listener to remove.
   *
   * @example
   * ```typescript
   * // Called internally or via unsubscribe callback
   * protected removeListener(type, listenerId);
   * ```
   */
  protected removeListener(type: P['type'], id: UniqueId) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(
        (handler) => handler.id !== id,
      );
    }
  }

  /**
   * Add a listener for an event type, creating the listeners array if it doesn't exist.
   *
   * @param type - The event type.
   * @param listener - The listener object to add.
   *
   * @example
   * ```typescript
   * // Called internally by on() and once()
   * protected addListener(type, { id, callback, once });
   * ```
   */
  protected addListener(type: P['type'], listener: Listener<P>) {
    this.listeners[type] ??= [];
    this.listeners[type].push(listener);
  }

  /**
   * Set emit options for event by type, options will apply to all emits of this event.
   *
   * Keep in mind that options are merged: global, event, local (lowest to highest precedence).
   *
   * @param type - Event type
   * @param options - Emit options to apply, or null to clear options
   *
   * @example
   * ```typescript
   * bus.setEventEmitOptions('USER_LOGIN', { target: 'self' });
   * bus.setEventEmitOptions('USER_LOGOUT', null); // Clear options
   * ```
   */
  setEventEmitOptions(type: P['type'], options: EmitOptions | null) {
    if (options) {
      this.emitOptions.set(type, options);
    } else {
      this.emitOptions.delete(type);
    }
  }

  /**
   * Set a series of events emit options.
   *
   * @param events - Map of event type to options
   *
   * @example
   * ```typescript
   * const options = new Map([
   *   ['USER_LOGIN', { target: 'self' }],
   *   ['BROADCAST_MESSAGE', { target: 'others' }]
   * ]);
   * bus.setEventsEmitOptions(options);
   * ```
   */
  setEventsEmitOptions(events: Map<P['type'], EmitOptions | null>) {
    for (const [type, options] of events) {
      this.setEventEmitOptions(type, options);
    }
  }

  /**
   * Set global emit options, the lowest precedence options, to be merged with event emit options and local options.
   *
   * @param options - Emit options to apply globally, or null to clear
   *
   * @example
   * ```typescript
   * bus.setGlobalEmitOptions({ target: 'others' });
   * ```
   */
  setGlobalEmitOptions(options: EmitOptions | null) {
    this.setEventEmitOptions(this.id, options);
  }

  /**
   * Register a callback to be executed when a message of the specified event type is received.
   *
   * @template T - The event type, must be one of P['type']
   * @param type - The event type to listen for
   * @param callback - The callback function to execute
   * @returns Unsubscribe function to remove the listener
   *
   * @example
   * ```typescript
   * const unsubscribe = bus.on('MAP_CLICK', (e) => {
   *   if (!e.payload.picked) {
   *     setSelected(null);
   *   }
   * });
   * // Later: unsubscribe()
   * ```
   */
  on<T extends P['type']>(
    type: T,
    callback: (data: ExtractEvent<P, T>) => void,
  ) {
    const id = uuid();

    this.addListener(type, { callback, id, once: false } as Listener<P>);

    return () => this.removeListener(type, id);
  }

  /**
   * Register a callback to be executed only once for a specified event type.
   *
   * @template T - The event type, must be one of P['type']
   * @param type - The event type to listen for
   * @param callback - The callback function to execute
   * @returns Unsubscribe function to remove the listener
   *
   * @example
   * ```typescript
   * const unsubscribe = bus.once('USER_LOGIN', (event) => {
   *   console.log('First login:', event.payload.userId);
   * });
   * // Automatically removed after first invocation
   * ```
   */
  once<T extends P['type']>(
    type: T,
    callback: (data: ExtractEvent<P, T>) => void,
  ) {
    const id = uuid();

    this.addListener(type, { callback, id, once: true } as Listener<P>);

    return () => this.removeListener(type, id);
  }

  /**
   * Unregister callback for the specified event type.
   *
   * @template T - The event type, must be one of P['type']
   * @param type - The event type to unregister from
   * @param callback - The callback function to remove
   *
   * @example
   * ```typescript
   * const handler = (event) => console.log(event);
   * bus.on('USER_LOGIN', handler);
   * bus.off('USER_LOGIN', handler); // Remove specific handler
   * ```
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
   * @param payload - The event payload -- must be serializable by the structured clone algorithm. (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
   * @param options - Emit options to control delivery.
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
  emit<T extends P['type']>(
    type: T,
    payload?: never,
    options?: EmitOptions,
  ): void;
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

    const { target = 'all' } = {
      ...this.emitOptions.get(this.id),
      ...this.emitOptions.get(type),
      ...options,
    };
    const message = {
      type,
      payload,
      source: this.id,
      target: target === 'self' ? this.id : isUUID(target) ? target : undefined,
    } as unknown as P;

    if (message.target !== this.id) {
      this.channel.postMessage(message);
    }

    if (target !== 'others') {
      this.handleListeners(message);
    }
  }

  /**
   * Delete an event and unregister all callbacks associated with it.
   *
   * @param type - The event type to delete
   *
   * @example
   * ```typescript
   * bus.deleteEvent('USER_LOGIN'); // Removes all listeners for this event
   * ```
   */
  deleteEvent(type: P['type']) {
    delete this.listeners[type];

    this.emitOptions.delete(type);
  }

  /**
   * Destroy the BroadcastChannel.
   * After calling this, no further messages will be received.
   *
   * @example
   * ```typescript
   * bus.destroy();
   * // Bus is now closed and cannot receive messages
   * ```
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
      this.channelName = DEFAULT_CONFIG.channelName;
    }

    this.listeners = {};
    this.emitOptions = new Map();

    Broadcast.instance = null;
  }
}
