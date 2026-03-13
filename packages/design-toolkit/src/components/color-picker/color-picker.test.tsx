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
import { describe, expect, it } from 'vitest';
import { ColorPicker } from './';
import type { Rgba255Tuple } from '@accelint/predicates/is-rgba-255-tuple';
import type { ColorPickerProps } from './types';

const items = [
  '#ECECE6',
  '#898989',
  '#62a6ff',
  '#30D27E',
  '#FCA400',
  '#D4231D',
];

function setup(props: Partial<ColorPickerProps<string>> = {}) {
  return {
    ...render(<ColorPicker items={items} {...props} />),
    ...props,
  };
}

describe('ColorPicker', () => {
  it('should render', () => {
    setup();

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should render with RGBA tuple items', () => {
    const rgbaItems: Rgba255Tuple[] = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ];

    render(<ColorPicker items={rgbaItems} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('should render with defaultValue as RGBA tuple', () => {
    const rgbaItems: Rgba255Tuple[] = [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
    ];

    render(<ColorPicker items={rgbaItems} defaultValue={[255, 0, 0, 255]} />);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should render with mixed items (strings and RGBA tuples)', () => {
    const mixedItems: (string | Rgba255Tuple)[] = [
      '#FF0000',
      [0, 255, 0, 255],
      '#0000FF',
      [255, 255, 0, 255],
    ];

    render(<ColorPicker items={mixedItems} />);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });

  it('should render a label when provided', () => {
    setup({ label: 'Pick a color' });

    expect(screen.getByText(/^Pick a color/)).toBeInTheDocument();
  });

  it('should render label without "(optional)" when isRequired is true', () => {
    setup({ label: 'Pick a color', isRequired: true });

    const label = screen.getByText('Pick a color');
    expect(label).toBeInTheDocument();
    expect(label).not.toHaveTextContent('(optional)');
  });

  it('should not render a label when not provided', () => {
    setup();

    expect(screen.queryByText('Pick a color')).not.toBeInTheDocument();
  });
});
