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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { VolumeSliderProps } from './types';

// Mock media-chrome components
vi.mock('media-chrome/react', () => ({
  MediaVolumeRange: vi.fn(({ children, disabled, ...props }) => (
    <input
      type='range'
      data-testid='media-volume-range'
      disabled={disabled}
      {...props}
    />
  )),
}));

// Mock media-chrome store hooks
vi.mock('media-chrome/react/media-store', () => ({
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
}));

// Import after mocking
import { MediaControlsProvider } from './context';
import { VolumeSlider } from './volume-slider';

function setup(props: Partial<VolumeSliderProps> = {}) {
  render(<VolumeSlider {...props} />);
  return props;
}

describe('VolumeSlider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MediaVolumeRange', () => {
    setup();
    expect(screen.getByTestId('media-volume-range')).toBeInTheDocument();
  });

  it('should pass className to the wrapper', () => {
    setup({ className: 'custom-class' });
    const wrapper = screen.getByTestId('media-volume-range').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render label when showLabel is true', () => {
    setup({ showLabel: true });
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('should not render label when showLabel is false', () => {
    setup({ showLabel: false });
    expect(screen.queryByText('Volume')).not.toBeInTheDocument();
  });

  it('should not render label by default', () => {
    setup();
    expect(screen.queryByText('Volume')).not.toBeInTheDocument();
  });

  describe('disabled state', () => {
    it('should have data-disabled attribute when isDisabled', () => {
      setup({ isDisabled: true });
      const wrapper = screen.getByTestId('media-volume-range').parentElement;
      expect(wrapper).toHaveAttribute('data-disabled');
    });

    it('should pass disabled to underlying range input', () => {
      setup({ isDisabled: true });
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <VolumeSlider />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should allow isDisabled prop to override context', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <VolumeSlider isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('slider')).not.toBeDisabled();
    });
  });
});
