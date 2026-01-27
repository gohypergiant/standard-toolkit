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
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SeekButtonProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => {
    // Default state: currentTime = 30, duration = 100
    const state = { mediaCurrentTime: 30, mediaDuration: 100 };
    return selector(state);
  }),
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaActionTypes: {
    MEDIA_SEEK_REQUEST: 'mediaseekrequest',
  },
}));

import { useMediaSelector } from 'media-chrome/react/media-store';
// Import after mocking
import { MediaControlsProvider } from './context';
import { SeekButton } from './seek-button';

function setup(
  props: Partial<SeekButtonProps> & { direction: 'forward' | 'backward' },
) {
  render(<SeekButton {...props} />);
  return props;
}

describe('SeekButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default state
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaCurrentTime: 30, mediaDuration: 100 }),
    );
  });

  describe('forward direction', () => {
    it('should render a button', () => {
      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have forward aria-label', () => {
      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Seek forward 10 seconds',
      );
    });

    it('should dispatch MEDIA_SEEK_REQUEST with positive offset when clicked', () => {
      setup({ direction: 'forward' });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 40, // currentTime (30) + default offset (10)
      });
    });

    it('should respect custom seekOffset', () => {
      setup({ direction: 'forward', seekOffset: 30 });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 60, // currentTime (30) + custom offset (30)
      });
    });
  });

  describe('backward direction', () => {
    it('should render a button', () => {
      setup({ direction: 'backward' });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have backward aria-label', () => {
      setup({ direction: 'backward' });
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Seek backward 10 seconds',
      );
    });

    it('should dispatch MEDIA_SEEK_REQUEST with negative offset when clicked', () => {
      setup({ direction: 'backward' });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 20, // currentTime (30) - default offset (10)
      });
    });

    it('should respect custom seekOffset', () => {
      setup({ direction: 'backward', seekOffset: 15 });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 15, // currentTime (30) - custom offset (15)
      });
    });
  });

  it('should pass className to button', () => {
    setup({ direction: 'forward', className: 'custom-class' });
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  describe('undefined media state', () => {
    it('should be disabled when mediaCurrentTime is undefined', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: undefined, mediaDuration: 100 }),
      );

      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when mediaDuration is undefined', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 30, mediaDuration: undefined }),
      );

      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when mediaDuration is zero', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 0, mediaDuration: 0 }),
      );

      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not dispatch when media is not loaded', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: undefined, mediaDuration: 100 }),
      );

      setup({ direction: 'forward' });
      fireEvent.click(screen.getByRole('button'));

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be enabled when media is loaded', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 30, mediaDuration: 100 }),
      );

      setup({ direction: 'forward' });
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  describe('boundary validation', () => {
    it('should clamp backward seek at 0 when near start', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 5, mediaDuration: 100 }),
      );

      setup({ direction: 'backward', seekOffset: 10 });
      fireEvent.click(screen.getByRole('button'));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 0, // clamped to 0 instead of -5
      });
    });

    it('should clamp forward seek at duration when near end', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 95, mediaDuration: 100 }),
      );

      setup({ direction: 'forward', seekOffset: 10 });
      fireEvent.click(screen.getByRole('button'));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 100, // clamped to duration instead of 105
      });
    });

    it('should clamp backward seek at 0 when at start', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 0, mediaDuration: 100 }),
      );

      setup({ direction: 'backward', seekOffset: 10 });
      fireEvent.click(screen.getByRole('button'));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 0,
      });
    });

    it('should clamp forward seek at duration when at end', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaCurrentTime: 100, mediaDuration: 100 }),
      );

      setup({ direction: 'forward', seekOffset: 10 });
      fireEvent.click(screen.getByRole('button'));

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 100,
      });
    });
  });

  describe('invalid seekOffset validation', () => {
    it('should use default seekOffset when seekOffset is NaN', () => {
      setup({ direction: 'forward', seekOffset: Number.NaN });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 40, // currentTime (30) + default offset (10)
      });
    });

    it('should use default seekOffset when seekOffset is Infinity', () => {
      setup({ direction: 'forward', seekOffset: Number.POSITIVE_INFINITY });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 40, // currentTime (30) + default offset (10)
      });
    });

    it('should use default seekOffset when seekOffset is negative', () => {
      setup({ direction: 'forward', seekOffset: -5 });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 40, // currentTime (30) + default offset (10)
      });
    });

    it('should use default seekOffset when seekOffset is zero', () => {
      setup({ direction: 'forward', seekOffset: 0 });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'mediaseekrequest',
        detail: 40, // currentTime (30) + default offset (10)
      });
    });
  });

  describe('disabled state', () => {
    it('should render disabled button when isDisabled is true', () => {
      setup({ direction: 'forward', isDisabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not dispatch seek request when disabled', () => {
      setup({ direction: 'forward', isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <SeekButton direction='forward' />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when context is disabled regardless of prop', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <SeekButton direction='forward' isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
