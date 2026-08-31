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

import { useCallback, useEffect, useRef } from 'react';

/**
 * Configuration for a pointer-driven interaction session.
 *
 * @template Session - Mutable state carried through a single interaction.
 */
export type MouseInteractionConfig<Session, Payload = void> = {
  /**
   * Called on pointerdown. Return the session state, or null to abort.
   *
   * @remarks `payload` carries whatever the caller passed to `handleStart`,
   * which lets one element's handler describe what it started -- a resize
   * handle naming its direction, for instance.
   */
  onStart: (event: PointerEvent, payload: Payload) => Session | null;
  /**
   * Called on each pointermove while a session is active.
   *
   * @remarks The session object persists across the whole gesture and may be
   * mutated in place to carry state between moves.
   */
  onMove: (event: PointerEvent, session: Session) => void;
  /** Optional. Called on pointerup or pointercancel, ending the session. */
  onEnd?: (event: PointerEvent, session: Session) => void;
  /** Optional guard run before onStart; return false to ignore the event. */
  shouldStart?: (event: PointerEvent) => boolean;
};

/**
 * Runs a pointer-driven interaction (drag, resize) against document-level
 * listeners so the gesture keeps tracking when the pointer leaves the element.
 *
 * @param config - Session lifecycle callbacks.
 * @returns A `handleStart` handler to attach to the element that begins the gesture.
 *
 * @remarks
 * Listeners are registered only for the duration of a session and torn down
 * with an AbortController, which also covers unmounting mid-gesture.
 *
 * @example
 * ```ts
 * const { handleStart } = useMouseInteraction({
 *   onStart: (event) => ({ startX: event.clientX }),
 *   onMove: (event, session) => move(event.clientX - session.startX),
 *   onEnd: () => commit(),
 * });
 * ```
 */
export function useMouseInteraction<Session, Payload = void>({
  onStart,
  onMove,
  onEnd,
  shouldStart,
}: MouseInteractionConfig<Session, Payload>) {
  const sessionRef = useRef<Session | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Callbacks are read from refs so a session started with one render's
  // handlers keeps working after a re-render without re-binding listeners.
  const handlers = useRef({ onStart, onMove, onEnd, shouldStart });
  handlers.current = { onStart, onMove, onEnd, shouldStart };

  const endSession = useCallback(() => {
    sessionRef.current = null;
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const handleStart = useCallback(
    (event: PointerEvent, payload: Payload) => {
      if (handlers.current.shouldStart?.(event) === false) {
        return;
      }

      const session = handlers.current.onStart(event, payload);

      if (session === null) {
        return;
      }

      // A second press before the first releases -- a lost pointerup, or a
      // resize handle pressed mid-drag -- would otherwise strand the previous
      // controller's listeners, leaving two sessions driving the same card.
      abortRef.current?.abort();

      sessionRef.current = session;
      event.preventDefault();

      const controller = new AbortController();
      abortRef.current = controller;

      const handleMove = (moveEvent: PointerEvent) => {
        if (sessionRef.current === null) {
          return;
        }

        handlers.current.onMove(moveEvent, sessionRef.current);
      };

      const handleEnd = (endEvent: PointerEvent) => {
        if (sessionRef.current === null) {
          return;
        }

        handlers.current.onEnd?.(endEvent, sessionRef.current);
        endSession();
      };

      const options = { signal: controller.signal };

      document.addEventListener('pointermove', handleMove, options);
      document.addEventListener('pointerup', handleEnd, options);
      document.addEventListener('pointercancel', handleEnd, options);
    },
    [endSession],
  );

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  return { handleStart };
}
