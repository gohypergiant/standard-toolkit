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
import type { ReactNode } from 'react';
import type { VideoProps } from './types';

vi.mock('@accelint/icons', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@accelint/icons')>();
  return {
    ...actual,
    Loop: () => <svg data-testid='loop-icon' />,
    Problem: () => <svg data-testid='problem-icon' />,
  };
});

// Mock media-chrome hooks
const mockDispatch = vi.fn();
const defaultMediaState = {
  mediaPaused: true,
  mediaMuted: false,
  mediaCurrentTime: 0,
  mediaDuration: 100,
  mediaVolume: 1,
  mediaVolumeLevel: 'high',
  mediaIsFullscreen: false,
  mediaLoading: false,
};
let mediaStateOverrides: Partial<typeof defaultMediaState> = {};

vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => {
    return selector({ ...defaultMediaState, ...mediaStateOverrides });
  }),
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid='media-provider'>{children}</div>
  ),
  useMediaRef: vi.fn(() => vi.fn()),
  VolumeLevels: {
    OFF: 'off',
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
}));

// Mock media-chrome/react components
vi.mock('media-chrome/react', () => ({
  MediaController: ({
    children,
    className,
    audio,
    ...props
  }: {
    children: ReactNode;
    className?: string;
    audio?: boolean;
  }) => (
    <div
      data-testid='media-controller'
      className={className}
      data-audio={audio}
      {...props}
    >
      {children}
    </div>
  ),
  MediaVolumeRange: ({ className }: { className?: string }) => (
    <input type='range' className={className} data-testid='volume-range' />
  ),
  MediaTimeRange: ({ className }: { className?: string }) => (
    <input type='range' className={className} data-testid='time-range' />
  ),
  MediaTimeDisplay: ({ className }: { className?: string }) => (
    <span className={className} data-testid='time-display'>
      0:00
    </span>
  ),
  MediaDurationDisplay: ({ className }: { className?: string }) => (
    <span className={className} data-testid='duration-display'>
      1:40
    </span>
  ),
  MediaPlaybackRateButton: ({
    className,
    rates: _rates,
  }: {
    className?: string;
    rates?: number[];
  }) => (
    <button type='button' className={className} data-testid='playback-rate'>
      1x
    </button>
  ),
}));

import { PlayButton } from '../media-controls/play-button';
// Import after mocking
import { Video } from './index';

function simulateVideoError(video: HTMLElement, code: number) {
  Object.defineProperty(video, 'error', {
    value: { code },
    writable: true,
    configurable: true,
  });
  fireEvent.error(video);
}

function setup(props: Partial<VideoProps> = {}) {
  const defaultProps = {
    src: 'test-video.mp4',
    ...props,
  };
  return render(<Video {...defaultProps} />);
}

describe('Video', () => {
  beforeEach(() => {
    mediaStateOverrides = {};
  });

  it('should render video element with source', () => {
    setup({ src: 'test-video.mp4' });
    const video = screen.getByTestId('video-element');
    expect(video).toBeInTheDocument();
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', 'test-video.mp4');
  });

  it('should render default controls layout', () => {
    setup();
    // Should have play button
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    // Should have mute button
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
    // Should have fullscreen button
    expect(
      screen.getByRole('button', { name: 'Enter fullscreen' }),
    ).toBeInTheDocument();
    // Should have volume slider
    expect(screen.getByTestId('volume-range')).toBeInTheDocument();
    // Should have time range
    expect(screen.getByTestId('time-range')).toBeInTheDocument();
    // Should have time display
    expect(screen.getByTestId('time-display')).toBeInTheDocument();
    // Should have duration display
    expect(screen.getByTestId('duration-display')).toBeInTheDocument();
    // Should have playback rate button
    expect(screen.getByTestId('playback-rate')).toBeInTheDocument();
    // Should have seek buttons
    expect(
      screen.getByRole('button', { name: /seek backward/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /seek forward/i }),
    ).toBeInTheDocument();
  });

  it('should support custom children override', () => {
    render(
      <Video src='test.mp4'>
        <span data-testid='custom-child'>Custom Content</span>
      </Video>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    // Should not have default controls
    expect(
      screen.queryByRole('button', { name: 'Play' }),
    ).not.toBeInTheDocument();
  });

  it('should call onEnded callback when video ends', () => {
    const onEnded = vi.fn();
    setup({ onEnded });
    const video = screen.getByTestId('video-element');
    fireEvent.ended(video);
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it('should call onTimeUpdate callback with current time', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const video = screen.getByTestId('video-element');
    Object.defineProperty(video, 'currentTime', {
      value: 42,
      writable: true,
    });
    fireEvent.timeUpdate(video);
    expect(onTimeUpdate).toHaveBeenCalledTimes(1);
    expect(onTimeUpdate).toHaveBeenCalledWith(42);
  });

  it('should not call onTimeUpdate callback when currentTime is NaN', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const video = screen.getByTestId('video-element');
    Object.defineProperty(video, 'currentTime', {
      value: Number.NaN,
      writable: true,
    });
    fireEvent.timeUpdate(video);
    expect(onTimeUpdate).not.toHaveBeenCalled();
  });

  it('should not call onTimeUpdate callback when currentTime is Infinity', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const video = screen.getByTestId('video-element');
    Object.defineProperty(video, 'currentTime', {
      value: Number.POSITIVE_INFINITY,
      writable: true,
    });
    fireEvent.timeUpdate(video);
    expect(onTimeUpdate).not.toHaveBeenCalled();
  });

  it('should apply classNames.container to container', () => {
    setup({ classNames: { container: 'container-class' } });
    const controller = screen.getByTestId('media-controller');
    expect(controller).toHaveClass('container-class');
  });

  it('should pass autoPlay to video element', () => {
    setup({ autoPlay: true });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('autoplay');
  });

  it('should pass loop to video element', () => {
    setup({ loop: true });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('loop');
  });

  it('should pass muted to video element', () => {
    setup({ muted: true });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveProperty('muted', true);
  });

  it('should pass preload to video element', () => {
    setup({ preload: 'auto' });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('preload', 'auto');
  });

  it('should default preload to metadata', () => {
    setup();
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('preload', 'metadata');
  });

  it('should pass crossOrigin to video element', () => {
    setup({ crossOrigin: 'anonymous' });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('should pass poster to video element', () => {
    setup({ poster: 'thumbnail.jpg' });
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('poster', 'thumbnail.jpg');
  });

  it('should have playsInline attribute on video element', () => {
    setup();
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('playsinline');
  });

  it('should not set audio attribute on MediaController', () => {
    setup();
    const controller = screen.getByTestId('media-controller');
    expect(controller).not.toHaveAttribute('data-audio');
  });

  describe('disabled state', () => {
    it('should have data-disabled attribute when isDisabled', () => {
      setup({ isDisabled: true });
      const controller = screen.getByTestId('media-controller');
      expect(controller).toHaveAttribute('data-disabled');
    });

    it('should disable all controls when isDisabled', () => {
      setup({ isDisabled: true });
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });

    it('should pass isDisabled to custom children via context', () => {
      render(
        <Video isDisabled src='test.mp4'>
          <PlayButton />
        </Video>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not have data-disabled when isDisabled is false', () => {
      setup({ isDisabled: false });
      const controller = screen.getByTestId('media-controller');
      expect(controller).not.toHaveAttribute('data-disabled');
    });
  });

  describe('error state', () => {
    it('should display fallback error message when video fails to load with no error', () => {
      setup();
      const video = screen.getByTestId('video-element');
      fireEvent.error(video);
      expect(screen.getByText('Unable to load video file')).toBeInTheDocument();
    });

    it.each([
      {
        code: 1,
        name: 'MEDIA_ERR_ABORTED',
        // MEDIA_ERR_ABORTED is treated as non-error by media-chrome, so fallback is shown
        expectedMessage: 'Unable to load video file',
      },
      {
        code: 2,
        name: 'MEDIA_ERR_NETWORK',
        expectedMessage: 'A network error caused the media download to fail.',
      },
      {
        code: 3,
        name: 'MEDIA_ERR_DECODE',
        expectedMessage:
          'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
      },
      {
        code: 4,
        name: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
        expectedMessage:
          'An unsupported error occurred. The server or network failed, or your browser does not support this format.',
      },
    ])('should display $name (code $code) message', ({
      code,
      expectedMessage,
    }) => {
      setup();
      const video = screen.getByTestId('video-element');
      simulateVideoError(video, code);
      expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });

    it('should call onError callback with MediaError when video fails', () => {
      const onError = vi.fn();
      setup({ onError });
      const video = screen.getByTestId('video-element');
      simulateVideoError(video, 4);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith({ code: 4 });
    });

    it('should not call onError when video error property is null', () => {
      const onError = vi.fn();
      setup({ onError });
      const video = screen.getByTestId('video-element');
      // error property defaults to null on HTMLVideoElement
      fireEvent.error(video);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should disable all controls when video fails to load', () => {
      setup();
      const video = screen.getByTestId('video-element');
      fireEvent.error(video);
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });

    it('should render error with alert role when video fails to load', () => {
      setup();
      const video = screen.getByTestId('video-element');
      fireEvent.error(video);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should show error overlay even with custom children', () => {
      render(
        <Video src='bad-video.mp4'>
          <span data-testid='custom-child'>Custom</span>
        </Video>,
      );
      const video = screen.getByTestId('video-element');
      fireEvent.error(video);
      expect(screen.getByText('Unable to load video file')).toBeInTheDocument();
      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    });

    it('should reset error state when source changes', () => {
      const { rerender } = render(<Video src='bad-video.mp4' />);
      const video = screen.getByTestId('video-element');
      simulateVideoError(video, 4);
      const errorMessage =
        'An unsupported error occurred. The server or network failed, or your browser does not support this format.';
      expect(screen.getByText(errorMessage)).toBeInTheDocument();

      rerender(<Video src='good-video.mp4' />);
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).not.toBeDisabled();
      }
    });
  });

  describe('loading state', () => {
    it('should show loading overlay when metadata has not loaded', () => {
      mediaStateOverrides = { mediaDuration: 0, mediaLoading: false };
      setup();
      expect(screen.getByLabelText('Loading video')).toBeInTheDocument();
    });

    it('should show loading overlay when media is buffering', () => {
      mediaStateOverrides = { mediaDuration: 100, mediaLoading: true };
      setup();
      expect(screen.getByLabelText('Loading video')).toBeInTheDocument();
    });

    it('should not show loading overlay when metadata is loaded and not buffering', () => {
      mediaStateOverrides = { mediaDuration: 100, mediaLoading: false };
      setup();
      expect(screen.queryByLabelText('Loading video')).not.toBeInTheDocument();
    });

    it('should not show loading overlay when in error state', () => {
      mediaStateOverrides = { mediaDuration: 0, mediaLoading: true };
      setup();
      const video = screen.getByTestId('video-element');
      fireEvent.error(video);
      expect(screen.queryByLabelText('Loading video')).not.toBeInTheDocument();
    });
  });
});
