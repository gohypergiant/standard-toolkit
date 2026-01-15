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
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn((selector) => {
    // Return sensible defaults based on what's being selected
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
  VolumeLevels: {
    OFF: 'off',
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
}));

// Mock media-chrome/react components
vi.mock('media-chrome/react', () => ({
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

// Import after mocking
import { MediaControls } from './index';
import { MuteButton } from './mute-button';
import { PlayButton } from './play-button';
import { TimeDisplay } from './time-display';
import { TimeRange } from './time-range';
import { VolumeSlider } from './volume-slider';

describe('MediaControls', () => {
  it('should render children', () => {
    render(
      <MediaControls>
        <span data-testid='custom-child'>Custom Content</span>
      </MediaControls>,
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('should render composed controls', () => {
    render(
      <MediaControls>
        <PlayButton />
        <TimeDisplay mode='current' />
        <TimeRange />
        <MuteButton />
        <VolumeSlider />
      </MediaControls>,
    );
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    expect(screen.getByTestId('time-display')).toBeInTheDocument();
    expect(screen.getByTestId('time-range')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
    expect(screen.getByTestId('volume-range')).toBeInTheDocument();
  });

  it('should apply className to container', () => {
    const { container } = render(<MediaControls className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply classNames.container to container', () => {
    const { container } = render(
      <MediaControls classNames={{ container: 'container-class' }} />,
    );
    expect(container.firstChild).toHaveClass('container-class');
  });

  describe('disabled state', () => {
    it('should have data-disabled attribute when isDisabled', () => {
      const { container } = render(<MediaControls isDisabled />);
      expect(container.firstChild).toHaveAttribute('data-disabled');
    });

    it('should disable all child button controls when isDisabled', () => {
      render(
        <MediaControls isDisabled>
          <PlayButton />
          <MuteButton />
        </MediaControls>,
      );
      const buttons = screen.getAllByRole('button');
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });

    it('should not have data-disabled when isDisabled is false', () => {
      const { container } = render(<MediaControls isDisabled={false} />);
      expect(container.firstChild).not.toHaveAttribute('data-disabled');
    });
  });
});
