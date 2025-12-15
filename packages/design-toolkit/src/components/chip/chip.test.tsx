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
import { describe, expect, it } from 'vitest';
import { Chip } from './';
import type { ChipProps } from './types';

function setup({ children = 'Foo', ...rest }: Partial<ChipProps> = {}) {
  render(<Chip {...rest}>{children}</Chip>);

  return {
    ...rest,
    children,
  };
}

describe('Chip', () => {
  it('should render', () => {
    const { children } = setup();

    expect(screen.getByText(`${children}`)).toBeInTheDocument();
  });

  it('should render with default color and size', () => {
    setup();

    const chip = screen.getByText('Foo').closest('[data-color]');

    expect(chip).toHaveAttribute('data-color', 'info');
    expect(chip).toHaveAttribute('data-size', 'medium');
  });

  it.each([
    'info',
    'advisory',
    'normal',
    'serious',
    'critical',
  ] as const)('should render with color="%s"', (color) => {
    setup({ color });

    const chip = screen.getByText('Foo').closest('[data-color]');

    expect(chip).toHaveAttribute('data-color', color);
  });

  it.each([
    'medium',
    'small',
  ] as const)('should render with size="%s"', (size) => {
    setup({ size });

    const chip = screen.getByText('Foo').closest('[data-size]');

    expect(chip).toHaveAttribute('data-size', size);
  });

  it('should apply custom className', () => {
    setup({ className: 'custom-class' });

    const chip = screen.getByText('Foo').closest('.custom-class');

    expect(chip).toBeInTheDocument();
  });

  it('should render children content', () => {
    setup({ children: 'Custom Content' });

    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });
});
