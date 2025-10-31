import { handleOnKeyDown } from '@/actions/handle-on-key-down';
import { handleOnKeyUp } from '@/actions/handle-on-key-up';
import { isClient } from '@/lib/is-client';
import { eventStore } from '@/stores/event-store';

/**
 * Binds the hotkey listener to the global window object.
 *
 * Safe to call on the server.
 */
export function globalBind() {
  // Exit if running on a server
  if (!isClient) {
    return;
  }

  // Get the event store state
  const state = eventStore.getState();

  // Check if already bound
  if (state.bound) {
    return;
  }

  window.addEventListener('keydown', handleOnKeyDown);
  window.addEventListener('keyup', handleOnKeyUp);

  // Mark as bound
  state.setBound(true);
}
