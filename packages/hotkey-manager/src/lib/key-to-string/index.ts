import type { KeyCombination } from '@/types/key-combination';

export function keyToString(key: KeyCombination): string {
  return [
    key.ctrl ? '[CTRL]' : undefined,
    key.meta ? '[Win/⌘]' : undefined,
    key.alt ? '[ALT]' : undefined,
    key.shift ? '[SHIFT]' : undefined,
    `[${key.code}]`,
  ]
    .filter(Boolean)
    .join(' + ');
}
