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

import { isUUID, type UniqueId, uuid } from '@accelint/core';
import {
  CONNECTION_EVENT_TYPES,
  DEFAULT_CONFIG,
  DEFAULT_TARGET,
} from './constants';
import type { StructuredCloneable } from 'type-fest';
import type {
  BasicPayload,
  BroadcastConfig,
  EmitOptions,
  ExtractEvent,
  Listener,
  Payload,
} from './types';

/**
 * Broadcast event class allows for emitting and listening for events across browser contexts.
 *
 * @template Events - The payload type union for all events handled by this broadcast instance.
 *
 * @example
 * ```typescript
 * const bus = new Broadcast({ channelName: 'my-app' });
 * bus.on('user:login', (event) => console.log(event.payload));
 * bus.emit('user:login', { userId: '123' });
 * ```
 */
export class Broadcast<
  Events extends BasicPayload = Payload<string, StructuredCloneable>,
> {
  protected channel: BroadcastChannel | null = null;
  protected channelName = DEFAULT_CONFIG.channelName;
  protected listeners: Partial<Record<Events['type'], Listener<Events>[]>> = {};
  protected emitOptions: Map<Events['type'], EmitOptions> = new Map();

  /**
   * A UUID for this instance to help identify source and target of events
   */
  readonly id = uuid();

  private _connected = new Set<UniqueId>();
  /**
   * A list of ids of other bus instances communicating with this instance
   */
  get connected(): ReadonlySet<UniqueId> {
    return this._connected;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Can't use generics in static properties
  private static instance: Broadcast<any> | null = null;

  /**
   * Broadcast class constructor.
   *
   * @param config - Optional broadcast configuration.
   */
  constructor(config?: BroadcastConfig) {
    if (config?.channelName) {
      this.channelName = config.channelName;
    }

    this.init();
    this.ping();
  }

  /**
   * Get the singleton instance of Broadcaster.
   *
   * @template T - The payload type union for all events handled by this broadcast instance.
   * @param config - Optional custom configuration.
   * @returns The singleton Broadcast instance.
   *
   * @example
   * ```typescript
   * const bus = Broadcast.getInstance<MyEvents>();
   * bus.emit('custom:event', { data: 'value' });
   * ```
   */
  static getInstance<
    Type extends BasicPayload = Payload<string, StructuredCloneable>,
  >(config?: BroadcastConfig) {
    Broadcast.instance ??= new Broadcast<Type>(config);

    return Broadcast.instance as Broadcast<Type>;
  }

  /**
   * Initialize the BroadcastChannel and set up event listeners.
   */
  protected init() {
    this.channel = new BroadcastChannel(this.channelName);
    this.channel.onmessage = this.onMessage;
    this.channel.onmessageerror = this.onError;

    this.on(CONNECTION_EVENT_TYPES.stop, ({ source }) => {
      this._connected.delete(source);
    });

    this.on(CONNECTION_EVENT_TYPES.ping, ({ source }) => {
      if (typeof document !== 'undefined' && document.hidden) {
        return;
      }

      this._connected.add(source);

      this.emit(CONNECTION_EVENT_TYPES.echo, undefined, { target: source });
    });

    this.on(CONNECTION_EVENT_TYPES.echo, ({ source }) => {
      this._connected.add(source);
    });

    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  /**
   * Process incoming messages.
   *
   * @param event - Incoming message event.
   */
  protected onMessage = (event: MessageEvent<Events>) => {
    this.handleListeners(event.data);
  };

  /**
   * Handle errors from the BroadcastChannel.
   *
   * @param error - Error event.
   */
  protected onError(error: MessageEvent<Error>) {
    console.error('BroadcastChannel message error', error);
  }

  /**
   * Browser only, handler for tab visibility changes:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
   */
  protected onVisibilityChange = () => {
    if (typeof document === 'undefined') {
      return;
    }

    if (document.hidden) {
      this.emit(CONNECTION_EVENT_TYPES.stop, undefined, { target: 'others' });
    } else {
      this.ping();
    }
  };

  /**
   * Iterate through listeners for the given topic and invoke callbacks if criteria match.
   *
   * @param data - The event payload containing `type`, optional `payload`, and optional `targetId`.
   *
   * @remarks
   * If `targetId` is provided, delivery is scoped to a specific browser context.
   * We assume exactly one bus instance per context, so events are delivered only when
   * `target === this.id`. If omitted, the event is treated as a broadcast within
   * this context (audience filtering may occur elsewhere).
   */
  protected handleListeners(data: Events) {
    const handlers = this.listeners[data.type as Events['type']];

    // If no handler exists or if event targets a specific instance of Broadcast that isn't this instance, do nothing
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
   * @param topic - The event topic.
   * @param listenerId - id of the listener.
  /**
   * Removes a listener by id.
   *
   * @param type - The event type.
   * @param id - The listener id.
   */
  protected removeListener(type: Events['type'], id: UniqueId) {
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
  protected addListener(type: Events['type'], listener: Listener<Events>) {
    this.listeners[type] ??= [];
    this.listeners[type].push(listener);
  }

  /**
   * Send out a request for an echo from all connected bus instances
   *
   * This will populate the `connected` property. However, due to the
   * nature of event driven systems, this is both not synchronous nor
   * is it possible to async / await for all responses. Listening for
   * the ping & echo events and updating UI to reflect the current state
   * of the connected property is the best solution to maintain the
   * correct list of connections
   */
  ping() {
    this._connected.clear();

    this.emit(CONNECTION_EVENT_TYPES.ping, undefined, { target: 'others' });
  }

  /**
   * Set emit options for event by type, options will apply to all emits of this event
   *
   * Keep in mind that options are merged: global, event, local (lowest to highest precedence)
   *
   * @param type event type
   * @param options emit options
   */
  setEventEmitOptions(type: Events['type'], options: EmitOptions | null) {
    if (options) {
      this.emitOptions.set(type, options);
    } else {
      this.emitOptions.delete(type);
    }
  }

  /**
   * Set a series of events emit options
   *
   * @param events map of event type & options
   */
  setEventsEmitOptions(events: Map<Events['type'], EmitOptions | null>) {
    for (const [type, options] of events) {
      this.setEventEmitOptions(type, options);
    }
  }

  /**
   * Set global emit options, the lowest precedence options, to be merged with event emit options and local options
   *
   * @param options emit options
   */
  setGlobalEmitOptions(options: EmitOptions | null) {
    this.setEventEmitOptions(this.id, options);
  }

  /**
   * Register a callback to be executed when a message of the specified event type is received.
   *
   * @template Type - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param callback - The callback function.
   * @returns Unsubscribe function to remove the listener.
   *
   * @example
   * ```typescript
   * const unsubscribe = bus.on(EVENTS.MAP_CLICK, (e) => {
   *   if (!e.payload.picked) {
   *     setSelected(null);
   *   }
   * });
   * // Later: unsubscribe();
   * ```
   */
  on<Type extends Events['type']>(
    type: Type,
    callback: (data: ExtractEvent<Events, Type>) => void,
  ) {
    const id = uuid();

    this.addListener(type, { callback, id, once: false } as Listener<Events>);

    return () => this.removeListener(type, id);
  }

  /**
   * Register a callback to be executed only once for a specified event type.
   *
   * @template Type - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param callback - The callback function.
   * @returns Unsubscribe function to remove the listener.
   */
  once<Type extends Events['type']>(
    type: Type,
    callback: (data: ExtractEvent<Events, Type>) => void,
  ) {
    const id = uuid();

    this.addListener(type, { callback, id, once: true } as Listener<Events>);

    return () => this.removeListener(type, id);
  }

  /**
   * Unregister callback for the specified event type.
   *
   * @template Type - The Payload type, inferred from the event.
   * @param type - The event type.
   */
  off<Type extends Events['type']>(
    type: Type,
    callback: (data: ExtractEvent<Events, Type>) => void,
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
   * @template Type - The Payload type, inferred from the event.
   * @param type - The event type.
   * @param payload - The event payload -- must be serializable by the structured clone algorithm. (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
   * @param options - Emit options to control delivery.
   *
   * @example
   * ```typescript
   * bus.emit(
   *   EVENTS.LAYER_CLICK,
   *   {
   *     worldSpace: pickInfo.coordinate,
   *     screenSpace: pickInfo.pixel,
   *     index: pickInfo.index,
   *     object: pickInfo.object,
   *   },
   * );
   * ```
   */
  emit<Type extends Events['type']>(
    type: Type,
    payload?: never,
    options?: EmitOptions,
  ): void;
  emit<Type extends Events['type']>(
    type: Type,
    payload: ExtractEvent<Events, Type> extends { payload: infer Data }
      ? Data
      : undefined,
    options?: EmitOptions,
  ): void;
  emit<Type extends Events['type']>(
    type: Type,
    payload?: ExtractEvent<Events, Type> extends { payload: infer Data }
      ? Data
      : undefined,
    options?: EmitOptions,
  ) {
    if (!this.channel) {
      return console.warn('Cannot emit: BroadcastChannel is not initialized.');
    }

    const { target = DEFAULT_TARGET } = {
      ...this.emitOptions.get(this.id),
      ...this.emitOptions.get(type),
      ...options,
    };
    const message = {
      type,
      payload,
      source: this.id,
      target: target === 'self' ? this.id : isUUID(target) ? target : undefined,
    } as unknown as Events;

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
   * @param type - The event to delete.
   */
  deleteEvent(type: Events['type']) {
    delete this.listeners[type];

    this.emitOptions.delete(type);
  }

  /**
   * Destroy the BroadcastChannel.
   * After calling this, no further messages will be received.
   */
  destroy() {
    if (this.channel) {
      this.emit(CONNECTION_EVENT_TYPES.stop, undefined, { target: 'others' });

      this.channel.close();
      this.channel = null;
      this.channelName = DEFAULT_CONFIG.channelName;

      if (typeof globalThis.removeEventListener === 'function') {
        globalThis.removeEventListener(
          'visibilitychange',
          this.onVisibilityChange,
        );
      }
    }

    this._connected.clear();
    this.listeners = {};
    this.emitOptions = new Map();

    Broadcast.instance = null;
  }
}
