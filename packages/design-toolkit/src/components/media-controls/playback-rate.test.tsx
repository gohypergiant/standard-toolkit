/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlaybackRateButtonProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => selector({ mediaPlaybackRate: 1 })),
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaActionTypes: {
    MEDIA_PLAYBACK_RATE_REQUEST: 'mediaplaybackraterequest',
  },
}));

import { useMediaSelector } from 'media-chrome/react/media-store';
// Import after mocking
import { MediaControlsProvider } from './context';
import { PlaybackRateButton } from './playback-rate';

function setup(props: Partial<PlaybackRateButtonProps> = {}) {
  render(<PlaybackRateButton {...props} />);
  return props;
}

describe('PlaybackRateButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default rate
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 1 }),
    );
  });

  it('should render a button', () => {
    setup();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show 1x text when rate is 1', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 1 }),
    );
    setup();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Playback rate 1x',
    );
    expect(screen.getByText('1x')).toBeInTheDocument();
  });

  it('should show 2x text when rate is 2', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 2 }),
    );
    setup();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Playback rate 2x',
    );
    expect(screen.getByText('2x')).toBeInTheDocument();
  });

  it('should show 3x text when rate is 3', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 3 }),
    );
    setup({ rates: [1, 2, 3] });
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Playback rate 3x',
    );
    expect(screen.getByText('3x')).toBeInTheDocument();
  });

  it('should dispatch MEDIA_PLAYBACK_RATE_REQUEST with next rate on click', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 1 }),
    );
    setup({ rates: [0.5, 1, 1.5, 2] });
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplaybackraterequest',
      detail: 1.5,
    });
  });

  it('should cycle back to first rate after last rate', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 2 }),
    );
    setup({ rates: [0.5, 1, 1.5, 2] });
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplaybackraterequest',
      detail: 0.5,
    });
  });

  it('should start from first rate when current rate is not in rates array', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 0.25 }),
    );
    setup({ rates: [0.5, 1, 1.5, 2] });
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplaybackraterequest',
      detail: 0.5,
    });
  });

  it('should pass className to button', () => {
    setup({ className: 'custom-class' });
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should use default rates when not specified', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 3 }),
    );
    setup();
    fireEvent.click(screen.getByRole('button'));
    // Default rates: [1, 2, 3]
    // After 3 should cycle to 1
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplaybackraterequest',
      detail: 1,
    });
  });

  it('should handle empty rates array gracefully by using default rates', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaPlaybackRate: 1 }),
    );
    setup({ rates: [] });
    fireEvent.click(screen.getByRole('button'));
    // Empty rates should fall back to DEFAULT_RATES [1, 2, 3]
    // From rate 1, next should be 2
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplaybackraterequest',
      detail: 2,
    });
  });

  describe('rate validation', () => {
    it('should filter out NaN from rates', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: 1 }),
      );
      setup({ rates: [0.5, Number.NaN, 1, 2] });
      // Should only have valid rates [0.5, 1, 2]
      // From 1, next should be 2
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaplaybackraterequest',
        detail: 2,
      });
    });

    it('should filter out Infinity from rates', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: 1 }),
      );
      setup({ rates: [0.5, Number.POSITIVE_INFINITY, 1, 2] });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaplaybackraterequest',
        detail: 2,
      });
    });

    it('should filter out negative rates', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: 1 }),
      );
      setup({ rates: [-1, 0.5, 1, 2] });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaplaybackraterequest',
        detail: 2,
      });
    });

    it('should filter out zero from rates', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: 1 }),
      );
      setup({ rates: [0, 0.5, 1, 2] });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaplaybackraterequest',
        detail: 2,
      });
    });

    it('should use default rates when all provided rates are invalid', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: 1 }),
      );
      setup({ rates: [Number.NaN, Number.POSITIVE_INFINITY, -1] });
      fireEvent.click(screen.getByRole('button'));
      // Default rates: [1, 2, 3], from 1 next is 2
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaplaybackraterequest',
        detail: 2,
      });
    });

    it('should display first valid rate when current rate is NaN', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: Number.NaN }),
      );
      setup({ rates: [0.5, 1, 1.5, 2] });
      // Display should fall back to first rate
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Playback rate 0.5x',
      );
      expect(screen.getByText('0.5x')).toBeInTheDocument();
    });

    it('should display first valid rate when current rate is negative', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaPlaybackRate: -1 }),
      );
      setup({ rates: [0.5, 1, 1.5, 2] });
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Playback rate 0.5x',
      );
    });
  });

  describe('disabled state', () => {
    it('should render disabled button when isDisabled is true', () => {
      setup({ isDisabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not dispatch playback rate change when disabled', () => {
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <PlaybackRateButton />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should allow isDisabled prop to override context', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <PlaybackRateButton isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
