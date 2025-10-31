import type { KeyCombinationId } from '@/types/key-combination-id';

/**
 * Converts an event to a standard key id.
 *
 * @internal
 * @param event Triggered event.
 */
export function eventToId(event: KeyboardEvent): KeyCombinationId {
  return [
    event.code,
    event.altKey ? 'alt' : 'no-alt',
    event.ctrlKey ? 'ctrl' : 'no-ctrl',
    event.metaKey ? 'meta' : 'no-meta',
    event.shiftKey ? 'shift' : 'no-shift',
  ].join('|');
}
