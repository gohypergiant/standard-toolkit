import { eventToId } from '@/lib/event-to-id';
import { heldId } from '@/lib/held-id';
import { isInputField } from '@/lib/is-input-field';
import { eventStore } from '@/stores/event-store';
import { hotkeyStore } from '@/stores/hotkey-store';

/**
 * Handles the `keydown` event.
 *
 * @internal
 * @param event The `keydown` event.
 */
export function handleOnKeyDown(event: KeyboardEvent) {
  const keyId = eventToId(event);

  const configs = hotkeyStore.getState().getHotkeysForKeyCombination(keyId);

  if (!configs) {
    return;
  }

  const isInput = isInputField(event);

  for (const config of configs) {
    // Skip if the hotkey is not allowed to fire on input fields
    if (isInput && !config.allowInputFields) {
      continue;
    }

    const key = config.key.find((key) => key.id === keyId);

    /* istanbul ignore if -- @preserve */
    if (!key) {
      console.warn(
        `Hotkey ${config.id} was activated to ${keyId} but no matching key was found.`,
      );
      continue;
    }

    // Fire `onKeyDown` action, if it exists.
    config.onKeyDown?.(event, key, config);

    if (config.onKeyHeld) {
      const id = heldId(keyId, config.id);

      // If a held timeout already exists, skip this keydown event
      if (eventStore.getState().hasHeldTimeout(id)) {
        continue;
      }

      const timeout = window.setTimeout(() => {
        config.onKeyHeld?.(event, key, config);
        eventStore.getState().addHeldTriggered(id);
      }, config.heldThresholdMs);

      eventStore.getState().addHeldTimeout(id, timeout);
    }
  }
}
