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
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClearButton } from './clear';
import type { ClearButtonProps } from './clear';

function setup(props: Partial<ClearButtonProps> = {}) {
  render(<ClearButton {...props} />);
}

describe('ClearButton', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onPress when clicked', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    setup({ onPress });

    await user.click(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    setup({ isDisabled: true, onPress });

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    await user.click(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('should be excluded from tab order', () => {
    setup();

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('tabindex', '-1');
  });

  it('should forward aria attributes', () => {
    setup({ 'aria-label': 'Clear input' });

    const button = screen.getByRole('button', { name: 'Clear input' });

    expect(button).toBeInTheDocument();
  });

  it('should handle hover state', async () => {
    const user = userEvent.setup();
    setup();

    const button = screen.getByRole('button');

    await user.hover(button);

    expect(button).toHaveAttribute('data-hovered', 'true');
  });

  it('should handle press state', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    setup({ onPress });

    const button = screen.getByRole('button');

    await user.pointer({ keys: '[MouseLeft>]', target: button });

    expect(button).toHaveAttribute('data-pressed', 'true');
  });
});
