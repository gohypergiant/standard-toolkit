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

import { DEFAULT_CONFIG } from './constants';
import type { BroadcastConfig, Listener, Payload } from './types';

function noop() {}

/**
 * Broadcaster class built off of the TabsBroadcast npm package.
 * Provides a singleton event manager using BroadcastChannel,
 * supports targeted messages and strongly typed event payloads.
 */
export class Broadcaster {
  #channelName: string;
  #sender: BroadcastChannel | null = null;
  #receiver: BroadcastChannel | null = null;
  #listeners: Record<string, Listener[]> = {};
  #listenerCounter = 0;

  private static instance: Broadcaster | null = null;

  constructor(config?: BroadcastConfig) {
    this.#channelName = config?.channelName ?? DEFAULT_CONFIG.channelName;

    this.#init();
  }

  /**
   * Get the singleton instance of Broadcaster.
   * @param config - Optional custom configuration.
   * @returns Singleton instance of Broadcaster.
   */
  static getInstance(config?: BroadcastConfig) {
    if (!Broadcaster.instance) {
      Broadcaster.instance = new Broadcaster(config);
    }

    return Broadcaster.instance;
  }

  /**
   * Initialize the BroadcastChannel and set up event listeners.
   * @private
   */
  #init() {
    if (typeof window === 'undefined') {
      return;
    }

    this.#sender = new BroadcastChannel(this.#channelName);
    this.#receiver = new BroadcastChannel(this.#channelName);
    this.#receiver.onmessage = this.#onMessage.bind(this);
    this.#receiver.onmessageerror = this.#onError.bind(this);
  }

  /**
   * Process incoming messages.
   * @param {MessageEvent<Payload<T>>} event - Incoming message event.
   * @private
   */
  #onMessage<T>(event: MessageEvent<Payload<T>>) {
    this.#handleListeners(event.data);
  }

  /**
   * Handle errors from the BroadcastChannel.
   * @param {MessageEvent<any>} error - Error event.
   * @private
   */
  #onError(error: MessageEvent) {
    console.error('BroadcastChannel message error', error);
  }

  /**
   * Iterate through listeners for the given topic and invoke callbacks if criteria match.
   * @param {Payload<T>} payload - The event payload containing type, payload, targets, and topic.
   * @private
   */
  #handleListeners<T>({ type, payload }: Payload<T>) {
    const handler = this.#listeners[type];

    if (!handler) {
      return;
    }

    for (const item of handler) {
      const { callback, once } = item;

      callback({ type, payload });

      if (once) {
        delete this.#listeners[type];
      }
    }
  }
  /**
   * Removes a listener by id.
   * @param {string} topic - The event topic.
   * @param {number} listenerId - id of the listener.
   * @returns {void}.
   * @private
   */
  #removeListener(type: string, id: number) {
    if (this.#listeners[type]) {
      this.#listeners[type] = this.#listeners[type].filter(
        (handler) => handler.id !== id,
      );
    }
  }

  /**
   * Check for the existence of a event type and create it if missing.
   * @param {string} type - The event type.
   * @returns {Listener[]} The listeners for said event.
   * @private
   */
  #checkOrAddListener(type: string) {
    const handler = this.#listeners[type];

    if (!handler) {
      this.#listeners[type] = [];

      return this.#listeners[type];
    }

    return handler;
  }
  /**
   * Register a callback to be executed when a message of the specified event type is received.
   * @param {string} type - The event type.
   * @param {(data: Payload<T>) => void} callback - The callback function.
   * @returns {() => void} Unsubscribe function.
   */
  on<T>(type: string, callback: (data: Payload<T>) => void) {
    const id = this.#listenerCounter++;

    this.#checkOrAddListener(type).push({ callback, id, once: false });
    return () => this.#removeListener(type, id);
  }

  /**
   * Register multiple callbacks for specified event types.
   * @param {[string, (data: Payload<T>) => void][]} list
   * @returns {() => void[]} Array of unsubscribe functions.
   */
  onList<T>(list: [string, (data: Payload<T>) => void][]) {
    return list.map(([type, callback]) => {
      if (!type || !callback) {
        return noop;
      }

      const id = this.#listenerCounter++;

      this.#checkOrAddListener(type).push({ callback, id, once: false });
      return () => this.#removeListener(type, id);
    });
  }

  /**
   * Register a callback to be executed only once for a specified event type.
   * @param {string} type - The event type.
   * @param {(data: Payload<T>) => void} callback - The callback function.
   * @returns {() => void} Unsubscribe function.
   */
  once<T>(type: string, callback: (data: Payload<T>) => void) {
    const id = this.#listenerCounter++;

    this.#checkOrAddListener(type).push({ callback, id, once: true });
    return () => this.#removeListener(type, id);
  }

  /**
   * Register multiple one-time callbacks for specified event types.
   * @param {[string, (data: Payload<T>) => void][]} list - Array of tuples [event type, callback].
   * @returns {() => void[]} Array of unsubscribe functions.
   */
  onceList<T>(list: [string, (data: Payload<T>) => void][]) {
    return list.map(([type, callback]) => {
      if (!type || !callback) {
        return noop;
      }

      const id = this.#listenerCounter++;

      this.#checkOrAddListener(type).push({ callback, id, once: true });
      return () => this.#removeListener(type, id);
    });
  }

  /**
   * Unregister all callbacks for the specified event type.
   * @param {string} type - The event type.
   */
  off<T>(type: string, callback: (data: Payload<T>) => void) {
    if (this.#listeners[type]) {
      this.#listeners[type] = this.#listeners[type].filter(
        (listener) => listener.callback !== callback,
      );
    }
  }

  /**
   * Emit an event to all listening contexts.
   * @param {string} type - The event type.
   * @param {T} payload - The event payload.
   */
  emit<T>(type: string, payload: T) {
    if (!this.#sender) {
      console.warn('Cannot emit: BroadcastChannel is not initialized.');
      return;
    }

    const message = { type, payload };

    this.#sender.postMessage(message);
  }

  /**
   * Delete an even and unregister all callbacks associated with it.
   * @param {string} type - The event to delete.
   */
  deleteEvent(type: string) {
    delete this.#listeners[type];
  }

  /**
   * Destroy the BroadcastChannel.
   * After calling this, no further messages will be received.
   */
  destroy() {
    if (this.#sender) {
      this.#sender.close();
      this.#sender = null;
    }

    if (this.#receiver) {
      this.#receiver.close();
      this.#receiver = null;
    }

    Broadcaster.instance = null;
  }

  /**
   * Get a list of all available events.
   * @returns {string[]} Array of event names.
   */
  getEvents(): string[] {
    return Object.keys(this.#listeners);
  }
}
