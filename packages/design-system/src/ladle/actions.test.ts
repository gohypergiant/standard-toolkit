import { action } from '@ladle/react';
import { describe, expect, it, vi } from 'vitest';
import { actions } from './actions';

vi.mock('@ladle/react', () => ({
  action: vi.fn(() => () => {}),
}));

describe('actions', () => {
  it('should return action handler props', () => {
    const props = actions<{ onChange: () => void }>('onChange');

    expect(props).toEqual({
      onChange: expect.any(Function),
    });

    props.onChange?.();

    expect(action).toHaveBeenCalledWith('onChange');
  });
});
