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
import type { FullscreenButtonProps } from './types';

// Mock media-chrome hooks
const mockDispatch = vi.fn();
vi.mock('media-chrome/react/media-store', () => ({
  useMediaSelector: vi.fn(() => false), // mediaIsFullscreen = false by default
  useMediaDispatch: vi.fn(() => mockDispatch),
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
  MediaActionTypes: {
    MEDIA_ENTER_FULLSCREEN_REQUEST: 'mediaenterfullscreenrequest',
    MEDIA_EXIT_FULLSCREEN_REQUEST: 'mediaexitfullscreenrequest',
  },
}));

import { useMediaSelector } from 'media-chrome/react/media-store';
// Import after mocking
import { MediaControlsProvider } from './context';
import { FullscreenButton } from './fullscreen-button';

function setup(props: Partial<FullscreenButtonProps> = {}) {
  render(
    <MediaControlsProvider>
      <FullscreenButton {...props} />
    </MediaControlsProvider>,
  );
  return props;
}

describe('FullscreenButton', () => {
  it('should render a button', () => {
    setup();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show enter fullscreen label when not fullscreen', () => {
    vi.mocked(useMediaSelector).mockReturnValue(false);
    setup();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Enter fullscreen',
    );
  });

  it('should show exit fullscreen label when fullscreen', () => {
    vi.mocked(useMediaSelector).mockReturnValue(true);
    setup();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Exit fullscreen',
    );
  });

  it('should dispatch MEDIA_ENTER_FULLSCREEN_REQUEST when clicked while not fullscreen', () => {
    vi.mocked(useMediaSelector).mockReturnValue(false);
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaenterfullscreenrequest',
    });
  });

  it('should dispatch MEDIA_EXIT_FULLSCREEN_REQUEST when clicked while fullscreen', () => {
    vi.mocked(useMediaSelector).mockReturnValue(true);
    setup();
    fireEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'mediaexitfullscreenrequest',
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

    it('should not dispatch enter fullscreen request when disabled', () => {
      vi.mocked(useMediaSelector).mockReturnValue(false);
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should not dispatch exit fullscreen request when disabled', () => {
      vi.mocked(useMediaSelector).mockReturnValue(true);
      setup({ isDisabled: true });
      fireEvent.click(screen.getByRole('button'));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <FullscreenButton />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should be disabled when context is disabled regardless of prop', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <FullscreenButton isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
