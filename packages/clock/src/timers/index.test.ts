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

    setClockInterval(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
  });

  it('setClockTimeout', () => {
    const callback = vi.fn();

    setClockTimeout(callback, ms);

    // Tick to next second
    vi.advanceTimersByTime(ms);
    // Tick from iternal timer
    vi.advanceTimersByTime(ms);

    expect(callback).toHaveBeenCalled();
  });
});
