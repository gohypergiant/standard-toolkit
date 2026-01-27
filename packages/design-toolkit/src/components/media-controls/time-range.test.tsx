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
import type { TimeRangeProps } from './types';

// Mock media-chrome components
vi.mock('media-chrome/react', () => ({
  MediaTimeRange: vi.fn(({ children, disabled, ...props }) => (
    <input
      type='range'
      data-testid='media-time-range'
      disabled={disabled}
      {...props}
    />
  )),
  MediaTimeDisplay: vi.fn(() => <span data-testid='media-time-display' />),
}));

// Mock media-chrome store hooks
vi.mock('media-chrome/react/media-store', () => ({
  useMediaStore: vi.fn(() => ({ getState: vi.fn() })),
}));

// Import after mocking
import { MediaControlsProvider } from './context';
import { TimeRange } from './time-range';

function setup(props: Partial<TimeRangeProps> = {}) {
  render(<TimeRange {...props} />);
  return props;
}

describe('TimeRange', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MediaTimeRange', () => {
    setup();
    expect(screen.getByTestId('media-time-range')).toBeInTheDocument();
  });

  it('should pass className to the wrapper', () => {
    setup({ className: 'custom-class' });
    const wrapper = screen.getByTestId('media-time-range').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  describe('disabled state', () => {
    it('should pass disabled to underlying range input', () => {
      setup({ isDisabled: true });
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should be disabled when context provides isDisabled=true', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <TimeRange />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('slider')).toBeDisabled();
    });

    it('should be disabled when context is disabled regardless of prop', () => {
      render(
        <MediaControlsProvider isDisabled={true}>
          <TimeRange isDisabled={false} />
        </MediaControlsProvider>,
      );
      expect(screen.getByRole('slider')).toBeDisabled();
    });
  });
});
