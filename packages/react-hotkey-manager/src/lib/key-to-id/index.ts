import { isMac } from '@/lib/is-mac';
import type { KeyCombination } from '@/types/key-combination';
import type { KeyCombinationId } from '@/types/key-combination-id';

/**
 * Converts a key combination to a standard key id.
 *
 * Handles auto mac style
 *
 * @internal
 * @param key Key combination
 */
export function keyToId(key: KeyCombination): KeyCombinationId {
  const ctrl =
    isMac && key.autoMacStyle
      ? key.meta
        ? 'ctrl'
        : 'no-ctrl'
      : key.ctrl
        ? 'ctrl'
        : 'no-ctrl';

  const meta =
    isMac && key.autoMacStyle
      ? key.ctrl
        ? 'meta'
        : 'no-meta'
      : key.meta
        ? 'meta'
        : 'no-meta';

  return [
    key.code,
    key.alt ? 'alt' : 'no-alt',
    ctrl,
    meta,
    key.shift ? 'shift' : 'no-shift',
  ].join('|');
}
