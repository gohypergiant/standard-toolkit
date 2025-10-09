import type { KeyCombination } from '@/types/key-combination';

/**
 * A partial key combination object.
 */
export type KeyOption = Partial<Omit<KeyCombination, 'code' | 'id'>> &
  Pick<KeyCombination, 'code'>;
