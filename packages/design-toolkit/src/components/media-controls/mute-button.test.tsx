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
import { describe, expect, it, vi } from 'vitest';
import type { MuteButtonProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn(
    (selector: (state: Record<string, unknown>) => unknown) =>
      selector({ mediaMuted: false, mediaVolumeLevel: 'high' }),
  ),
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  VolumeLevels: {
    OFF: 'off',
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
  MediaActionTypes: {
    MEDIA_MUTE_REQUEST: 'mediamuterequest',
    MEDIA_UNMUTE_REQUEST: 'mediaunmuterequest',
  },
}));

import { useMediaSelector } from 'media-chrome/react/media-store';
// Import after mocking
import { MediaControlsProvider } from './context';
import { MuteButton } from './mute-button';

function setup(props: Partial<MuteButtonProps> = {}) {
  render(<MuteButton {...props} />);
  return props;
}

describe('MuteButton', () => {
  it('should render a button', () => {
    setup();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show volume icon when not muted', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: false, mediaVolumeLevel: 'high' }),
    );
    setup();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Mute');
  });

  it('should show muted icon when muted', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: true, mediaVolumeLevel: 'off' }),
    );
    setup();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Unmute');
  });

  it('should show muted icon when volume is 0 (mediaVolumeLevel is off)', () => {
    // Volume at 0 but mediaMuted is false - should still show muted icon
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: false, mediaVolumeLevel: 'off' }),
    );
    setup();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Unmute');
  });

  it('should dispatch mediamuterequest when clicked while not muted', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: false, mediaVolumeLevel: 'high' }),
    );
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediamuterequest',
    });
  });

  it('should dispatch mediaunmuterequest when clicked while muted', () => {
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: true, mediaVolumeLevel: 'off' }),
    );
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaunmuterequest',
    });
  });

  it('should dispatch mediamuterequest when clicked at zero volume (not explicitly muted)', () => {
    // When volume is 0 but not explicitly muted, clicking should mute
    vi.mocked(useMediaSelector).mockImplementation((selector) =>
      selector({ mediaMuted: false, mediaVolumeLevel: 'off' }),
    );
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediamuterequest',
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

    it('should not dispatch mute request when disabled', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaMuted: false, mediaVolumeLevel: 'high' }),
      );
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch unmute request when disabled', () => {
      vi.mocked(useMediaSelector).mockImplementation((selector) =>
        selector({ mediaMuted: true, mediaVolumeLevel: 'off' }),
      );
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <MuteButton />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when context is disabled regardless of prop', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <MuteButton isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
