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
import { describe, expect, it, vi } from 'vitest';
import type { AudioProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => {
    const state = {
      mediaPaused: true,
      mediaMuted: false,
      mediaCurrentTime: 0,
      mediaDuration: 100,
      mediaVolume: 1,
      mediaVolumeLevel: 'high',
    };
    return selector(state);
  }),
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaProvider: ({ children }: { children: React.ReactNode }) => (
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
    children: React.ReactNode;
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
import { Audio } from './index';

function setup(props: Partial<AudioProps> = {}) {
  const defaultProps = {
    src: 'test-audio.mp3',
    ...props,
  };
  return render(<Audio {...defaultProps} />);
}

describe('Audio', () => {
  it('should render audio element with source', () => {
    setup({ src: 'test-audio.mp3' });
    const audio = document.querySelector('audio');
    expect(audio).toBeInTheDocument();
    const source = audio?.querySelector('source');
    expect(source).toHaveAttribute('src', 'test-audio.mp3');
  });

  it('should display title when provided', () => {
    setup({ title: 'audioFileName.flac' });
    expect(screen.getByText('audioFileName.flac')).toBeInTheDocument();
  });

  it('should not display title row when title is not provided', () => {
    setup({ src: 'test.mp3' });
    const titleRow = document.querySelector('[class*="titleRow"]');
    expect(titleRow).not.toBeInTheDocument();
  });

  it('should render default controls layout', () => {
    setup();
    // Should have play button
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    // Should have mute button
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
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
      <Audio src='test.mp3'>
        <span data-testid='custom-child'>Custom Content</span>
      </Audio>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    // Should not have default controls
    expect(
      screen.queryByRole('button', { name: 'Play' }),
    ).not.toBeInTheDocument();
  });

  it('should call onEnded callback when audio ends', () => {
    const onEnded = vi.fn();
    setup({ onEnded });
    const audio = document.querySelector('audio');
    if (audio) {
      fireEvent.ended(audio);
    }
    expect(onEnded).toHaveBeenCalledTimes(1);
  });

  it('should call onPlay callback when audio starts playing', () => {
    const onPlay = vi.fn();
    setup({ onPlay });
    const audio = document.querySelector('audio');
    if (audio) {
      fireEvent.play(audio);
    }
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('should call onPause callback when audio is paused', () => {
    const onPause = vi.fn();
    setup({ onPause });
    const audio = document.querySelector('audio');
    if (audio) {
      fireEvent.pause(audio);
    }
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('should call onTimeUpdate callback with current time', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    // Set currentTime and trigger event
    Object.defineProperty(audio, 'currentTime', { value: 42, writable: true });
    fireEvent.timeUpdate(audio);
    expect(onTimeUpdate).toHaveBeenCalledWith(42);
  });

  it('should not call onTimeUpdate callback when currentTime is NaN', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'currentTime', {
      value: Number.NaN,
      writable: true,
    });
    fireEvent.timeUpdate(audio);
    expect(onTimeUpdate).not.toHaveBeenCalled();
  });

  it('should not call onTimeUpdate callback when currentTime is Infinity', () => {
    const onTimeUpdate = vi.fn();
    setup({ onTimeUpdate });
    const audio = document.querySelector('audio') as HTMLAudioElement;
    Object.defineProperty(audio, 'currentTime', {
      value: Number.POSITIVE_INFINITY,
      writable: true,
    });
    fireEvent.timeUpdate(audio);
    expect(onTimeUpdate).not.toHaveBeenCalled();
  });

  it('should call onLoadedMetadata callback when metadata is loaded', () => {
    const onLoadedMetadata = vi.fn();
    setup({ onLoadedMetadata });
    const audio = document.querySelector('audio');
    if (audio) {
      fireEvent.loadedMetadata(audio);
    }
    expect(onLoadedMetadata).toHaveBeenCalledTimes(1);
  });

  it('should apply className to container', () => {
    setup({ className: 'custom-class' });
    const controller = screen.getByTestId('media-controller');
    expect(controller).toHaveClass('custom-class');
  });

  it('should apply classNames.container to container', () => {
    setup({ classNames: { container: 'container-class' } });
    const controller = screen.getByTestId('media-controller');
    expect(controller).toHaveClass('container-class');
  });

  it('should pass autoPlay to audio element', () => {
    setup({ autoPlay: true });
    const audio = document.querySelector('audio');
    expect(audio).toHaveAttribute('autoplay');
  });

  it('should pass loop to audio element', () => {
    setup({ loop: true });
    const audio = document.querySelector('audio');
    expect(audio).toHaveAttribute('loop');
  });

  it('should pass muted to audio element', () => {
    setup({ muted: true });
    const audio = document.querySelector('audio');
    expect(audio).toHaveProperty('muted', true);
  });

  it('should pass preload to audio element', () => {
    setup({ preload: 'auto' });
    const audio = document.querySelector('audio');
    expect(audio).toHaveAttribute('preload', 'auto');
  });

  it('should default preload to metadata', () => {
    setup();
    const audio = document.querySelector('audio');
    expect(audio).toHaveAttribute('preload', 'metadata');
  });

  it('should pass crossOrigin to audio element', () => {
    setup({ crossOrigin: 'anonymous' });
    const audio = document.querySelector('audio');
    expect(audio).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('should set audio attribute on MediaController', () => {
    setup();
    const controller = screen.getByTestId('media-controller');
    expect(controller).toHaveAttribute('data-audio', 'true');
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
        <Audio isDisabled src='test.mp3'>
          <PlayButton />
        </Audio>,
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
    it('should display fallback error message when audio fails to load with no error', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      fireEvent.error(audio);
      expect(screen.getByText('Unable to load audio file')).toBeInTheDocument();
    });

    it('should display fallback message for MEDIA_ERR_ABORTED (user-initiated abort)', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'error', {
        value: { code: 1 }, // MEDIA_ERR_ABORTED
        writable: true,
      });
      fireEvent.error(audio);
      // MEDIA_ERR_ABORTED is treated as non-error by media-chrome, so fallback is shown
      expect(screen.getByText('Unable to load audio file')).toBeInTheDocument();
    });

    it('should display MEDIA_ERR_NETWORK message', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'error', {
        value: { code: 2 }, // MEDIA_ERR_NETWORK
        writable: true,
      });
      fireEvent.error(audio);
      expect(
        screen.getByText('A network error caused the media download to fail.'),
      ).toBeInTheDocument();
    });

    it('should display MEDIA_ERR_DECODE message', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'error', {
        value: { code: 3 }, // MEDIA_ERR_DECODE
        writable: true,
      });
      fireEvent.error(audio);
      expect(
        screen.getByText(
          'A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.',
        ),
      ).toBeInTheDocument();
    });

    it('should display MEDIA_ERR_SRC_NOT_SUPPORTED message', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'error', {
        value: { code: 4 }, // MEDIA_ERR_SRC_NOT_SUPPORTED
        writable: true,
      });
      fireEvent.error(audio);
      expect(
        screen.getByText(
          'An unsupported error occurred. The server or network failed, or your browser does not support this format.',
        ),
      ).toBeInTheDocument();
    });

    it('should call onError callback with MediaError when audio fails', () => {
      const onError = vi.fn();
      setup({ onError });
      const audio = document.querySelector('audio') as HTMLAudioElement;
      const mockError = { code: 4, message: 'MEDIA_ERR_SRC_NOT_SUPPORTED' };
      Object.defineProperty(audio, 'error', {
        value: mockError,
        writable: true,
      });
      fireEvent.error(audio);
      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should disable all controls when audio fails to load', () => {
      setup();
      const audio = document.querySelector('audio') as HTMLAudioElement;
      fireEvent.error(audio);
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });

    it('should reset error state when source changes', () => {
      const { rerender } = render(<Audio src='bad-audio.mp3' />);
      const audio = document.querySelector('audio') as HTMLAudioElement;
      Object.defineProperty(audio, 'error', {
        value: { code: 4 },
        writable: true,
      });
      fireEvent.error(audio);
      const errorMessage =
        'An unsupported error occurred. The server or network failed, or your browser does not support this format.';
      expect(screen.getByText(errorMessage)).toBeInTheDocument();

      rerender(<Audio src='good-audio.mp3' />);
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });
});
