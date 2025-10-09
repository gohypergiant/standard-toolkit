import type { HeldId } from '@/types/held-id';
import type { HotkeyId } from '@/types/hotkey-id';
import type { KeyCombinationId } from '@/types/key-combination-id';

/**
 * Creates a standard id for tracking when a key is held down.
 *
 * @internal
 * @param keyId The standard key id
 * @param configId The hotkey id
 */
export function heldId(keyId: KeyCombinationId, configId: HotkeyId): HeldId {
  return `${keyId}::${configId}`;
}
