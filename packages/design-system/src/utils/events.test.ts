import { describe, expect, it, vi } from 'vitest';
import { continuePropagation } from './events';

describe('utils/events', () => {
  describe('continuePropagation', () => {
    it('should call method to allow event to propagate', () => {
      const event = {
        continuePropagation: vi.fn(),
      };

      continuePropagation(event);

      expect(event.continuePropagation).toHaveBeenCalledOnce();
    });
  });
});
