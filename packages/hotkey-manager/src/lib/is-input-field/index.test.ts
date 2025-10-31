import { describe, expect, it } from 'vitest';
import { isInputField } from '@/lib/is-input-field';

describe('isInputField', () => {
  it('should return false if no target', () => {
    const event = new KeyboardEvent('keydown');

    expect(isInputField(event)).toBe(false);
  });

  it('should return false if target is not an input', () => {
    const target = document.createElement('div');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(false);
  });

  it('should return true if target is an input', () => {
    const target = document.createElement('input');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });

  it('should return true if target is a text area', () => {
    const target = document.createElement('textarea');
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });

  it('should return true if target is content editable', () => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    target.contentEditable = 'true';
    const event = new KeyboardEvent('keydown');

    expect(
      isInputField({
        ...event,
        target,
      }),
    ).toBe(true);
  });
});
