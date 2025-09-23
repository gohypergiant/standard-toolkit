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
import { Divider } from './';
import type { DividerProps } from './types';

function setup({
  orientation = 'horizontal',
  ...rest
}: Partial<DividerProps> = {}) {
  return {
    ...render(<Divider orientation={orientation} {...rest} />),
    orientation,
    ...rest,
  };
}

describe('Divider', () => {
  it('should render a horizontal divider by default', () => {
    setup();

    const divider = screen.getByRole('separator');

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should render a vertical divider when specified', () => {
    setup({ orientation: 'vertical' });

    const divider = screen.getByRole('separator');

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('data-orientation', 'vertical');
  });
});
