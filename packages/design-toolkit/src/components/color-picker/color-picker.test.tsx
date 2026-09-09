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
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker } from './';
import { CustomColorPicker } from './custom-color-picker';
import { NoColorButton } from './no-color-button';
import { parseColor } from 'react-aria-components';
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

function setup(props: Partial<ColorPickerProps> = {}) {
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

  it('should render NoColorButton when allowNull is true', () => {
    setup({ allowNull: true });

    const noColorButton = screen.getByLabelText('No color');
    expect(noColorButton).toBeInTheDocument();
  });

  it('should not render NoColorButton when allowNull is false', () => {
    setup({ allowNull: false });

    expect(screen.queryByLabelText('No color')).not.toBeInTheDocument();
  });

  it('should render CustomColorPicker when showCustomPicker is true', () => {
    setup({ showCustomPicker: true });

    const customColorButton = screen.getByLabelText('Open custom color picker');
    expect(customColorButton).toBeInTheDocument();
  });

  it('should not render CustomColorPicker when showCustomPicker is false', () => {
    setup({ showCustomPicker: false });

    expect(
      screen.queryByLabelText('Open custom color picker'),
    ).not.toBeInTheDocument();
  });

  it('should render both NoColorButton and CustomColorPicker when both props are true', () => {
    setup({ allowNull: true, showCustomPicker: true });

    expect(screen.getByLabelText('No color')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Open custom color picker'),
    ).toBeInTheDocument();
  });

  it('should call onChange when NoColorButton is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    setup({ allowNull: true, onChange });

    const noColorButton = screen.getByLabelText('No color');
    await user.click(noColorButton);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});

describe('NoColorButton', () => {
  it('should render', () => {
    const onClick = vi.fn();
    render(<NoColorButton onClick={onClick} />);

    const button = screen.getByLabelText('No color');
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<NoColorButton onClick={onClick} />);

    const button = screen.getByLabelText('No color');
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isDisabled is true', () => {
    const onClick = vi.fn();
    render(<NoColorButton isDisabled onClick={onClick} />);

    const button = screen.getByLabelText('No color');
    expect(button).toBeDisabled();
  });
});

describe('CustomColorPicker', () => {
  it('should render with color value', () => {
    const onChange = vi.fn();
    const color = parseColor('#30D27E');
    render(<CustomColorPicker colorValue={color} onChange={onChange} />);

    const button = screen.getByLabelText('Open custom color picker');
    expect(button).toBeInTheDocument();
  });

  it('should render with active state', () => {
    const onChange = vi.fn();
    const color = parseColor('#30D27E');
    render(
      <CustomColorPicker
        colorValue={color}
        isActive={true}
        onChange={onChange}
      />,
    );

    const button = screen.getByLabelText('Open custom color picker');
    expect(button).toHaveAttribute('data-selected');
  });

  it('should render without active state', () => {
    const onChange = vi.fn();
    const color = parseColor('#30D27E');
    render(
      <CustomColorPicker
        colorValue={color}
        isActive={false}
        onChange={onChange}
      />,
    );

    const button = screen.getByLabelText('Open custom color picker');
    expect(button).not.toHaveAttribute('data-selected');
  });

  it('should be disabled when isDisabled is true', () => {
    const onChange = vi.fn();
    const color = parseColor('#30D27E');
    render(
      <CustomColorPicker colorValue={color} isDisabled onChange={onChange} />,
    );

    const button = screen.getByLabelText('Open custom color picker');
    expect(button).toBeDisabled();
  });
});
