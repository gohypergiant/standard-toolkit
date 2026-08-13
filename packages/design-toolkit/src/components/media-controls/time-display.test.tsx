/*
 * Copyright 2026 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TimeDisplayProps } from './types';

// Mock media-chrome components
vi.mock('media-chrome/react', () => ({
  MediaTimeDisplay: vi.fn(({ children, remaining, ...props }) => (
    <span
      data-testid='media-time-display'
      {...props}
      {...(remaining ? { remaining: '' } : {})}
    >
      0:00
    </span>
  )),
  MediaDurationDisplay: vi.fn(({ children, ...props }) => (
    <span data-testid='media-duration-display' {...props}>
      3:45
    </span>
  )),
}));

// Mock media-chrome store hooks
const mockMediaDuration = vi.fn(() => 100 as number | undefined);
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => {
    const state = { mediaDuration: mockMediaDuration() };
    return selector(state);
  }),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
}));

// Import after mocking
import { MediaControlsProvider } from './context';
import { TimeDisplay } from './time-display';

function setup(props: Partial<TimeDisplayProps> = {}) {
  render(<TimeDisplay {...props} />);
  return props;
}

describe('TimeDisplay', () => {
  beforeEach(() => {
    mockMediaDuration.mockReturnValue(100); // Default to loaded state
  });

  it('should render MediaTimeDisplay by default when media is loaded', () => {
    setup();
    expect(screen.getByTestId('media-time-display')).toBeInTheDocument();
  });

  it('should show placeholder when media is not loaded', () => {
    mockMediaDuration.mockReturnValue(undefined);
    setup();
    expect(screen.getByText('hh:mm:ss')).toBeInTheDocument();
    expect(screen.queryByTestId('media-time-display')).not.toBeInTheDocument();
  });

  it('should show placeholder when media duration is zero', () => {
    mockMediaDuration.mockReturnValue(0);
    setup();
    expect(screen.getByText('hh:mm:ss')).toBeInTheDocument();
    expect(screen.queryByTestId('media-time-display')).not.toBeInTheDocument();
  });

  it('should show custom placeholder when provided', () => {
    mockMediaDuration.mockReturnValue(undefined);
    setup({ placeholder: '--:--' });
    expect(screen.getByText('--:--')).toBeInTheDocument();
  });

  it('should pass className to the wrapper', () => {
    setup({ className: 'custom-class' });
    const wrapper = screen.getByTestId('media-time-display').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  describe('mode prop', () => {
    it('should show current time when mode is "current"', () => {
      setup({ mode: 'current' });
      const timeDisplay = screen.getByTestId('media-time-display');
      expect(timeDisplay).toBeInTheDocument();
      expect(timeDisplay).not.toHaveAttribute('remaining');
    });

    it('should show remaining time when mode is "remaining"', () => {
      setup({ mode: 'remaining' });
      const timeDisplay = screen.getByTestId('media-time-display');
      expect(timeDisplay).toHaveAttribute('remaining', '');
    });

    it('should show duration when mode is "duration"', () => {
      setup({ mode: 'duration' });
      expect(screen.getByTestId('media-duration-display')).toBeInTheDocument();
      expect(
        screen.queryByTestId('media-time-display'),
      ).not.toBeInTheDocument();
    });

    it('should show placeholder when mode is "remaining" and media is not loaded', () => {
      mockMediaDuration.mockReturnValue(undefined);
      setup({ mode: 'remaining' });
      expect(screen.getByText('hh:mm:ss')).toBeInTheDocument();
      expect(
        screen.queryByTestId('media-time-display'),
      ).not.toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should have data-disabled attribute when isDisabled', () => {
      setup({ isDisabled: true });
      const wrapper = screen.getByTestId('media-time-display').parentElement;
      expect(wrapper).toHaveAttribute('data-disabled');
    });

    it('should have data-disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <TimeDisplay />
        </MediaControlsProvider>,
      );
      const wrapper = screen.getByTestId('media-time-display').parentElement;
      expect(wrapper).toHaveAttribute('data-disabled');
    });

    it('should be disabled when context is disabled regardless of prop', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <TimeDisplay isDisabled={false} />
        </MediaControlsProvider>,
      );
      const wrapper = screen.getByTestId('media-time-display').parentElement;
      expect(wrapper).toHaveAttribute('data-disabled', 'true');
    });
  });
});
