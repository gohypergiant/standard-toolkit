import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import { setClockInterval, setClockTimeout } from './index';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('timers', () => {
  const ms = 1000;

  it('setClockInterval', () => {
    const callback = vi.fn();
    const cleanup = setClockInterval(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });

  it('setClockTimeout', () => {
    const callback = vi.fn();
    const cleanup = setClockTimeout(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
    expect(cleanup).toBeTypeOf('function');
  });
});
