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
import type { PlayButtonProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn(() => true), // mediaPaused = true by default
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaActionTypes: {
    MEDIA_PLAY_REQUEST: 'mediaplayrequest',
    MEDIA_PAUSE_REQUEST: 'mediapauserequest',
  },
}));

import { useMediaSelector } from 'media-chrome/react/media-store';
// Import after mocking
import { MediaControlsProvider } from './context';
import { PlayButton } from './play-button';

function setup(props: Partial<PlayButtonProps> = {}) {
  render(
    <MediaControlsProvider>
      <PlayButton {...props} />
    </MediaControlsProvider>,
  );
  return props;
}

describe('PlayButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a button', () => {
    setup();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show play icon when media is paused', () => {
    vi.mocked(useMediaSelector).mockReturnValue(true); // paused
    setup();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Play');
  });

  it('should show pause icon when media is playing', () => {
    vi.mocked(useMediaSelector).mockReturnValue(false); // not paused
    setup();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Pause');
  });

  it('should dispatch MEDIA_PLAY_REQUEST when clicked while paused', () => {
    vi.mocked(useMediaSelector).mockReturnValue(true); // paused
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaplayrequest',
    });
  });

  it('should dispatch MEDIA_PAUSE_REQUEST when clicked while playing', () => {
    vi.mocked(useMediaSelector).mockReturnValue(false); // not paused
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediapauserequest',
    });
  });

  it('should pass className to button', () => {
    setup({ className: 'custom-class' });
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  describe('disabled state', () => {
    it('should render disabled button when isDisabled is true', () => {
      setup({ isDisabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should not dispatch play request when disabled', () => {
      vi.mocked(useMediaSelector).mockReturnValue(true); // paused
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch pause request when disabled', () => {
      vi.mocked(useMediaSelector).mockReturnValue(false); // playing
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <PlayButton />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should allow isDisabled prop to override context', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <PlayButton isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
