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
import { describe, expect, it, vi } from 'vitest';
import { Range } from './range';

describe('Range Component', () => {
  const defaultProps = {
    altText: 'Adjust the range',
    label: 'Test Range',
    max: 100,
    min: 0,
    onUpdate: vi.fn(),
    step: 1,
    preview: '50%',
    value: 50,
  };

  it('should render without crashing', () => {
    render(<Range {...defaultProps} />);
  });

  it('should display the label and preview text', () => {
    render(<Range {...defaultProps} />);
    const labelElement = screen.getByText('Test Range');
    const previewElement = screen.getByText('50%');

    expect(labelElement).toBeInTheDocument();
    expect(previewElement).toBeInTheDocument();
  });

  it('should set the correct attributes on the input element', () => {
    render(<Range {...defaultProps} />);
    const inputElement = screen.getByRole('slider');

    expect(inputElement).toHaveAttribute('id', 'Test Range');
    expect(inputElement).toHaveAttribute('max', '100');
    expect(inputElement).toHaveAttribute('min', '0');
    expect(inputElement).toHaveAttribute('name', 'Test Range');
    expect(inputElement).toHaveAttribute('step', '1');
    expect(inputElement).toHaveAttribute('type', 'range');
    expect(inputElement).toHaveAttribute('value', '50');
  });

  it('should call onUpdate when the range is changed', () => {
    render(<Range {...defaultProps} />);
    const inputElement = screen.getByRole('slider');

    fireEvent.change(inputElement, { target: { value: 75 } });
    expect(defaultProps.onUpdate).toHaveBeenCalledTimes(1);
  });

  it('should display the correct title (altText)', () => {
    render(<Range {...defaultProps} />);
    const divElement = screen.getByTitle('Adjust the range');

    expect(divElement).toBeInTheDocument();
  });
});
