import { afterEach, describe, expect, it } from 'vitest';
import { eventStore } from '.';

describe('eventStore', () => {
  afterEach(() => {
    // Reset the store state before each test
    eventStore.setState(eventStore.getInitialState());
  });

  describe('bound state', () => {
    it('should initialize with bound as false', () => {
      expect(eventStore.getState().bound).toBe(false);
    });

    it('should update bound state when setBound is called', () => {
      eventStore.getState().setBound(true);
      expect(eventStore.getState().bound).toBe(true);

      eventStore.getState().setBound(false);
      expect(eventStore.getState().bound).toBe(false);
    });
  });

  describe('heldTimeouts', () => {
    it('should initialize with empty heldTimeouts map', () => {
      expect(eventStore.getState().heldTimeouts.size).toBe(0);
    });

    it('should add a held timeout', () => {
      const id = 'test-id';
      const timeout = 1000;

      eventStore.getState().addHeldTimeout(id, timeout);
      expect(eventStore.getState().heldTimeouts.get(id)).toBe(timeout);
    });

    it('should remove a held timeout', () => {
      const id = 'test-id';
      const timeout = 1000;

      eventStore.getState().addHeldTimeout(id, timeout);
      expect(eventStore.getState().heldTimeouts.get(id)).toBe(timeout);

      eventStore.getState().removeHeldTimeout(id);
      expect(eventStore.getState().heldTimeouts.has(id)).toBe(false);
    });

    it('should handle removing non-existent timeout', () => {
      const id = 'non-existent-id';

      // Should not throw when removing non-existent timeout
      expect(() => {
        eventStore.getState().removeHeldTimeout(id);
      }).not.toThrow();
    });

    it('should return true if hasHeldTimeout finds the id', () => {
      const id = 'test-id';
      const timeout = 1000;
      eventStore.getState().addHeldTimeout(id, timeout);
      expect(eventStore.getState().hasHeldTimeout(id)).toBe(true);
    });

    it('should return false if hasHeldTimeout does not find the id', () => {
      const id = 'missing-id';
      expect(eventStore.getState().hasHeldTimeout(id)).toBe(false);
    });
  });

  describe('heldTriggered', () => {
    it('should initialize with empty heldTriggered set', () => {
      expect(eventStore.getState().heldTriggered.size).toBe(0);
    });

    it('should add to heldTriggered', () => {
      const id = 'test-id';

      eventStore.getState().addHeldTriggered(id);
      expect(eventStore.getState().heldTriggered.has(id)).toBe(true);
    });

    it('should remove from heldTriggered', () => {
      const id = 'test-id';

      eventStore.getState().addHeldTriggered(id);
      expect(eventStore.getState().heldTriggered.has(id)).toBe(true);

      eventStore.getState().removeHeldTriggered(id);
      expect(eventStore.getState().heldTriggered.has(id)).toBe(false);
    });

    it('should handle removing non-existent id from heldTriggered', () => {
      const id = 'non-existent-id';

      // Should not throw when removing non-existent id
      expect(() => {
        eventStore.getState().removeHeldTriggered(id);
      }).not.toThrow();
    });
  });
});
