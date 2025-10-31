import { handleOnKeyDown } from '@/actions/handle-on-key-down';
import { handleOnKeyUp } from '@/actions/handle-on-key-up';
import { isClient } from '@/lib/is-client';
import { eventStore } from '@/stores/event-store';

/**
 * Unbinds the hotkey listener from the global window object.
 *
 * Safe to call on the server.
 */
export function globalUnbind() {
  if (!isClient) {
    return;
  }

  // Get the event store state
  const state = eventStore.getState();

  // Check if already unbound
  if (!state.bound) {
    return;
  }

  window.removeEventListener('keydown', handleOnKeyDown);
  window.removeEventListener('keyup', handleOnKeyUp);

  // Mark as unbound
  state.setBound(false);
}
