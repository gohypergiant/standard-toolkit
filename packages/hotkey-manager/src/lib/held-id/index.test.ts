import { describe, expect, it } from 'vitest';
import { heldId } from '@/lib/held-id';

describe('heldId', () => {
  it('should make id', () => {
    expect(heldId('key', 'config')).toEqual('key::config');
  });
});
